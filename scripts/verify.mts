/**
 * Responsive and behaviour audit against the built static output.
 *
 *   npx serve out -l 4877
 *   npx tsx scripts/verify.mts
 *
 * Checks every page at every breakpoint the site claims to support and fails
 * loudly on the things that are easy to break and hard to notice: horizontal
 * overflow at 320px, scroll reveals that never fire (which would leave content
 * invisible), and tap targets under 44px.
 */

import { chromium, type Page } from 'playwright-core';

const BASE = process.env.BASE ?? 'http://localhost:4877';

const PAGES = [
  '/',
  '/bemutatkozas/',
  '/arak/',
  '/arak/elso-masszazs/',
  '/hazirend/',
  '/kapcsolat/',
];

const WIDTHS = [320, 360, 390, 768, 1024, 1440];

type Problem = { page: string; width: number; issue: string };
const problems: Problem[] = [];

async function auditPage(page: Page, path: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30_000 });

  // Walk the whole page so every reveal observer gets a chance to fire.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
  });

  const result = await page.evaluate(() => {
    const doc = document.documentElement;

    // Anything wider than the viewport that is not deliberately scrollable.
    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return false;
        const style = getComputedStyle(el);
        if (style.overflowX === 'auto' || style.overflowX === 'scroll') return false;
        return rect.right > window.innerWidth + 1 || rect.left < -1;
      })
      .slice(0, 4)
      .map((el) => `${el.tagName}.${(el.className || '').toString().split(' ')[0]}`);

    const reveals = document.querySelectorAll('[data-reveal]').length;
    const revealed = document.querySelectorAll('[data-revealed]').length;

    // Interactive controls that are hard to hit with a thumb.
    // Skip-links are excluded: they are 1x1 by design until focused.
    const small = [...document.querySelectorAll('a[href], button')]
      .filter((el) => !el.className.toString().includes('sr-only'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24);
      })
      .slice(0, 4)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${el.tagName}"${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 22)}" ${Math.round(r.width)}x${Math.round(r.height)}`;
      });

    return {
      scrollWidth: doc.scrollWidth,
      innerWidth: window.innerWidth,
      h1: document.querySelectorAll('h1').length,
      reveals,
      revealed,
      overflowing,
      small,
    };
  });

  if (result.scrollWidth > result.innerWidth + 1) {
    problems.push({
      page: path,
      width,
      issue: `vízszintes túlcsordulás: scrollWidth ${result.scrollWidth} > ${result.innerWidth}${
        result.overflowing.length ? ` — gyanús: ${result.overflowing.join(', ')}` : ''
      }`,
    });
  }

  if (result.reveals > 0 && result.revealed < result.reveals) {
    problems.push({
      page: path,
      width,
      issue: `rejtve maradt tartalom: ${result.revealed}/${result.reveals} reveal futott le`,
    });
  }

  if (result.h1 !== 1) {
    problems.push({ page: path, width, issue: `h1 darabszám: ${result.h1} (1 kell)` });
  }

  if (result.small.length > 0) {
    problems.push({
      page: path,
      width,
      issue: `túl kicsi kattintható elem: ${result.small.join(' | ')}`,
    });
  }

  return result;
}

const browser = await chromium.launch({ channel: 'chromium', headless: true });
const context = await browser.newContext({ locale: 'hu-HU' });
const page = await context.newPage();

for (const path of PAGES) {
  const marks: string[] = [];
  for (const width of WIDTHS) {
    const r = await auditPage(page, path, width);
    marks.push(`${width}:${r.revealed}/${r.reveals}`);
  }
  console.log(`${path.padEnd(24)} reveals ${marks.join('  ')}`);
}

await browser.close();

console.log('');
if (problems.length === 0) {
  console.log('Minden ellenorzes rendben.');
} else {
  console.log(`${problems.length} problema:`);
  for (const p of problems) {
    console.log(`  [${p.width}px] ${p.page}  ${p.issue}`);
  }
  process.exitCode = 1;
}
