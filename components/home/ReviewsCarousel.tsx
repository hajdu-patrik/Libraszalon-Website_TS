'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ReviewCard } from '@/components/home/ReviewCard';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/Icons';
import type { Review } from '@/content/reviews';

type ReviewsCarouselProps = {
  reviews: Review[];
};

/**
 * Horizontally scrolling review strip.
 *
 * Built on native overflow scrolling with CSS scroll snapping rather than a
 * carousel library: touch, trackpad, keyboard and screen readers all work
 * without any JavaScript, and the script here only adds the arrows and dots.
 * That also means it degrades to a plain scrollable list if hydration fails.
 */
export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    setAtStart(scrollLeft < 8);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 8);

    // Card positions are read from the DOM so the indicator stays correct at
    // any viewport width without duplicating the CSS sizing rules in JS.
    const cards = Array.from(track.children) as HTMLElement[];
    let nearest = 0;
    let smallest = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
      if (distance < smallest) {
        smallest = distance;
        nearest = index;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    sync();
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      track.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;

    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };

  const step = (direction: -1 | 1) => {
    scrollToCard(Math.min(Math.max(active + direction, 0), reviews.length - 1));
  };

  if (reviews.length === 0) return null;

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Vélemények"
        className="no-scrollbar -mx-[var(--container-pad)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--container-pad)] py-2 sm:gap-5"
      >
        {reviews.map((review) => (
          <li
            key={review.id}
            className="flex w-[min(85vw,22rem)] shrink-0 snap-start lg:w-[21rem]"
          >
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>

      {/* Controls — shrink-0 on the arrows so seven dots cannot squash them
          below a thumb-sized target at 320px. */}
      <div className="mt-7 flex items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Előző vélemény"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-gold hover:text-gold-ink disabled:pointer-events-none disabled:opacity-35"
        >
          <ArrowLeftIcon className="size-5" />
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              onClick={() => scrollToCard(index)}
              aria-label={`${index + 1}. vélemény`}
              aria-current={index === active ? 'true' : undefined}
              // 24x44: meets the WCAG 2.2 minimum target size on the narrow
              // axis while still leaving the arrows their full 44px at 320px.
              // The gate reads the reason off the attribute rather than
              // carrying a component name of its own.
              data-target-exempt="24x44 dot: seven of these plus two 44px arrows have to fit 320px"
              className="group inline-flex h-11 w-6 shrink-0 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-300 ease-[var(--ease-out-expo)] ${
                  index === active
                    ? 'h-1.5 w-4 bg-gold'
                    : 'size-1.5 bg-line group-hover:bg-gold/60'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Következő vélemény"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-gold hover:text-gold-ink disabled:pointer-events-none disabled:opacity-35"
        >
          <ArrowRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
