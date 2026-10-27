import { Star } from 'lucide-react';
import { ui } from '@/content/ui';

type StarRatingProps = {
  rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
  const filled = Math.round(rating);

  return (
    <div
      role="img"
      aria-label={ui.starRating(rating.toLocaleString('hu-HU'))}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`size-[1.125rem] ${
            index < filled ? 'fill-gold text-gold' : 'fill-current/15 text-current/15'
          }`}
        />
      ))}
    </div>
  );
}
