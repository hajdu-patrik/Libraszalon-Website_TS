

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { chromium, type Browser, type Page } from 'playwright-core';
import { navItems } from '../src/content/nav.ts';
import { noticeStorageKey } from '../src/content/notice.ts';
import { INTRO_STORAGE_KEY } from '../src/lib/intro.ts';

const PORT = 4877;
const BASE = process.env.BASE ?? `http://localhost:${PORT}`;
const OUT_DIR = resolve('out');

const PAGES = [
  '/',
  '/bemutatkozas/',
  '/arak/',
  '/arak/elso-masszazs/',
  '/hazirend/',
  '/kapcsolat/',
];

type Config = {

  label: string;
  width: number;
  height: number;

  textScale?: number;
};

const CONFIGS: Config[] = [
  { label: '320', width: 320, height: 900 },
  { label: '360', width: 360, height: 900 },
  { label: '390', width: 390, height: 900 },
  { label: '768', width: 768, height: 900 },
  { label: '1024', width: 1024, height: 900 },
  { label: '1440', width: 1440, height: 900 },
  { label: '320x256', width: 320, height: 256 },
  { label: '200%', width: 1280, height: 1024, textScale: 2 },
];

type Problem = { page: string; config: string; issue: string };
const problems: Problem[] = [];

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function resolveFile(urlPath: string): string | null {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const target = resolve(join(OUT_DIR, clean));
  if (target !== OUT_DIR && !target.startsWith(OUT_DIR + sep)) return null;

  for (const candidate of [target, join(target, 'index.html'), `${target}.html`]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function startServer(): Promise<Server> {
  const server = createServer((req, res) => {
    const hit = resolveFile(req.url ?? '/');
    const file = hit ?? join(OUT_DIR, '404.html');
    if (!existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(hit ? 200 : 404, {
      'content-type': MIME[extname(file)] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(res);
  });

  return new Promise((ok, fail) => {
    server.once('error', fail);
    server.listen(PORT, () => ok(server));
  });
}

async function reachable(): Promise<boolean> {
  try {
    await fetch(BASE, { signal: AbortSignal.timeout(2000) });
    return true;
  } catch {
    return false;
  }
}

async function auditPage(page: Page, path: string, config: Config) {
  await page.setViewportSize({ width: config.width, height: config.height });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30_000 });

  if (config.textScale) {
    await page.addStyleTag({
      content: `:root { font-size: ${config.textScale * 100}% }`,
    });
  }

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 400));
  });

  const result = await page.evaluate(() => {
    const limit = document.documentElement.clientWidth;

    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return false;
        const style = getComputedStyle(el);
        if (style.overflowX === 'auto' || style.overflowX === 'scroll') return false;
        if (rect.right <= limit + 1 && rect.left >= -1) return false;

        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (getComputedStyle(p).overflowX !== 'visible') return false;
        }
        return true;
      })
      .slice(0, 4)
      .map((el) => {
        const r = el.getBoundingClientRect();
        const first = (el.className || '').toString().split(' ')[0];
        return `${el.tagName}${first ? `.${first}` : ''} ${Math.round(r.left)}..${Math.round(r.right)}`;
      });

    const reveals = document.querySelectorAll('[data-reveal]').length;
    const revealed = document.querySelectorAll('[data-revealed]').length;

    const small = [...document.querySelectorAll('a[href], button')]
      .filter((el) => !el.className.toString().includes('sr-only'))
      .filter((el) => getComputedStyle(el).display !== 'inline')
      .filter((el) => !el.hasAttribute('data-target-exempt'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44);
      })
      .slice(0, 4)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${el.tagName}"${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 22)}" ${Math.round(r.width)}x${Math.round(r.height)}`;
      });

    return {
      h1: document.querySelectorAll('h1').length,
      reveals,
      revealed,
      overflowing,
      small,
    };
  });

  const at = (issue: string) => problems.push({ page: path, config: config.label, issue });

  if (result.overflowing.length > 0) {
    at(`vizszintes tulcsordulas: ${result.overflowing.join(', ')} (limit ${config.width})`);
  }

  if (result.reveals > 0 && result.revealed < result.reveals) {
    at(`rejtve maradt tartalom: ${result.revealed}/${result.reveals} reveal futott le`);
  }

  if (result.h1 !== 1) {
    at(`h1 darabszam: ${result.h1} (1 kell)`);
  }

  if (result.small.length > 0) {
    at(`tul kicsi kattinthato elem: ${result.small.join(' | ')}`);
  }

  return result;
}

async function auditWithoutScript(browser: Browser, path: string) {
  const context = await browser.newContext({ locale: 'hu-HU', javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${BASE}${path}`, { waitUntil: 'load', timeout: 30_000 });

  const result = await page.evaluate((hrefs: string[]) => {
    const all = [...document.querySelectorAll('[data-reveal]')];
    const hidden = all.filter((el) => getComputedStyle(el).opacity !== '1');
    const unreachable = hrefs.filter((h) => !document.querySelector(`a[href="${h}"]`));
    return { total: all.length, hidden: hidden.length, unreachable };
  }, navItems.map((item) => item.href));

  await context.close();

  if (result.hidden > 0) {
    problems.push({
      page: path,
      config: 'no-JS',
      issue: `JS nelkul rejtve: ${result.hidden}/${result.total} reveal elem opacity < 1`,
    });
  }

  if (result.unreachable.length > 0) {
    problems.push({
      page: path,
      config: 'no-JS',
      issue: `JS nelkul elerhetetlen nav cel: ${result.unreachable.join(', ')}`,
    });
  }

  return result;
}

async function auditMobileDrawer(page: Page, config: Config) {
  await page.setViewportSize({ width: config.width, height: config.height });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30_000 });

  const at = (issue: string) =>
    problems.push({ page: '/ (menu)', config: config.label, issue });

  const toggle = page.locator('button[aria-expanded]').first();
  if ((await toggle.count()) === 0) {
    at('nincs hamburger gomb a fejlecben');
    return null;
  }

  await toggle.click();
  await page.waitForTimeout(700);

  const result = await page.evaluate(() => {
    const drawer = document.querySelector('#mobile-menu');
    if (!drawer) return null;

    const overlay = drawer.parentElement;
    const box = drawer.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const style = getComputedStyle(drawer);

    return {
      expanded: document
        .querySelector('button[aria-expanded]')
        ?.getAttribute('aria-expanded'),
      box: {
        top: Math.round(box.top),
        right: Math.round(box.right),
        width: Math.round(box.width),
        height: Math.round(box.height),
      },
      viewport: { w: vw, h: vh },
      clipped:
        drawer.scrollHeight > drawer.clientHeight + 1 &&
        style.overflowY !== 'auto' &&
        style.overflowY !== 'scroll',
      drawerLinks: [...drawer.querySelectorAll('nav a[href]')].map(
        (a) => new URL((a as HTMLAnchorElement).href).pathname,
      ),
      desktopLinks: [
        ...document.querySelectorAll('header nav[aria-label="Főmenü"] a[href]'),
      ].map((a) => new URL((a as HTMLAnchorElement).href).pathname),
      small: [...drawer.querySelectorAll('a[href], button')]
        .filter((el) => getComputedStyle(el).display !== 'inline')
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44);
        })
        .slice(0, 4)
        .map((el) => {
          const r = el.getBoundingClientRect();
          const name = (el.textContent || el.getAttribute('aria-label') || '').trim();
          return `${el.tagName}"${name.slice(0, 18)}" ${Math.round(r.width)}x${Math.round(r.height)}`;
        }),
      overflowing: (overlay ? [...overlay.querySelectorAll('*')] : [])
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > vw + 1 || r.left < -1);
        })
        .slice(0, 3)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return `${el.tagName} ${Math.round(r.left)}..${Math.round(r.right)}`;
        }),
    };
  });

  if (!result) {
    at('a hamburgerre kattintva nem nyilt meg a fiok (#mobile-menu hianyzik)');
    return null;
  }

  if (result.expanded !== 'true') {
    at(`aria-expanded="${result.expanded}" nyitott fiok mellett (true kell)`);
  }

  if (
    Math.abs(result.box.height - result.viewport.h) > 1 ||
    Math.abs(result.box.top) > 1
  ) {
    at(
      `a fiok nem tolti ki a viewport magassagat: ${result.box.width}x${result.box.height} @ top ${result.box.top} ` +
        `(vart ${result.box.width}x${result.viewport.h} @ top 0) — ` +
        'valoszinuleg egy os elem containing blockot hoz letre (transform/filter/backdrop-filter/contain)',
    );
  }

  if (Math.abs(result.box.right - result.viewport.w) > 1) {
    at(
      `a fiok nem fekszik fel a jobb szelre: jobb szel ${result.box.right} (vart ${result.viewport.w})`,
    );
  }

  if (result.overflowing.length > 0) {
    at(`nyitott fiok vizszintes tulcsordulas: ${result.overflowing.join(', ')}`);
  }

  if (result.small.length > 0) {
    at(`tul kicsi kattinthato elem a fiokban: ${result.small.join(' | ')}`);
  }

  if (result.clipped) {
    at('a fiok tartalma magasabb a panelnel, de a panel nem gorgetheto');
  }

  if (result.drawerLinks.length === 0) {
    at('a fiok nem tartalmaz nav linket');
  }

  if (result.desktopLinks.length === 0) {
    at('nem talalhato az asztali nav (header nav[aria-label=Fomenu]) — a link-paritas vakon futna');
  }

  const missing = result.desktopLinks.filter((href) => !result.drawerLinks.includes(href));
  if (missing.length > 0) {
    at(`az asztali navbol hianyzo link a fiokban: ${missing.join(', ')}`);
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  if ((await page.locator('#mobile-menu').count()) > 0) {
    at('Escape utan is nyitva maradt a fiok');
  }

  return result.box;
}

async function auditDrawerNavigation(page: Page) {
  const target = '/hazirend/';
  const at = (issue: string) => problems.push({ page: '/ (menu)', config: 'nav', issue });

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30_000 });

  await page.locator('button[aria-expanded]').first().click();
  await page.waitForTimeout(700);

  const link = page.locator(`#mobile-menu nav a[href="${target}"]`);
  if ((await link.count()) === 0) {
    at(`nincs ${target} link a fiokban`);
    return;
  }

  await link.first().click();
  await page.waitForTimeout(900);

  const after = await page.evaluate(() => ({
    path: location.pathname,
    open: !!document.querySelector('#mobile-menu'),
  }));

  if (after.path !== target) {
    at(`a fiok nav linkje nem navigalt: ${after.path} (vart ${target})`);
  }
  if (after.open) {
    at('a fiok nyitva maradt a navigacio utan');
  }
}

let server: Server | undefined;

if (!(await reachable())) {
  if (process.env.BASE) {
    console.error(`A megadott BASE nem valaszol: ${BASE}`);
    process.exit(1);
  }
  if (!existsSync(join(OUT_DIR, 'index.html'))) {
    console.error('Nincs epitett kimenet. Elobb: npm run build');
    process.exit(1);
  }
  server = await startServer();
}

console.log(`Kiszolgalo: ${BASE}${server ? ' (sajat)' : ' (mar futott)'}`);
console.log('Konfiguraciok: 320 / 360 / 390 / 768 / 1024 / 1440 px szelesseg,');
console.log('  320x256 = WCAG 1.4.10 reflow (1280 px @ 400% page zoom),');
console.log('  200%    = WCAG 1.4.4 szovegnagyitas 1280x1024-en.');
console.log('');

const browser = await chromium.launch({ channel: 'chromium', headless: true });
const context = await browser.newContext({ locale: 'hu-HU' });
const page = await context.newPage();

for (const path of PAGES) {
  const marks: string[] = [];
  for (const config of CONFIGS) {
    const r = await auditPage(page, path, config);
    marks.push(`${config.label}:${r.revealed}/${r.reveals}`);
  }
  console.log(`${path.padEnd(24)} reveals  ${marks.join('  ')}`);
}

await context.close();

console.log('');
console.log('Mobil menu (nyitott fiok):');
const menuContext = await browser.newContext({ locale: 'hu-HU' });
await menuContext.addInitScript(
  ([noticeKey, introKey]: string[]) => {
    try {
      window.localStorage.setItem(noticeKey, 'dismissed');
      window.sessionStorage.setItem(introKey, '1');
    } catch {
    }
  },
  [noticeStorageKey, INTRO_STORAGE_KEY],
);
const menuPage = await menuContext.newPage();

const marks: string[] = [];
for (const config of CONFIGS.filter((c) => c.width < 1024)) {
  const box = await auditMobileDrawer(menuPage, config);
  marks.push(`${config.label}:${box ? `${box.width}x${box.height}` : 'HIBA'}`);
}
console.log(`${'/ (menu)'.padEnd(24)} fiok     ${marks.join('  ')}`);

await auditDrawerNavigation(menuPage);
await menuContext.close();

console.log('');
console.log('JavaScript nelkul (M3):');
for (const path of PAGES) {
  const r = await auditWithoutScript(browser, path);
  console.log(`${path.padEnd(24)} ${r.total - r.hidden}/${r.total} reveal elem lathato`);
}

await browser.close();
server?.close();

console.log('');
if (problems.length === 0) {
  console.log('Minden ellenorzes rendben.');
} else {
  console.log(`${problems.length} problema:`);
  for (const p of problems) {
    console.log(`  [${p.config}] ${p.page}  ${p.issue}`);
  }
  process.exitCode = 1;
}
