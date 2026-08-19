/**
 * Last-resort review scraper. Prefer scripts/fetch-reviews.ts.
 *
 *   npm run reviews:scrape
 *
 * ---------------------------------------------------------------------------
 * READ THIS BEFORE RELYING ON IT
 *
 * As of August 2026 this does not work, and the reason is not a bug that can
 * be fixed here. Google serves the place page in two shapes and picks between
 * them per session: one has the tab bar and the review pane, the other is a
 * stripped panel with the address and the phone number and no tabs at all.
 * Headless Chromium gets the stripped one — nine consecutive sessions, three
 * entry URLs each, zero reviews — while an ordinary browser on the same
 * machine and the same URL gets the full page every time. Pushing harder gets
 * you a CAPTCHA, which is where this stops.
 *
 * The extraction below was repaired anyway, because the faults were real and
 * would have produced wrong data rather than no data on any page that did
 * load: the entry URLs had rotted, the "Több" control was being matched by the
 * wrong string so every body arrived truncated at ~240 characters, the author
 * came through as "Név\n3 vélemény", and the virtualised pane was only ever
 * read one screenful deep. If a run from another address ever gets the full
 * page, it will now collect the whole list correctly.
 *
 * The design goal is not "always succeeds" — that was never on offer. It is
 * "never makes things worse", and those guarantees now live in
 * scripts/reviews-store.ts, shared with the API path:
 *
 *   1. A thin result may only add; it can never delete.
 *   2. Never write an empty list; a failed run must not blank the site.
 *   3. Never exit non-zero. A broken scrape is not a broken site, and a red
 *      workflow every night just teaches people to ignore it.
 *
 * Adding a review by hand to src/content/reviews.json takes about thirty
 * seconds and remains the dependable path until the API access lands.
 * ---------------------------------------------------------------------------
 */

import { chromium, type Browser, type Page } from 'playwright-core';
import { site } from '../src/content/site.ts';
import {
  MIN_RATING,
  commitReviews,
  guessAvatar,
  reviewId,
  stripEmoji,
  type StoredReview,
} from './reviews-store.ts';

/**
 * Entry points, tried in order.
 *
 * The share link goes first because it is the only one that still works. Both
 * hand-built `data=` deep links now land on the generic map view — Google
 * drops the place out of the URL and answers with the city, no place panel and
 * no reviews tab, which is what the "A vélemények fül nem jelent meg" failure
 * actually was. The short link resolves to the canonical place URL that Google
 * itself generates, and that one still opens the panel.
 *
 * The deep links stay as fallbacks: they cost one page load each when the
 * share link works, and they are the only thing left if the short link is ever
 * retired.
 */
const ENTRY_URLS = [
  site.social.googleMaps,
  'https://www.google.com/maps/place/Libra+Massz%C3%A1zs+Szalon/@47.5639562,18.958772,17.74z' +
    `/data=!4m7!3m6!1s${site.googleFeatureId}!8m2!3d47.5645843!4d18.9604828` +
    '!15sCgtsaWJyYXN6YWxvbpIBEW1hc3NhZ2VfdGhlcmFwaXN04AEA!16s%2Fg%2F11y314dxdp?hl=hu',
  `https://www.google.com/maps/place/data=!4m5!3m4!1s${site.googleFeatureId}!9m1!1b1?hl=hu&gl=HU`,
];

type ScrapedReview = {
  /** Google's own review id, used to deduplicate the virtualised pane. */
  googleId: string;
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
};

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

  /**
   * Harvest as we scroll, rather than scrolling to the end and reading once.
   *
   * The pane is virtualised: it holds a fixed pool of about two dozen nodes
   * and recycles them as you scroll, so the node count never grows. The old
   * loop watched that count and stopped on the first pass — one screenful,
   * and then it read whatever happened to be mounted. Accumulating by Google's
   * own review id is what actually collects all of them, and it is also what
   * makes the recycled duplicates harmless.
   */
  const collected = new Map<string, ScrapedReview>();
  let idleRounds = 0;

  for (let attempt = 0; attempt < 30 && idleRounds < 3; attempt++) {
    // Expand every clamped body currently mounted, before reading it.
    //
    // The control is labelled "Több", not "Továbbiak" — the old selector was
    // matching the aria-label's wording against the visible text and never hit
    // anything, which is why bodies arrived cut off at ~240 characters with an
    // ellipsis. The full text is genuinely absent from the DOM until this is
    // clicked, so there is nothing to recover afterwards.
    //
    // It has to be a real click: Google's handler ignores synthetic events.
    const expanders = page.locator(
      'button.w8nwRe, button[aria-label="Továbbiak megjelenítése"], button[aria-label="See more"]',
    );
    const expanderCount = await expanders.count();
    for (let i = 0; i < expanderCount; i++) {
      await expanders.nth(i).click({ timeout: 1_500 }).catch(() => {});
    }
    if (expanderCount > 0) await page.waitForTimeout(600);

    const batch = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-review-id]'))
        .map((card) => {
          const ratingLabel =
            card
              .querySelector(
                '[role="img"][aria-label*="csillag"], [role="img"][aria-label*="star"]',
              )
              ?.getAttribute('aria-label') ?? '';

          // .d4r55 sits inside a button that also carries the author's total
          // review count, so innerText comes through as "Név\n3 vélemény".
          // Only the first line is the name.
          const author =
            (card.querySelector('.d4r55, .WNxzHc') as HTMLElement | null)?.innerText
              ?.trim()
              .split('\n')[0]
              ?.trim() ?? '';

          return {
            googleId: card.getAttribute('data-review-id') ?? '',
            author,
            rating: Number(ratingLabel.replace(',', '.').match(/[\d.]+/)?.[0] ?? 0),
            text:
              (card.querySelector('.wiI7pd, .MyEned') as HTMLElement | null)?.innerText?.trim() ??
              '',
            relativeTime:
              (card.querySelector('.rsqaWe, .xRkPPb') as HTMLElement | null)?.innerText?.trim() ??
              '',
          };
        })
        .filter((r) => r.googleId && r.author && r.rating > 0),
    );

    let added = 0;
    for (const review of batch) {
      const existing = collected.get(review.googleId);
      // A recycled node may be re-read before its body has expanded; keep
      // whichever copy of a review carries the most text.
      if (!existing || review.text.length > existing.text.length) {
        if (!existing) added++;
        collected.set(review.googleId, review);
      }
    }
    idleRounds = added === 0 ? idleRounds + 1 : 0;

    await page.evaluate(() => {
      // Walk up from a review card to whichever ancestor actually scrolls.
      let el = document.querySelector('[data-review-id]')?.parentElement ?? null;
      while (el && el.scrollHeight <= el.clientHeight + 50) el = el.parentElement;
      if (el) el.scrollTop = el.scrollTop + el.clientHeight * 0.9;
    });
    await page.waitForTimeout(1_400);
  }

  return [...collected.values()];
}

/**
 * How many fresh browser sessions to try before giving up.
 *
 * Google serves the place page in two shapes and picks between them per
 * session. One has the tab bar and the review pane; the other is a stripped
 * panel with the address, the phone number and no tabs at all — the same URL,
 * seconds apart, with nothing in the request to explain the difference. Waiting
 * longer does not turn the second into the first; only a new session does.
 *
 * So the retry is not politeness about slow loading, it is a second draw. Three
 * sessions is where the odds stop improving much for the time they cost.
 */
const SESSION_ATTEMPTS = 3;

async function scrape(): Promise<ScrapedReview[]> {
  for (let attempt = 1; attempt <= SESSION_ATTEMPTS; attempt++) {
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
          if (reviews.length > 0) {
            console.log(`  Sikeres a(z) ${attempt}. probalkozasra.`);
            return reviews;
          }
          console.warn(`  Nem talaltam velemenyt itt: ${url.slice(0, 60)}...`);
        } catch (error) {
          console.warn(
            `  Sikertelen: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    } finally {
      await browser?.close().catch(() => {});
    }

    if (attempt < SESSION_ATTEMPTS) {
      console.warn(`  A(z) ${attempt}. munkamenet ures volt, ujraprobalom.`);
    }
  }
  return [];
}

async function main() {
  let scraped: ScrapedReview[] = [];
  try {
    scraped = await scrape();
  } catch (error) {
    console.warn(`Lekeres sikertelen: ${error instanceof Error ? error.message : error}`);
  }

  const now = new Date();
  const belowThreshold = scraped.filter((r) => r.rating < MIN_RATING).length;

  const incoming = scraped
    .filter((r) => r.rating >= MIN_RATING)
    .map<StoredReview>((r) => ({
      id: reviewId(r.googleId),
      author: r.author,
      rating: Math.round(r.rating),
      text: stripEmoji(r.text),
      avatar: guessAvatar(r.author),
      source: 'google',
      publishedAt: approximateDate(r.relativeTime, now),
    }))
    .filter((r) => r.text.length > 0);

  if (scraped.length > 0) {
    console.log(`Talalt velemeny:            ${scraped.length}`);
    console.log(`${MIN_RATING} csillag alatt kiszurve:   ${belowThreshold}`);
    console.log(`Publikalhato:               ${incoming.length}`);
  }

  const wrote = await commitReviews(incoming, 'scraper');
  if (!wrote && incoming.length === 0) {
    console.warn('Uj velemenyt kezzel is fel lehet venni a fajlba — reszletek a README-ben.');
  }
}

main().catch((error) => {
  // Deliberately exits 0: the site keeps working on the last good data.
  console.warn('A scraper hibaba utkozott, a tartalom valtozatlan.', error);
});
