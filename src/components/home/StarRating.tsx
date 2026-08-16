import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  /** Stagger the fill so the row reads left to right when it appears. */
  animate?: boolean;
};

export function StarRating({ rating, animate = true }: StarRatingProps) {
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
          className={`size-4 ${
            index < filled ? 'fill-gold text-gold' : 'fill-line text-line'
          }`}
          {...(animate && {
            style: {
              animation: 'fade-in 0.4s var(--ease-out-expo) both',
              // Five stars, so the last one starts at 180ms.
              animationDelay: `${index * 45}ms`,
            },
          })}
        />
      ))}
    </div>
  );
}
