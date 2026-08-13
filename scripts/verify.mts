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
 */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { chromium, type Browser, type Page } from 'playwright-core';

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
 */
async function auditWithoutScript(browser: Browser, path: string) {
  const context = await browser.newContext({ locale: 'hu-HU', javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${BASE}${path}`, { waitUntil: 'load', timeout: 30_000 });

  const result = await page.evaluate(() => {
    const all = [...document.querySelectorAll('[data-reveal]')];
    const hidden = all.filter((el) => getComputedStyle(el).opacity !== '1');
    return { total: all.length, hidden: hidden.length };
  });

  await context.close();

  if (result.hidden > 0) {
    problems.push({
      page: path,
      config: 'no-JS',
      issue: `JS nelkul rejtve: ${result.hidden}/${result.total} reveal elem opacity < 1`,
    });
  }

  return result;
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
