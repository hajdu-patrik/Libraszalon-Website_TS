/**
 * Shared review storage, used by both review sources.
 *
 * There are two ways reviews reach src/content/reviews.json — the supported
 * Business Profile API (scripts/fetch-reviews.ts) and the best-effort scraper
 * (scripts/scrape-reviews.ts) — and exactly one set of rules about what may be
 * written. Those rules live here rather than in either script, because the two
 * had already drifted apart once: whichever ran last decided the shape of the
 * file, and the safety guarantees the scraper documented so carefully were not
 * guarantees at all if the other path did something different.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export const REVIEWS_PATH = new URL('../src/content/reviews.json', import.meta.url);

/** Reviews below this rating are never published on the site. */
export const MIN_RATING = 4;

/**
 * At or above this many reviews, a fetch is treated as a complete picture of
 * the listing and replaces the file. Below it, the result is treated as a
 * fragment that may only add.
 *
 * Both directions matter. The site is supposed to show what Google shows, so a
 * file that only ever grows would keep publishing a review that has since been
 * edited or taken down. But a run that limps in with two reviews because the
 * connection dropped halfway must not be allowed to delete the other nine.
 */
export const REPLACE_FLOOR = 5;

export type StoredReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  avatar: 'male' | 'female';
  source: string;
  /** ISO date. */
  publishedAt?: string;
};

export type ReviewsFile = {
  updatedAt: string;
  reviews: StoredReview[];
};

/**
 * Stable identity across runs and across sources.
 *
 * Keyed on whatever id the upstream gives for the review itself, never on its
 * text: the scraper reads bodies that arrive truncated until expanded, so a
 * text-derived id changed depending on how far the page had loaded, and an
 * author fixing a typo became a second review.
 */
export function reviewId(upstreamId: string): string {
  return createHash('sha1').update(upstreamId).digest('hex').slice(0, 16);
}

/**
 * Strips emoji and other pictographs.
 *
 * The site has a no-emoji rule and Google reviews routinely contain them.
 * Everything else in the review text is preserved exactly as written.
 */
export function stripEmoji(input: string): string {
  return input
    .replace(/[\p{Extended_Pictographic}]/gu, '')
    .replace(/[\u{FE0F}\u{200D}\u{20E3}]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Picks one of the two line-art avatars from the author's given name.
 *
 * The site does not use Google's profile photos even where the API hands them
 * over: hotlinking them would leak every visitor's IP to Google on page load,
 * and copying them into the repo would republish someone's face without asking.
 * Unrecognised names fall back to the neutral illustration.
 */
const MALE_NAMES = new Set([
  'andrás', 'attila', 'balázs', 'bence', 'csaba', 'dániel', 'dávid', 'ferenc',
  'gábor', 'gergely', 'györgy', 'imre', 'istván', 'jános', 'józsef', 'károly',
  'lajos', 'lászló', 'levente', 'márk', 'márton', 'máté', 'mihály', 'miklós',
  'norbert', 'péter', 'richárd', 'róbert', 'sándor', 'szabolcs', 'tamás',
  'tibor', 'zoltán', 'zsolt', 'ádám', 'ákos', 'árpád', 'patrik', 'kristóf',
  'krisztián', 'bálint', 'barnabás', 'dénes', 'endre', 'gyula', 'zsombor',
  'géza', 'lőrinc', 'olivér', 'benedek', 'ábel', 'nándor', 'zsigmond',
]);

export function guessAvatar(author: string): 'male' | 'female' {
  const parts = author.toLowerCase().split(/\s+/).filter(Boolean);
  return parts.some((part) => MALE_NAMES.has(part)) ? 'male' : 'female';
}

export async function readStore(): Promise<ReviewsFile> {
  return JSON.parse(await readFile(REVIEWS_PATH, 'utf8')) as ReviewsFile;
}

/**
 * Writes the incoming set according to the rules above, and reports what it
 * did. Returns false when nothing changed, so a caller can skip the commit.
 */
export async function commitReviews(
  incoming: StoredReview[],
  label: string,
): Promise<boolean> {
  const stored = await readStore();

  if (incoming.length === 0) {
    console.warn(`Nem sikerult velemenyt lekerni (${label}).`);
    console.warn('A src/content/reviews.json valtozatlan marad.');
    return false;
  }

  const authoritative = incoming.length >= REPLACE_FLOOR;
  if (!authoritative) {
    console.warn(
      `Csak ${incoming.length} velemeny jott le (${REPLACE_FLOOR} alatt), ` +
        'ezert csak hozzafuzes tortenik, csere nem.',
    );
  }

  const existingIds = new Set(stored.reviews.map((r) => r.id));
  const reviews = authoritative
    ? incoming
    : [...incoming.filter((r) => !existingIds.has(r.id)), ...stored.reviews];

  if (JSON.stringify(stored.reviews) === JSON.stringify(reviews)) {
    console.log('Nincs valtozas.');
    return false;
  }

  const merged: ReviewsFile = {
    updatedAt: new Date().toISOString().slice(0, 10),
    reviews,
  };
  await writeFile(REVIEWS_PATH, JSON.stringify(merged, null, 2) + '\n');
  console.log(`Frissitve (${label}) — osszesen ${reviews.length} velemeny.`);
  return true;
}
