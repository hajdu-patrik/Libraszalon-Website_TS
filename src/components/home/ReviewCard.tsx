'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { StarRating } from '@/components/home/StarRating';
import { Picture } from '@/components/ui/Picture';
import type { Review } from '@/content/reviews';

type ReviewCardProps = {
  review: Review;
};

const CLAMP_LINES = 8;

/**
 * A single Google review — a light card designed for the dark reviews band.
 *
 * Bodies range from three lines to a full screen, so they are clamped and get
 * an expand control. The button only appears when the text is actually
 * overflowing, measured after layout rather than guessed from character count
 * (which is wrong as soon as the card width changes).
 */
export function ReviewCard({ review }: ReviewCardProps) {
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    // Measured on mount and on viewport resize only.
    //
    // A ResizeObserver on this paragraph feeds back on itself: cards in the
    // carousel stretch to a shared height, so revealing the expand button
    // shrinks the space left for the text, which flips the measurement, which
    // hides the button again. That oscillation pegs the main thread.
    // Card width can only change when the window does, so listening to the
    // window is both sufficient and stable.
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
    <article className="flex h-full snap-start flex-col rounded-2xl bg-surface p-7 shadow-[var(--shadow-card)]">
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
        className="mt-4 text-[0.9375rem] leading-relaxed whitespace-pre-line text-muted"
      >
        {review.text}
      </p>

      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-2 inline-flex min-h-11 min-w-11 items-center self-start text-sm font-semibold text-gold-ink transition-colors hover:text-ink"
        >
          {expanded ? 'Kevesebb' : 'Tovább'}
        </button>
      )}

      <footer className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        <Picture
          slug={review.avatar === 'male' ? 'avatar-male' : 'avatar-female'}
          alt=""
          sizes="36px"
          className="size-9 shrink-0 opacity-70"
        />
        <p className="min-w-0 truncate font-heading text-lg text-ink">
          {review.author}
        </p>
      </footer>
    </article>
  );
}
