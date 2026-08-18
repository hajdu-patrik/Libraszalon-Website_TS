/**
 * Responsive and behaviour audit against the built static output.
 *
 *   npm run build
 *   npm run verify
 *
 * Checks every page in every configuration the site claims to support and
 * fails loudly on the things that are easy to break and hard to notice:
 * horizontal overflow at 320px, scroll reveals that never fire (which would
 * leave content invisible), tap targets under 44px, and content that stays
 * hidden when JavaScript never runs.
 *
 * One pass is not about the page at rest: auditMobileDrawer opens the mobile
 * menu and measures it. See the comment there for why a resting audit cannot
 * see the class of bug that pass exists to catch.
 */

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
  /** Short label for the console table. */
  label: string;
  width: number;
  height: number;
  /** Root font-size multiplier, injected after navigation. */
  textScale?: number;
};

const CONFIGS: Config[] = [
  { label: '320', width: 320, height: 900 },
  { label: '360', width: 360, height: 900 },
  { label: '390', width: 390, height: 900 },
  { label: '768', width: 768, height: 900 },
  { label: '1024', width: 1024, height: 900 },
  { label: '1440', width: 1440, height: 900 },
  // WCAG 1.4.10 Reflow. Page zoom scales rem, px and vw together, so a
  // 1280px window at 400% is geometrically a 320x256 viewport. The 320x900
  // run covers the width; at 256px the sticky header takes a quarter of the
  // screen and nothing else was ever measured against that.
  { label: '320x256', width: 320, height: 256 },
  // WCAG 1.4.4 Resize Text. This is where rem parts company with vw: only
  // rem grows, so this run is the one that actually stresses the clamp()
  // scale and every hard-coded px value.
  { label: '200%', width: 1280, height: 1024, textScale: 2 },
];

type Problem = { page: string; config: string; issue: string };
const problems: Problem[] = [];

/* ---------------------------------------------------------------------------
   Static server

   Serving out/ from here rather than expecting a second terminal: a gate that
   needs a manual setup step is a gate that does not get run. An already
   running server on the port is reused as-is.
   --------------------------------------------------------------------------- */

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
  // Never escape out/ — the paths come from the pages themselves, but a
  // traversal bug here would silently serve the whole repo.
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

/* ---------------------------------------------------------------------------
   Audit
   --------------------------------------------------------------------------- */

async function auditPage(page: Page, path: string, config: Config) {
  await page.setViewportSize({ width: config.width, height: config.height });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30_000 });

  if (config.textScale) {
    await page.addStyleTag({
      content: `:root { font-size: ${config.textScale * 100}% }`,
    });
  }

  // Walk the whole page so every reveal observer gets a chance to fire.
  //
  // behavior: 'instant' overrides html { scroll-behavior: smooth }. With the
  // smooth default every step only animates part of the way before the next
  // call restarts it, so on a tall page the walk falls behind and stops
  // thousands of pixels short — which read as unfired reveals at 200% text.
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
    // clientWidth, not innerWidth: the latter counts the scrollbar, which
    // would let a genuinely overflowing element hide inside the slack.
    const limit = document.documentElement.clientWidth;

    // Anything wider than the viewport that is not deliberately scrollable.
    //
    // Everything here is written with anonymous callbacks on purpose: tsx
    // compiles every *named* function with an esbuild `__name` helper, which
    // does not exist inside the page and throws on the first call.
    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return false;
        const style = getComputedStyle(el);
        if (style.overflowX === 'auto' || style.overflowX === 'scroll') return false;
        if (rect.right <= limit + 1 && rect.left >= -1) return false;

        // An ancestor that clips or scrolls already contains the overflow, so
        // this element is not what pushes the document sideways. The walk
        // stops at body: the backstop there is exactly the signal this check
        // has to see past. Anything but `visible` counts — an ancestor with
        // only overflow-y set computes overflow-x to `auto`, and clips too.
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

    // Interactive controls that are hard to hit with a thumb. 44px is the
    // number the components already follow (Button min-h-11, hamburger
    // size-11, carousel arrows size-11) — the gate measures the system's own
    // rule, not the 24px WCAG AA floor.
    // Skip-links are excluded: they are 1x1 by design until focused.
    const small = [...document.querySelectorAll('a[href], button')]
      .filter((el) => !el.className.toString().includes('sr-only'))
      // WCAG 2.5.8 inline exception: a link sitting in running text is sized
      // by the line box, not by the design.
      .filter((el) => getComputedStyle(el).display !== 'inline')
      // Deliberate exceptions carry their reason in the DOM, so the gate never
      // has to know a component name.
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

  // Independent of any document-level measurement: body { overflow-x: hidden }
  // swallows the scrollWidth signal, so element geometry is the only witness.
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

/**
 * M3: the hidden state comes from the stylesheet, the release comes from an
 * observer. Without JS every [data-reveal] element would stay at opacity 0
 * forever, and no run with scripting enabled can see it.
 *
 * The same pass also asks whether the site is still navigable at all. The
 * mobile menu is a React control, so with scripting off the hamburger is inert
 * and every route has to be reachable some other way. It is — the footer
 * renders the full navigation — but nothing enforced that, and losing it would
 * strand a no-JS visitor on whichever page they landed on.
 */
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

/**
 * The mobile drawer, opened.
 *
 * Every other pass measures the page at rest, and that is precisely how a
 * broken mobile menu shipped once already. The sticky header carries
 * `backdrop-blur-md`; backdrop-filter makes an element a containing block for
 * its fixed-position descendants, exactly as transform does. The drawer's
 * `fixed inset-0` therefore resolved against the header's own 320x68 box
 * instead of the viewport, and the full-height panel became a 272x136 stub
 * parked at y=-68. Closed, the drawer is not mounted at all, so no resting
 * measurement could ever have seen it.
 *
 * The geometry assertion below is deliberately not a scan for offending
 * ancestor styles. transform, filter, contain and will-change all produce this
 * same symptom, and a check written against the symptom never needs updating
 * when a new cause turns up.
 *
 * Runs on one page: the header is layout-level and identical everywhere, so
 * repeating it per route would buy nothing.
 */
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
  // The panel slides in over 0.45s; measuring sooner catches it mid-travel and
  // reports a false failure on the geometry assertion.
  await page.waitForTimeout(700);

  const result = await page.evaluate(() => {
    const drawer = document.querySelector('#mobile-menu');
    if (!drawer) return null;

    const overlay = drawer.parentElement;
    const box = drawer.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const style = getComputedStyle(drawer);

    // Anonymous callbacks only, all the way down: tsx compiles every *named*
    // function with an esbuild `__name` helper that does not exist in the page.
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
      // Content taller than the panel is fine, but only if it can be reached.
      // At 320x256 the drawer is shorter than its own contents by design.
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

  // The assertion this whole pass exists for.
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

  // Without this the parity check below is a no-op that always passes: an
  // empty desktop list has nothing missing from it. The selector carries a
  // non-ASCII label, so a normalisation slip would silently empty it.
  if (result.desktopLinks.length === 0) {
    at('nem talalhato az asztali nav (header nav[aria-label=Fomenu]) — a link-paritas vakon futna');
  }

  const missing = result.desktopLinks.filter((href) => !result.drawerLinks.includes(href));
  if (missing.length > 0) {
    at(`az asztali navbol hianyzo link a fiokban: ${missing.join(', ')}`);
  }

  // Escape closes it, so the next config starts from a clean slate.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  if ((await page.locator('#mobile-menu').count()) > 0) {
    at('Escape utan is nyitva maradt a fiok');
  }

  return result.box;
}

/**
 * Opening the drawer is only half the contract — it also has to get out of the
 * way. MobileNav closes it during render when the route changes rather than in
 * an effect, so a stale drawer is never committed over the page the visitor
 * just navigated to. Nothing enforced that behaviour until now.
 */
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

/* ---------------------------------------------------------------------------
   Run
   --------------------------------------------------------------------------- */

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

// A fresh context with the two dismissable overlays already dismissed. The
// notice card and the intro curtain are both storage-gated, and seeding those
// keys before the first paint keeps the drawer measurement free of anything
// that only appears on a visitor's first load.
console.log('');
console.log('Mobil menu (nyitott fiok):');
const menuContext = await browser.newContext({ locale: 'hu-HU' });
await menuContext.addInitScript(
  ([noticeKey, introKey]: string[]) => {
    try {
      window.localStorage.setItem(noticeKey, 'dismissed');
      window.sessionStorage.setItem(introKey, '1');
    } catch {
      // Storage disabled: the overlays show, which the pass survives anyway.
    }
  },
  [noticeStorageKey, INTRO_STORAGE_KEY],
);
const menuPage = await menuContext.newPage();

// The hamburger is lg:hidden, so it only exists below 1024px. The 200% run is
// 1280px wide and has no hamburger to open.
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
