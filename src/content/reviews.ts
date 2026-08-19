/**
 * Review data access.
 *
 * The JSON file is maintained by scripts/scrape-reviews.ts (daily GitHub
 * Action). This module is the only thing the UI imports, so the filtering
 * rules live in one place:
 *   - only 4 stars and above are ever shown
 *   - at most REVIEWS_DISPLAY_LIMIT appear in the carousel
 */

import data from './reviews.json';

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  avatar: 'male' | 'female';
  source: string;
  /** ISO date, present on scraped reviews. */
  publishedAt?: string;
};

/** Reviews below this rating are never published on the site. */
export const MIN_RATING = 4;

/**
 * How many reviews the carousel holds at once.
 *
 * A ceiling, not a target. The strip loops, so length costs nothing to read —
 * the only reason to cap it at all is that every card is rendered twice to
 * make the wrap seamless, and a very long list would start to weigh on a
 * phone. Twenty is far above the salon's current count and well below where
 * that matters, so in practice every eligible review is published.
 */
export const REVIEWS_DISPLAY_LIMIT = 20;

const all = data.reviews as Review[];

export const publishedReviews: Review[] = all
  .filter((r) => r.rating >= MIN_RATING && r.text.trim().length > 0)
  .slice(0, REVIEWS_DISPLAY_LIMIT);

/** Aggregate over everything eligible, not just the displayed slice. */
export const reviewStats = (() => {
  const eligible = all.filter((r) => r.rating >= MIN_RATING);
  const count = eligible.length;
  const average =
    count === 0 ? 0 : eligible.reduce((sum, r) => sum + r.rating, 0) / count;
  return { count, average: Math.round(average * 10) / 10 };
})();

export const reviewsNote =
  'A weboldalon elhelyezett értékelések a Google Értékelések szolgáltatásából származnak.';
