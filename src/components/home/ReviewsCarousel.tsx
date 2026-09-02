'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReviewCard } from '@/components/home/ReviewCard';
import type { Review } from '@/content/reviews';
import { usePrefersReducedMotion } from '@/lib/hooks/useReducedMotion';

type ReviewsCarouselProps = {
  reviews: Review[];
};

const AUTO_ADVANCE_MS = 4000;

const COPIES = 3;

const SETTLE_MS = 250;

const ARROW_CLASS =
  'inline-flex size-11 items-center justify-center rounded-full border border-cream-text/25 bg-ink-deep text-cream-text shadow-(--shadow-lift) transition-[background-color,border-color,color] duration-(--dur-base) ease-smooth hover:border-gold hover:bg-ink hover:text-gold sm:size-12 md:absolute md:top-1/2 md:z-20 md:-translate-y-1/2';

export function ReviewsCarousel({ reviews }: Readonly<ReviewsCarouselProps>) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);

const [pointerHeld, setPointerHeld] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const paused = pointerHeld || focusWithin;

  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  const count = reviews.length;
  const loopLength = count * COPIES;

  const firstExposed = count;

const goTo = useCallback(
    (index: number, smooth: boolean) => {
      const track = trackRef.current;
      const card = track?.children[index] as HTMLElement | undefined;
      if (!track || !card) return;
      indexRef.current = index;
      track.scrollTo({
        left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
        behavior: smooth && !reduced ? 'smooth' : 'auto',
      });
    },
    [reduced],
  );

  const advance = useCallback(
    (direction: 1 | -1) => {
      const from = indexRef.current;
      let next = from + direction;

if (next >= loopLength) {
        goTo(from - count, false);
        next = from - count + direction;
      } else if (next < 0) {
        goTo(from + count, false);
        next = from + count + direction;
      }

      goTo(next, true);
    },
    [count, goTo, loopLength],
  );

useEffect(() => {
    goTo(firstExposed, false);
  }, [firstExposed, goTo]);

useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    let settle = 0;

    const measure = () => {
      const middle = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < track.children.length; i++) {
        const card = track.children[i] as HTMLElement;
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
        if (distance < best) {
          best = distance;
          nearest = i;
        }
      }
      setActive(nearest);

indexRef.current = nearest;
    };

const normalise = () => {
      const index = indexRef.current;
      if (index < count) goTo(index + count, false);
      else if (index >= count * 2) goTo(index - count, false);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
      window.clearTimeout(settle);
      settle = window.setTimeout(normalise, SETTLE_MS);
    };

    measure();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [count, goTo]);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) advance(1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [advance, paused, reduced]);

  if (count === 0) return null;

const loop = Array.from({ length: COPIES }, () => reviews).flat();

  return (

<div className="relative">
      <ul
        ref={trackRef}
        aria-label="Vélemények"
        onMouseEnter={() => setPointerHeld(true)}
        onMouseLeave={() => setPointerHeld(false)}
        onTouchStart={() => setPointerHeld(true)}
        onTouchEnd={() => setPointerHeld(false)}
        onTouchCancel={() => setPointerHeld(false)}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
        }}

  className="no-scrollbar -mx-(--container-pad) flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[calc((100%+2*var(--container-pad)-var(--rev-card))/2)] py-2 [--rev-card:min(86vw,20rem)] sm:gap-5 md:[--rev-card:20rem] lg:[--rev-card:21rem]"
      >
        {loop.map((review, index) => {
          const duplicate = index < firstExposed || index >= firstExposed + count;
          const isActive = index === active;
          return (
            <li
              key={`${review.id}-${index}`}
              aria-hidden={duplicate || undefined}
              inert={duplicate || undefined}
              data-active={isActive || undefined}

              className="flex w-(--rev-card) shrink-0 snap-center opacity-90 transition-opacity duration-(--dur-base) ease-smooth data-active:opacity-100 *:transition-[box-shadow,border-color] *:duration-(--dur-base) *:ease-smooth data-active:*:border-gold data-active:*:shadow-(--shadow-lift)"
            >
              <ReviewCard review={review} />
            </li>
          );
        })}
      </ul>

      <div className="mt-7 flex justify-center gap-3 md:contents">
        <button
          type="button"
          onClick={() => advance(-1)}
          onMouseDown={(event) => event.preventDefault()}
          aria-label="Előző vélemény"
          className={`${ARROW_CLASS} md:left-0 md:-translate-x-1/2`}
        >
          <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={() => advance(1)}
          onMouseDown={(event) => event.preventDefault()}
          aria-label="Következő vélemény"
          className={`${ARROW_CLASS} md:right-0 md:translate-x-1/2`}
        >
          <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
