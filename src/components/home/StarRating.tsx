import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;

tone?: 'light' | 'dark';

  animate?: boolean;
};

const EMPTY = {
  light: 'fill-line text-line',
  dark: 'fill-cream-text/20 text-cream-text/20',
} as const;

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
              animationDelay: `${index * 45}ms`,
            },
          })}
        />
      ))}
    </div>
  );
}
