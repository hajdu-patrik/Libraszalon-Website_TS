'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { StarRating } from '@/components/home/StarRating';
import { Picture } from '@/components/ui/Picture';
import type { Review } from '@/content/reviews';

type ReviewCardProps = {
  review: Review;
};

const CLAMP_LINES = 8;

export function ReviewCard({ review }: ReviewCardProps) {
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

const measure = () => {
      if (expanded) return;
      setOverflowing(el.scrollHeight > el.clientHeight + 1);
    };

    measure();

    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [expanded]);

  return (
    <article className="card-interactive flex h-full snap-start flex-col rounded-2xl bg-surface p-7">
      <StarRating rating={review.rating} />

      <p
        ref={bodyRef}
        style={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: CLAMP_LINES,
                overflow: 'hidden',
              }
        }
        className="mt-4 text-[length:var(--text-ui)] leading-relaxed whitespace-pre-line text-muted"
      >
        {review.text}
      </p>

      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-2 inline-flex min-h-11 min-w-11 items-center self-start text-[length:var(--text-meta)] font-semibold text-gold-ink transition-colors hover:text-ink"
        >
          {expanded ? 'Kevesebb' : 'Tovább'}
        </button>
      )}

      <footer className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        <Picture
          slug={review.avatar === 'male' ? 'avatar-male' : 'avatar-female'}
          alt=""
          sizes="40px"
          className="size-10 shrink-0 opacity-70"
        />
        <p className="min-w-0 truncate font-heading text-xl text-ink">
          {review.author}
        </p>
      </footer>
    </article>
  );
}
