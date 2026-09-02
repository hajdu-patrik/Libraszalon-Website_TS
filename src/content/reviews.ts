

import data from './reviews.json';

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  avatar: 'male' | 'female';
  source: string;

  publishedAt?: string;
};

export const MIN_RATING = 4;

export const REVIEWS_DISPLAY_LIMIT = 20;

const all = data.reviews as Review[];

const validReviews = all.filter(
  (review) => Number.isFinite(review.rating) && review.rating >= 1 && review.rating <= 5,
);

export const publishedReviews: Review[] = all
  .filter((r) => r.rating >= MIN_RATING && r.text.trim().length > 0)
  .slice(0, REVIEWS_DISPLAY_LIMIT);

export const reviewStats = (() => {
  const count = validReviews.length;
  const average =
    count === 0 ? 0 : validReviews.reduce((sum, review) => sum + review.rating, 0) / count;
  return { count, average: Math.round(average * 10) / 10 };
})();

export const reviewsNote =
  'A weboldalon elhelyezett értékelések a Google Értékelések szolgáltatásából származnak.';
