'use client';

import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReviewCard } from '@/components/home/ReviewCard';
import type { Review } from '@/content/reviews';

type ReviewsCarouselProps = {
  reviews: Review[];
};

/** How long each card rests before the strip advances to the next one. */
const AUTO_ADVANCE_MS = 4000;

/** Round control button, styled for the dark reviews band. */
const CONTROL_CLASS =
  'inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-cream-text/25 bg-transparent text-cream-text transition-all duration-300 ease-[var(--ease-out-expo)] hover:border-gold hover:text-gold';

/**
 * Endless, self-advancing review strip.
 *
 * Built on native overflow scrolling with CSS scroll snapping rather than a
 * carousel library: touch, trackpad, keyboard and screen readers all work
 * without any JavaScript, and the script here only adds the auto-play, the
 * arrows and the seamless wrap. If hydration fails it degrades to a plain
 * scrollable list.
 *
 * The loop is seamless because the list is rendered twice: when the strip
 * reaches the start of the second copy it snaps back to the first instantly,
 * which is invisible since the two are identical. WCAG 2.2.2 needs moving
 * content to be pausable, so it stops on hover, on focus, when the tab is
 * hidden, and on the explicit pause button — and never starts at all under
 * prefers-reduced-motion.
 */
export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);
  const [paused, setPaused] = useState(false);
  // Read after mount, not during render, so the server and first client render
  // agree even when the visitor asks for reduced motion.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Distance from one card's left edge to the next, gap included. Read from the
  // DOM so the JS never has to duplicate the CSS sizing rules.
  const cardStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    const a = track.children[0] as HTMLElement;
    const b = track.children[1] as HTMLElement;
    return b.offsetLeft - a.offsetLeft;
  }, []);

  const goTo = useCallback(
    (index: number, smooth: boolean) => {
      const track = trackRef.current;
      const step = cardStep();
      if (!track || step === 0) return;
      indexRef.current = index;
      track.scrollTo({
        left: index * step,
        behavior: smooth && !reduced ? 'smooth' : 'auto',
      });
    },
    [cardStep, reduced],
  );

  const advance = useCallback(
    (direction: 1 | -1) => {
      const count = reviews.length;
      let next = indexRef.current + direction;

      // Cross the seam instantly before animating, so the move always glides
      // into identical content instead of rewinding the whole strip.
      if (next >= count) {
        goTo(next - count, false);
        next = next - count + 1;
      } else if (next < 0) {
        goTo(next + count, false);
        next = next + count - 1;
      }
      goTo(next, true);
    },
    [goTo, reviews.length],
  );

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) advance(1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [advance, paused, reduced]);

  if (reviews.length === 0) return null;

  // Duplicated so the wrap has identical content to land on.
  const loop = [...reviews, ...reviews];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Vélemények"
        className="no-scrollbar -mx-[var(--container-pad)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--container-pad)] py-2 sm:gap-5"
      >
        {loop.map((review, index) => {
          const duplicate = index >= reviews.length;
          return (
            <li
              key={`${review.id}-${index}`}
              // The second copy exists only to make the wrap seamless; hide it
              // from assistive tech and keyboard focus so nothing reads twice.
              aria-hidden={duplicate || undefined}
              inert={duplicate || undefined}
              className="flex w-[min(85vw,22rem)] shrink-0 snap-start lg:w-[22rem]"
            >
              <ReviewCard review={review} />
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label="Előző vélemény"
          className={CONTROL_CLASS}
        >
          <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>

        {/* Always rendered so the control row is structurally identical on the
            server and the client — reduced-motion only gates the auto-play, not
            the DOM. A visitor who prefers reduced motion sees a resting strip
            and can still step through it or leave it paused. */}
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Vélemények indítása' : 'Vélemények szüneteltetése'}
          aria-pressed={paused}
          className={CONTROL_CLASS}
        >
          {paused ? (
            <Play aria-hidden="true" className="size-4 fill-current" />
          ) : (
            <Pause aria-hidden="true" className="size-4 fill-current" />
          )}
        </button>

        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Következő vélemény"
          className={CONTROL_CLASS}
        >
          <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
