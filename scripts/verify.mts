import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, resolve, sep } from 'node:path';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright-core';
import { navItems } from '../src/content/nav.ts';
import { noticeStorageKey } from '../src/content/notice.ts';
import { INTRO_STORAGE_KEY } from '../src/lib/intro.ts';

/**
 * Release gate for the static export in out/: serves it with the production headers from
 * vercel.json (so the CSP is enforced exactly as on Vercel) and checks every page for
 * horizontal overflow, reflow and text resize (WCAG 1.4.10 / 1.4.4), target size, heading
 * structure, console and CSP errors, axe-core violations, no-JS rendering, and the
 * keyboard behaviour of the mobile menu, the welcome notice and the reviews carousel.
 *
 *   npm run build && npm run verify            (own server on VERIFY_PORT, default 4877)
 *   BASE=http://localhost:3000 npm run verify  (an already running server)
 */

const PORT = Number(process.env.VERIFY_PORT ?? 4877);
const BASE = process.env.BASE ?? `http://localhost:${PORT}`;
const OUT_DIR = resolve('out');
const AXE_SOURCE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const PAGES = ['/', '/bemutatkozas/', '/arak/', '/arak/elso-masszazs/', '/hazirend/', '/kapcsolat/'];
const NOT_FOUND_PAGE = '/nincs-ilyen-oldal/';

type Config = {
  label: string;
  width: number;
  height: number;
  textScale?: number;
};

const CONFIGS: Config[] = [
  { label: '320', width: 320, height: 900 },
  { label: '360', width: 360, height: 900 },
  { label: '375', width: 375, height: 812 },
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
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

type HeaderRule = { pattern: RegExp; headers: { key: string; value: string }[] };

/** vercel.json sources are path-to-regexp patterns that are also valid JS regexes. */
const HEADER_RULES: HeaderRule[] = (
  JSON.parse(readFileSync('vercel.json', 'utf8')).headers as {
    source: string;
    headers: HeaderRule['headers'];
  }[]
).map(({ source, headers }) => ({ pattern: new RegExp(`^${source}$`), headers }));

function headersFor(path: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const rule of HEADER_RULES) {
    if (!rule.pattern.test(path)) continue;
    for (const { key, value } of rule.headers) result[key] = value;
  }
  return result;
}

function resolveFile(urlPath: string): string | null {
  const target = resolve(join(OUT_DIR, urlPath));
  if (target !== OUT_DIR && !target.startsWith(OUT_DIR + sep)) return null;

  for (const candidate of [target, join(target, 'index.html'), `${target}.html`]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Next's static export names nested RSC segment files with the OS path separator, so a
 *  Windows build writes `__next.arak/elso-masszazs/__PAGE__.txt` where Linux (Vercel)
 *  writes the `__next.arak.elso-masszazs.__PAGE__.txt` the client router requests. */
function windowsSegmentFile(urlPath: string): string | null {
  const match = /^(.*\/)__next\.(.+)\.txt$/.exec(urlPath);
  if (sep !== '\\' || !match) return null;
  return resolveFile(`${match[1]}__next.${match[2].replaceAll('.', '/')}.txt`);
}

function startServer(): Promise<Server> {
  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0]);

    // Vercel injects its analytics scripts at the edge; locally they are empty stubs.
    if (path.startsWith('/_vercel/')) {
      res.writeHead(path.endsWith('.js') ? 200 : 204, { 'content-type': MIME['.js'] }).end();
      return;
    }

    const hit = resolveFile(path) ?? windowsSegmentFile(path);
    const file = hit ?? join(OUT_DIR, '404.html');
    if (!existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(hit ? 200 : 404, {
      ...headersFor(path),
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

/** Records console errors/warnings, uncaught exceptions and CSP violations of a page. */
function watchConsole(page: Page): string[] {
  const messages: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      const { url } = message.location();
      messages.push(`${message.type()}: ${message.text().slice(0, 160)}${url ? ` (${url})` : ''}`);
    }
  });
  page.on('pageerror', (error) => messages.push(`pageerror: ${error.message.slice(0, 160)}`));
  return messages;
}

async function newContext(browser: Browser, options: Parameters<Browser['newContext']>[0] = {}) {
  const context = await browser.newContext({ locale: 'hu-HU', ...options });
  await context.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error(`CSP: ${event.violatedDirective} blocked ${event.blockedURI}`);
    });
  });
  return context;
}

/** Skips the once-per-session intro and the welcome notice for audits that aren't about them. */
async function quietVisit(context: BrowserContext) {
  await context.addInitScript(
    ([noticeKey, introKey]: string[]) => {
      try {
        window.sessionStorage.setItem(noticeKey, 'dismissed');
        window.sessionStorage.setItem(introKey, '1');
      } catch {}
    },
    [noticeStorageKey, INTRO_STORAGE_KEY],
  );
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 900));
  });
}

/** A section that throws (a locator that never resolves, a navigation timeout) is reported
 *  like any other problem, so one failure cannot swallow the rest of the summary. */
async function guarded<T>(page: string, config: string, run: () => Promise<T>): Promise<T | null> {
  try {
    return await run();
  } catch (error) {
    const [message] = (error instanceof Error ? error.message : String(error)).split(/\r?\n/);
    problems.push({ page, config, issue: `ellenorzes megszakadt: ${message}` });
    return null;
  }
}

async function auditPage(page: Page, messages: string[], path: string, config: Config) {
  messages.length = 0;
  await page.setViewportSize({ width: config.width, height: config.height });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30_000 });

  if (config.textScale) {
    await page.addStyleTag({ content: `:root { font-size: ${config.textScale * 100}% }` });
  }

  await scrollThrough(page);

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

    const small = [...document.querySelectorAll('a[href], button')]
      .filter((el) => !el.closest('dialog:not([open])'))
      .filter((el) => !el.className.toString().includes('sr-only'))
      .filter((el) => getComputedStyle(el).display !== 'inline')
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44);
      })
      .slice(0, 4)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${el.tagName}"${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 22)}" ${Math.round(r.width)}x${Math.round(r.height)}`;
      });

    const levels = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      .filter((h) => !h.closest('dialog'))
      .map((h) => Number(h.tagName[1]));
    const skippedHeadings = levels
      .map((level, i) => (i > 0 && level > levels[i - 1] + 1 ? `h${levels[i - 1]}->h${level}` : ''))
      .filter(Boolean);

    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      h1: document.querySelectorAll('h1').length,
      reveals: document.querySelectorAll('[data-reveal]').length,
      revealed: document.querySelectorAll('[data-revealed]').length,
      overflowing,
      small,
      skippedHeadings,
      imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
      highPriorityImages: document.querySelectorAll('img[fetchpriority="high"]').length,
    };
  });

  const at = (issue: string) => problems.push({ page: path, config: config.label, issue });

  if (result.scrollWidth > result.innerWidth) {
    at(`vizszintes gorgetes: scrollWidth ${result.scrollWidth} > ${result.innerWidth}`);
  }
  if (result.overflowing.length > 0) {
    at(`vizszintes tulcsordulas: ${result.overflowing.join(', ')} (limit ${config.width})`);
  }
  if (result.reveals > 0 && result.revealed < result.reveals) {
    at(`rejtve maradt tartalom: ${result.revealed}/${result.reveals} reveal futott le`);
  }
  if (result.h1 !== 1) at(`h1 darabszam: ${result.h1} (1 kell)`);
  if (result.skippedHeadings.length > 0) {
    at(`kihagyott cimsorszint: ${result.skippedHeadings.join(', ')}`);
  }
  if (result.imagesWithoutAlt > 0) at(`${result.imagesWithoutAlt} kep alt attributum nelkul`);
  if (result.highPriorityImages > 1) {
    at(`${result.highPriorityImages} kep fetchpriority=high (legfeljebb 1, az LCP kep)`);
  }
  if (result.small.length > 0) at(`tul kicsi kattinthato elem: ${result.small.join(' | ')}`);
  const expected404 = path === NOT_FOUND_PAGE ? `404 (Not Found) (${BASE}${path})` : null;
  for (const message of new Set(messages)) {
    if (expected404 && message.endsWith(expected404)) continue;
    at(`konzol ${message}`);
  }

  return result;
}

async function auditAxe(browser: Browser, path: string, width: number) {
  const context = await newContext(browser, { viewport: { width, height: 900 }, bypassCSP: true });
  await quietVisit(context);
  const page = await context.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30_000 });
  await scrollThrough(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.addScriptTag({ content: AXE_SOURCE });

  const violations = await page.evaluate(async (tags: string[]) => {
    const axe = (window as unknown as { axe: { run: (...args: unknown[]) => Promise<AxeResult> } }).axe;
    type AxeResult = {
      violations: { id: string; impact: string; nodes: { target: string[] }[] }[];
    };
    const { violations } = await axe.run(document, { runOnly: { type: 'tag', values: tags } });
    return violations.map((v) => `${v.impact} ${v.id} x${v.nodes.length}: ${v.nodes[0]?.target.join(' ')}`);
  }, AXE_TAGS);

  await context.close();
  for (const violation of violations) {
    problems.push({ page: path, config: `axe ${width}`, issue: violation });
  }
  return violations.length;
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

const MENU_TOGGLE = 'button[aria-controls="mobile-menu"]';

async function auditMobileDrawer(page: Page, config: Config) {
  await page.setViewportSize({ width: config.width, height: config.height });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30_000 });

  const at = (issue: string) => problems.push({ page: '/ (menu)', config: config.label, issue });

  const toggle = page.locator(MENU_TOGGLE);
  if ((await toggle.count()) === 0) {
    at('nincs hamburger gomb a fejlecben');
    return null;
  }

  await toggle.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);

  const result = await page.evaluate((toggleSelector: string) => {
    const drawer = document.querySelector<HTMLDialogElement>('#mobile-menu');
    if (!drawer?.open) return null;

    const box = drawer.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const style = getComputedStyle(drawer);

    return {
      modal: drawer.matches(':modal'),
      focusInside: drawer.contains(document.activeElement),
      expanded: document.querySelector(toggleSelector)?.getAttribute('aria-expanded'),
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
      desktopLinks: [...document.querySelectorAll('header nav[aria-label="Főmenü"] a[href]')].map(
        (a) => new URL((a as HTMLAnchorElement).href).pathname,
      ),
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
      overflowing: [...drawer.querySelectorAll('*')]
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
  }, MENU_TOGGLE);

  if (!result) {
    at('a hamburgerre (Enter) nem nyilt meg a fiok (#mobile-menu[open] hianyzik)');
    return null;
  }

  if (!result.modal) at('a fiok nem modalis dialogus (showModal kell)');
  if (!result.focusInside) at('nyitaskor a fokusz nem kerult a fiokba');
  if (result.expanded !== 'true') {
    at(`aria-expanded="${result.expanded}" nyitott fiok mellett (true kell)`);
  }
  if (Math.abs(result.box.height - result.viewport.h) > 1 || Math.abs(result.box.top) > 1) {
    at(
      `a fiok nem tolti ki a viewport magassagat: ${result.box.width}x${result.box.height} @ top ${result.box.top} ` +
        `(vart ${result.box.width}x${result.viewport.h} @ top 0)`,
    );
  }
  if (Math.abs(result.box.right - result.viewport.w) > 1) {
    at(`a fiok nem fekszik fel a jobb szelre: jobb szel ${result.box.right} (vart ${result.viewport.w})`);
  }
  if (result.overflowing.length > 0) {
    at(`nyitott fiok vizszintes tulcsordulas: ${result.overflowing.join(', ')}`);
  }
  if (result.small.length > 0) at(`tul kicsi kattinthato elem a fiokban: ${result.small.join(' | ')}`);
  if (result.clipped) at('a fiok tartalma magasabb a panelnel, de a panel nem gorgetheto');
  if (result.drawerLinks.length === 0) at('a fiok nem tartalmaz nav linket');
  if (result.desktopLinks.length === 0) {
    at('nem talalhato az asztali nav (header nav[aria-label=Fomenu]) — a link-paritas vakon futna');
  }
  const missing = result.desktopLinks.filter((href) => !result.drawerLinks.includes(href));
  if (missing.length > 0) at(`az asztali navbol hianyzo link a fiokban: ${missing.join(', ')}`);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  const after = await page.evaluate((toggleSelector: string) => ({
    open: document.querySelector<HTMLDialogElement>('#mobile-menu')?.open ?? false,
    focusOnToggle: document.activeElement === document.querySelector(toggleSelector),
    expanded: document.querySelector(toggleSelector)?.getAttribute('aria-expanded'),
  }), MENU_TOGGLE);
  if (after.open) at('Escape utan is nyitva maradt a fiok');
  if (!after.focusOnToggle) at('bezaras utan a fokusz nem tert vissza a hamburger gombra');
  if (after.expanded !== 'false') at(`bezart fiok mellett aria-expanded="${after.expanded}"`);

  return result.box;
}

async function auditDrawerNavigation(page: Page) {
  const target = '/hazirend/';
  const at = (issue: string) => problems.push({ page: '/ (menu)', config: 'nav', issue });

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30_000 });

  await page.locator(MENU_TOGGLE).click();
  await page.waitForTimeout(700);
  if (!(await page.locator('#mobile-menu[open]').count())) {
    at('a hamburgerre kattintva nem nyilt meg a fiok');
    return;
  }

  const link = page.locator(`#mobile-menu nav a[href="${target}"]`);
  if ((await link.count()) === 0) {
    at(`nincs ${target} link a fiokban`);
    return;
  }

  await link.first().click();
  await page.waitForTimeout(900);

  const after = await page.evaluate(() => ({
    path: location.pathname,
    open: document.querySelector<HTMLDialogElement>('#mobile-menu')?.open ?? false,
  }));
  if (after.path !== target) at(`a fiok nav linkje nem navigalt: ${after.path} (vart ${target})`);
  if (after.open) at('a fiok nyitva maradt a navigacio utan');
}

/** First visit: the notice must open as a labelled modal dialog, take focus, close on
 *  Escape and stay dismissed on the next visit. */
async function auditNotice(browser: Browser) {
  const at = (issue: string) => problems.push({ page: '/ (kozlemeny)', config: '390', issue });
  const context = await newContext(browser, { viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30_000 });

  const dialog = page.locator('dialog[aria-labelledby]:not(#mobile-menu)');
  try {
    await dialog.first().waitFor({ state: 'visible', timeout: 6_000 });
  } catch {
    at('az elso latogataskor nem jelent meg a kozlemeny dialogus');
    await context.close();
    return;
  }

  const opened = await dialog.first().evaluate((el) => {
    const labelId = el.getAttribute('aria-labelledby');
    return {
      modal: el.matches(':modal'),
      name: labelId ? (document.getElementById(labelId)?.textContent ?? '').trim() : '',
      focusInside: el.contains(document.activeElement),
    };
  });
  if (!opened.modal) at('a kozlemeny nem modalis dialogus');
  if (!opened.name) at('a kozlemeny dialogusnak nincs akadalymentes neve');
  if (!opened.focusInside) at('megnyitaskor a fokusz nem kerult a kozlemenybe');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  if (await dialog.first().isVisible()) at('Escape utan is nyitva maradt a kozlemeny');

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3_500);
  if (await dialog.first().isVisible()) at('elutasitas utan ujratoltve ismet megjelent a kozlemeny');

  await context.close();
}

/** WCAG 2.2.2: the auto-advancing carousel needs a pause control that works by keyboard. */
async function auditCarousel(browser: Browser) {
  const at = (issue: string) => problems.push({ page: '/ (velemenyek)', config: '1440', issue });
  const context = await newContext(browser, { viewport: { width: 1440, height: 900 } });
  await quietVisit(context);
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30_000 });

  const pause = page.locator('button[aria-label*="Automatikus lapozás"]');
  if ((await pause.count()) === 0) {
    at('nincs szuneteltetes gomb az automatikusan lapozo velemenyeken');
    await context.close();
    return;
  }
  const before = await pause.getAttribute('aria-label');
  await pause.focus();
  await page.keyboard.press('Enter');
  const after = await pause.getAttribute('aria-label');
  if (before === after) at('a szuneteltetes gomb billentyuvel nem valt allapotot');

  for (const name of ['Előző vélemény', 'Következő vélemény']) {
    if ((await page.getByRole('button', { name }).count()) === 0) at(`hianyzik a(z) "${name}" gomb`);
  }
  await context.close();
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

console.log(`Kiszolgalo: ${BASE}${server ? ' (sajat, vercel.json fejlecekkel)' : ' (mar futott)'}`);
console.log('Konfiguraciok: 320 / 360 / 375 / 390 / 768 / 1024 / 1440 px szelesseg,');
console.log('  320x256 = WCAG 1.4.10 reflow (1280 px @ 400% page zoom),');
console.log('  200%    = WCAG 1.4.4 szovegnagyitas 1280x1024-en.');
console.log('');

const browser = await chromium.launch({ channel: 'chromium', headless: true });
const context = await newContext(browser);
await quietVisit(context);
const page = await context.newPage();
const messages = watchConsole(page);

for (const path of [...PAGES, NOT_FOUND_PAGE]) {
  const marks: string[] = [];
  for (const config of CONFIGS) {
    const r = await guarded(path, config.label, () => auditPage(page, messages, path, config));
    marks.push(`${config.label}:${r ? `${r.revealed}/${r.reveals}` : 'HIBA'}`);
  }
  console.log(`${path.padEnd(24)} reveals  ${marks.join('  ')}`);
}

await context.close();

console.log('');
console.log('axe-core (WCAG 2.2 AA + best practice):');
for (const path of [...PAGES, NOT_FOUND_PAGE]) {
  const counts = [];
  for (const width of [375, 1440]) {
    const found = await guarded(path, `axe ${width}`, () => auditAxe(browser, path, width));
    counts.push(`${width}:${found ?? 'HIBA'}`);
  }
  console.log(`${path.padEnd(24)} szabalysertes  ${counts.join('  ')}`);
}

console.log('');
console.log('Mobil menu (nyitott fiok):');
const menuContext = await newContext(browser);
await quietVisit(menuContext);
const menuPage = await menuContext.newPage();
const menuMarks: string[] = [];
for (const config of CONFIGS.filter((c) => c.width < 1024)) {
  const box = await guarded('/ (menu)', config.label, () => auditMobileDrawer(menuPage, config));
  menuMarks.push(`${config.label}:${box ? `${box.width}x${box.height}` : 'HIBA'}`);
}
console.log(`${'/ (menu)'.padEnd(24)} fiok     ${menuMarks.join('  ')}`);
await guarded('/ (menu)', 'nav', () => auditDrawerNavigation(menuPage));
await menuContext.close();

console.log('');
console.log('Kozlemeny dialogus es velemeny-korhinta:');
await guarded('/ (kozlemeny)', '390', () => auditNotice(browser));
await guarded('/ (velemenyek)', '1440', () => auditCarousel(browser));

console.log('');
console.log('JavaScript nelkul:');
for (const path of PAGES) {
  const r = await guarded(path, 'no-JS', () => auditWithoutScript(browser, path));
  console.log(`${path.padEnd(24)} ${r ? `${r.total - r.hidden}/${r.total}` : 'HIBA'} reveal elem lathato`);
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
