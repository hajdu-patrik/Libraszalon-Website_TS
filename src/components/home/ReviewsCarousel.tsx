'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReviewCard } from '@/components/home/ReviewCard';
import type { Review } from '@/content/reviews';

type ReviewsCarouselProps = {
  reviews: Review[];
};

/** How long each card rests before the strip advances to the next one. */
const AUTO_ADVANCE_MS = 4000;

/**
 * The arrows flank the strip from md up and sit in a row beneath it below that.
 *
 * Flanking is the placement the control wants: it puts "next" where the next
 * card is coming from, and it costs the strip no vertical space. It only works
 * where the disc can hang off the strip's edge without hanging off the screen,
 * and that is a question of one measurement — how much room the container
 * gutter has.
 *
 * From md the gutter is 27px and climbing (`--container-pad` is a clamp on
 * vw), so a 48px disc pulled half outside the column still clears the viewport
 * edge, and the 24px it keeps inside lands on the card's 28px padding rather
 * than on its text. At 320px the gutter is 16px against a 22px overhang: the
 * disc would push the document sideways, and the cards are `min(85vw, 22rem)`
 * there, so what it did not overhang it would cover. Below md they stay under
 * the strip, where they cover nothing at any width.
 *
 * Transparent no longer works either way. Half of each disc now sits over a
 * white review card, so it carries its own dark ground and a lift shadow to
 * separate it from both surfaces it crosses.
 */
const ARROW_CLASS =
  'inline-flex size-11 items-center justify-center rounded-full border border-cream-text/25 bg-ink-deep text-cream-text shadow-[var(--shadow-lift)] transition-[background-color,border-color,color] duration-(--dur-base) ease-smooth hover:border-gold hover:bg-ink hover:text-gold sm:size-12 md:absolute md:top-1/2 md:z-20 md:-translate-y-1/2';

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
 * content to be pausable, so it stops on hover, on focus and when the tab is
 * hidden — and never starts at all under prefers-reduced-motion.
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
    /* Held still while the visitor is reading.
     *
     * Four ways in, because "I am reading this one" looks different on every
     * input. A pointer resting on the strip is the desktop tell; focus is the
     * keyboard one; and a finger held on a card is the phone one — which the
     * mouse handlers alone never caught, since a touch screen fires
     * mouseenter on tap and then nothing until the next tap, so the strip
     * either kept moving under the thumb or latched paused for good.
     *
     * onTouchEnd and onTouchCancel both release. Cancel matters: sliding the
     * finger off the strip, or the browser claiming the gesture for a scroll,
     * ends the touch without a touchend, and without it the strip would stay
     * frozen until the page was touched again.
     *
     * A touch-drag on the strip is a scroll, so pausing during it also stops
     * the auto-advance fighting the flick the visitor just made. */
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onTouchCancel={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Vélemények"
        // scroll-px matching the padding is not decoration. Scroll snapping
        // measures against the snapport, which is the scrollport inset by
        // scroll-padding and knows nothing about ordinary padding — so
        // without it the first card snapped 32px left of where the JS had
        // just scrolled to, every programmatic move got nudged back after
        // the fact, and the strip sat a gutter's width out of line with the
        // heading above it.
        className="no-scrollbar -mx-[var(--container-pad)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--container-pad)] py-2 scroll-px-[var(--container-pad)] sm:gap-5"
      >
        {loop.map((review, index) => {
          const duplicate = index >= reviews.length;
          return (
            <li
              key={`${review.id}-${index}`}
              // The second copy exists only to make the wrap seamless; hide
              // it from assistive tech and keyboard focus so nothing reads
              // twice.
              aria-hidden={duplicate || undefined}
              inert={duplicate || undefined}
              className="flex w-[min(85vw,22rem)] shrink-0 snap-start lg:w-[22rem]"
            >
              <ReviewCard review={review} />
            </li>
          );
        })}
      </ul>

      {/* `md:contents` is what lets one pair of buttons be both layouts. Below
          md this is an ordinary centred flex row under the strip; at md the
          wrapper stops generating a box entirely, its two children become
          children of the relative wrapper above for layout purposes, and the
          `md:absolute` in ARROW_CLASS resolves against that instead of against
          this row. No duplicated markup, so nothing is rendered twice to the
          accessibility tree and there is no `hidden` copy to keep in sync. */}
      <div className="mt-7 flex justify-center gap-3 md:contents">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label="Előző vélemény"
          className={`${ARROW_CLASS} md:left-0 md:-translate-x-1/2`}
        >
          <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Következő vélemény"
          className={`${ARROW_CLASS} md:right-0 md:translate-x-1/2`}
        >
          <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
