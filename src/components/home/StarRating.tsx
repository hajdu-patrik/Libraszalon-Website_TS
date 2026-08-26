import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  /**
   * Colour scheme of the surface the row sits on. It decides the *empty* star
   * only — a filled one is the brand gold on either ground. On white the unlit
   * star is the warm hairline; on the dark band that same colour would read as
   * a sixth filled star, so it becomes a dim of the copy colour instead.
   */
  tone?: 'light' | 'dark';
  /** Stagger the fill so the row reads left to right when it appears. */
  animate?: boolean;
};

const EMPTY = {
  light: 'fill-line text-line',
  dark: 'fill-cream-text/20 text-cream-text/20',
} as const;

/**
 * A five-star rating.
 *
 * The hero used to draw its own copy of this loop, because the one thing it
 * needed — unlit stars that work on the dark scrim — was the one thing this
 * component could not say. That is a prop, not a second implementation: the
 * count, the rounding, the label a screen reader reads and the decision to
 * hide the glyphs from it were all duplicated to get at it.
 */
export function StarRating({
  rating,
  tone = 'light',
  animate = true,
}: StarRatingProps) {
  const filled = Math.round(rating);

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} csillag az 5-ből`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`size-[1.125rem] ${
            index < filled ? 'fill-gold text-gold' : EMPTY[tone]
          }`}
          {...(animate && {
            style: {
              animation: 'fade-in var(--dur-base) var(--ease-smooth) both',
              // Five stars, so the last one starts at 180ms.
              animationDelay: `${index * 45}ms`,
            },
          })}
        />
      ))}
    </div>
  );
}
