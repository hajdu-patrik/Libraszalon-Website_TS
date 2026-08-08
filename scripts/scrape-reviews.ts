/**
 * Pulls the salon's Google reviews and merges them into content/reviews.json.
 *
 *   npm run reviews:scrape
 *
 * Runs daily from .github/workflows/reviews.yml. When the file changes the
 * workflow commits it, and that push triggers a rebuild — so a new review can
 * reach the live site without anyone touching anything.
 *
 * ---------------------------------------------------------------------------
 * READ THIS BEFORE RELYING ON IT
 *
 * This is best-effort, not a guarantee. Google gives away review data through
 * exactly one supported channel — the Places API "Enterprise + Atmosphere" SKU,
 * which needs a Cloud project with a payment card on file. Everything free is
 * something Google actively defends:
 *
 *   - the internal listugcposts RPC answers 403 to unauthenticated callers
 *   - the place page ships as a JavaScript shell with no reviews in the HTML
 *   - driving it with a real browser works intermittently; Google serves a
 *     degraded page once it suspects automation, and the class names the
 *     extraction depends on (.d4r55, .wiI7pd) are minified build output that
 *     changes without notice
 *
 * So the design goal here is not "always succeeds" — that is not on offer for
 * free. It is "never makes things worse":
 *
 *   1. Never delete a review already in the file.
 *   2. Never write an empty list; a failed scrape must not blank the site.
 *   3. Never exit non-zero on failure. A broken scrape is not a broken site,
 *      and a red workflow every night just teaches people to ignore it.
 *
 * When it does not work, adding a review by hand to content/reviews.json takes
 * about thirty seconds and is the dependable path. See README.md.
 * ---------------------------------------------------------------------------
 */

import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium, type Browser, type Page } from 'playwright-core';
import { site } from '../content/site.ts';

const REVIEWS_PATH = new URL('../content/reviews.json', import.meta.url);

/** Reviews below this rating are never published on the site. */
const MIN_RATING = 4;

/**
 * Entry points, tried in order. The canonical place URL is the one Google's
 * own share link resolves to and is the most reliable; the data= deep link is
 * kept as a fallback in case the canonical form changes.
 */
const ENTRY_URLS = [
  'https://www.google.com/maps/place/Libra+Massz%C3%A1zs+Szalon/@47.5639562,18.958772,17.74z' +
    `/data=!4m7!3m6!1s${site.googleFeatureId}!8m2!3d47.5645843!4d18.9604828` +
    '!15sCgtsaWJyYXN6YWxvbpIBEW1hc3NhZ2VfdGhlcmFwaXN04AEA!16s%2Fg%2F11y314dxdp?hl=hu',
  `https://www.google.com/maps/place/data=!4m5!3m4!1s${site.googleFeatureId}!9m1!1b1?hl=hu&gl=HU`,
];

type StoredReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  avatar: 'male' | 'female';
  source: string;
  publishedAt?: string;
};

type ReviewsFile = {
  updatedAt: string;
  reviews: StoredReview[];
};

type ScrapedReview = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
};

/**
 * Strips emoji and other pictographs.
 *
 * The site has a no-emoji rule and Google reviews routinely contain them.
 * Everything else in the review text is preserved exactly as written.
 */
function stripEmoji(input: string): string {
  return input
    .replace(/[\p{Extended_Pictographic}]/gu, '')
    .replace(/[\u{FE0F}\u{200D}\u{20E3}]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Stable identity across runs, so re-scraping never duplicates a review. */
function reviewId(author: string, text: string): string {
  return createHash('sha1')
    .update(`${author}::${text.slice(0, 120)}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Picks one of the two line-art avatars from the author's given name.
 *
 * The site does not hotlink Google's profile photos — that would leak every
 * visitor's IP to Google on page load. Unrecognised names fall back to the
 * neutral illustration.
 */
const MALE_NAMES = new Set([
  'andrás', 'attila', 'balázs', 'bence', 'csaba', 'dániel', 'dávid', 'ferenc',
  'gábor', 'gergely', 'györgy', 'imre', 'istván', 'jános', 'józsef', 'károly',
  'lajos', 'lászló', 'levente', 'márk', 'márton', 'máté', 'mihály', 'miklós',
  'norbert', 'péter', 'richárd', 'róbert', 'sándor', 'szabolcs', 'tamás',
  'tibor', 'zoltán', 'zsolt', 'ádám', 'ákos', 'árpád', 'patrik', 'kristóf',
  'krisztián', 'bálint', 'barnabás', 'dénes', 'endre', 'gyula', 'zsombor',
]);

function guessAvatar(author: string): 'male' | 'female' {
  const parts = author.toLowerCase().split(/\s+/).filter(Boolean);
  return parts.some((part) => MALE_NAMES.has(part)) ? 'male' : 'female';
}

/** Turns "2 hónapja" / "egy éve" into an approximate ISO date. */
function approximateDate(relative: string, now: Date): string | undefined {
  const match = relative.match(/(\d+|egy|két)\s*(perce|órája|napja|hete|hónapja|éve)/i);
  if (!match) return undefined;

  const raw = match[1].toLowerCase();
  const count = raw === 'egy' ? 1 : raw === 'két' ? 2 : Number(raw);
  const daysPer: Record<string, number> = {
    perce: 0, órája: 0, napja: 1, hete: 7, hónapja: 30, éve: 365,
  };

  const date = new Date(now);
  date.setDate(date.getDate() - count * (daysPer[match[2].toLowerCase()] ?? 0));
  return date.toISOString().slice(0, 10);
}

/** Opens the reviews pane for one entry URL and reads whatever is there. */
async function collectFrom(page: Page, url: string): Promise<ScrapedReview[]> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  // Decline non-essential cookies if the interstitial appears despite the
  // pre-set preference cookie.
  const reject = page
    .getByRole('button', { name: /összes elutasítása|reject all/i })
    .first();
  if (await reject.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await reject.click().catch(() => {});
    await page.waitForTimeout(2_500);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  }

  await page.waitForSelector('h1', { timeout: 30_000 }).catch(() => {});

  // The place panel hydrates well after domcontentloaded, and the reviews tab
  // is present in the DOM before Playwright judges it visible — so poll for it
  // and click through the DOM rather than through actionability checks.
  const clicked = await page
    .waitForFunction(
      () => {
        const tab = Array.from(document.querySelectorAll('[role="tab"]')).find((el) =>
          /élemény|eview/i.test(
            el.getAttribute('aria-label') || (el as HTMLElement).innerText || '',
          ),
        );
        if (!tab) return false;
        (tab as HTMLElement).click();
        return true;
      },
      null,
      { timeout: 40_000, polling: 1_000 },
    )
    .then(() => true)
    .catch(() => false);

  if (!clicked) {
    // Some variants land straight on the reviews list without a tab bar.
    const already = await page.locator('[data-review-id]').count();
    if (already === 0) throw new Error('A vélemények fül nem jelent meg.');
  }

  await page.waitForSelector('[data-review-id]', { timeout: 30_000 });

  // The pane virtualises; scroll it until the count stops growing.
  let previous = -1;
  for (let attempt = 0; attempt < 18; attempt++) {
    const count = await page.locator('[data-review-id]').count();
    if (count === previous) break;
    previous = count;
    await page.evaluate(() => {
      // Walk up from a review card to whichever ancestor actually scrolls.
      let el = document.querySelector('[data-review-id]')?.parentElement ?? null;
      while (el && el.scrollHeight <= el.clientHeight + 50) el = el.parentElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(1_600);
  }

  // "Továbbiak" expands a clamped body; without it the text arrives truncated.
  const more = page.locator('button:has-text("Továbbiak"), button:has-text("More")');
  const moreCount = await more.count();
  for (let i = 0; i < moreCount; i++) {
    await more.nth(i).click({ timeout: 2_000 }).catch(() => {});
  }
  await page.waitForTimeout(800);

  return page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-review-id]'))
      .map((card) => {
        const ratingLabel =
          card
            .querySelector(
              '[role="img"][aria-label*="csillag"], [role="img"][aria-label*="star"]',
            )
            ?.getAttribute('aria-label') ?? '';

        return {
          author:
            (card.querySelector('.d4r55, .WNxzHc') as HTMLElement | null)?.innerText?.trim() ??
            '',
          rating: Number(ratingLabel.replace(',', '.').match(/[\d.]+/)?.[0] ?? 0),
          text:
            (card.querySelector('.wiI7pd, .MyEned') as HTMLElement | null)?.innerText?.trim() ??
            '',
          relativeTime:
            (card.querySelector('.rsqaWe, .xRkPPb') as HTMLElement | null)?.innerText?.trim() ??
            '',
        };
      })
      .filter((r) => r.author && r.rating > 0),
  );
}

async function scrape(): Promise<ScrapedReview[]> {
  let browser: Browser | undefined;

  try {
    browser = await chromium.launch({ channel: 'chromium', headless: true });
    const context = await browser.newContext({
      locale: 'hu-HU',
      timezoneId: 'Europe/Budapest',
      viewport: { width: 1400, height: 1000 },
    });
    // Records a cookie choice up front so the consent wall usually never shows.
    await context.addCookies([
      { name: 'SOCS', value: 'CAESHAgBEhIaAB', domain: '.google.com', path: '/' },
    ]);

    const page = await context.newPage();

    for (const url of ENTRY_URLS) {
      try {
        const reviews = await collectFrom(page, url);
        if (reviews.length > 0) return reviews;
        console.warn(`  Nem talaltam velemenyt itt: ${url.slice(0, 60)}...`);
      } catch (error) {
        console.warn(
          `  Sikertelen: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    return [];
  } finally {
    await browser?.close().catch(() => {});
  }
}

async function main() {
  const stored = JSON.parse(await readFile(REVIEWS_PATH, 'utf8')) as ReviewsFile;
  const existingIds = new Set(stored.reviews.map((r) => r.id));

  let scraped: ScrapedReview[] = [];
  try {
    scraped = await scrape();
  } catch (error) {
    console.warn(`Lekeres sikertelen: ${error instanceof Error ? error.message : error}`);
  }

  if (scraped.length === 0) {
    console.warn('');
    console.warn('Nem sikerult velemenyt lekerni a Google-tol.');
    console.warn('A content/reviews.json valtozatlan marad, az oldal a meglevo');
    console.warn('velemenyekkel mukodik tovabb. Uj velemenyt kezzel is fel lehet');
    console.warn('venni a fajlba — reszletek a README-ben.');
    return;
  }

  const now = new Date();
  const belowThreshold = scraped.filter((r) => r.rating < MIN_RATING).length;

  const incoming = scraped
    .filter((r) => r.rating >= MIN_RATING)
    .map<StoredReview>((r) => {
      const text = stripEmoji(r.text);
      return {
        id: reviewId(r.author, text),
        author: r.author,
        rating: Math.round(r.rating),
        text,
        avatar: guessAvatar(r.author),
        source: 'google',
        publishedAt: approximateDate(r.relativeTime, now),
      };
    })
    .filter((r) => r.text.length > 0);

  const fresh = incoming.filter((r) => !existingIds.has(r.id));

  console.log(`Talalt velemeny:            ${scraped.length}`);
  console.log(`4 csillag alatt kiszurve:   ${belowThreshold}`);
  console.log(`Uj velemeny:                ${fresh.length}`);

  if (fresh.length === 0) {
    console.log('Nincs valtozas.');
    return;
  }

  const merged: ReviewsFile = {
    updatedAt: now.toISOString().slice(0, 10),
    reviews: [...fresh, ...stored.reviews],
  };

  await writeFile(REVIEWS_PATH, JSON.stringify(merged, null, 2) + '\n');
  console.log(`Frissitve — osszesen ${merged.reviews.length} velemeny.`);
}

main().catch((error) => {
  // Deliberately exits 0: the site keeps working on the last good data.
  console.warn('A scraper hibaba utkozott, a tartalom valtozatlan.', error);
});
