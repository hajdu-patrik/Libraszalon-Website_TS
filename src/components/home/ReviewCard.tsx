'use client';

import { useId, useRef, useState } from 'react';
import { StarRating } from '@/components/home/StarRating';
import { Picture } from '@/components/ui/Picture';
import type { Review } from '@/content/reviews';
import { useIsOverflowing } from '@/lib/hooks/useIsOverflowing';
import { ui } from '@/content/ui';

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const textId = useId();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const clamped = useIsOverflowing(textRef, expanded);

  return (
    <article className="tone-light flex h-full flex-col rounded-2xl border border-line bg-surface p-7 text-ink shadow-card transition-[border-color,box-shadow] duration-(--dur-base) ease-smooth hover:border-gold/50 hover:shadow-lift">
      <StarRating rating={review.rating} />

      <p
        ref={textRef}
        id={textId}
        className={`mt-4 text-ui leading-relaxed whitespace-pre-line text-muted ${
          expanded ? '' : 'line-clamp-8'
        }`}
      >
        {review.text}
      </p>

      {(clamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={textId}
          className="mt-2 inline-flex min-h-11 min-w-11 items-center self-start text-meta font-semibold text-gold-ink transition-colors hover:text-ink"
        >
          {expanded ? ui.reviews.collapse : ui.reviews.expand}
        </button>
      )}

      <footer className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        <Picture
          slug={review.avatar === 'male' ? 'avatar-male' : 'avatar-female'}
          alt=""
          sizes="40px"
          className="size-10 shrink-0 opacity-70"
        />
        <p className="min-w-0 truncate font-heading text-xl text-ink">{review.author}</p>
      </footer>
    </article>
  );
}
