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
 * edge. At 320px the gutter is 16px against a 22px overhang: the disc would
 * push the document sideways. Below md they stay under the strip, where they
 * cover nothing at any width.
 *
 * Transparent no longer works either way. Half of each disc now sits over a
 * white review card, so it carries its own dark ground and a lift shadow to
 * separate it from both surfaces it crosses.
 */
const ARROW_CLASS =
  'inline-flex size-11 items-center justify-center rounded-full border border-cream-text/25 bg-ink-deep text-cream-text shadow-[var(--shadow-lift)] transition-[background-color,border-color,color] duration-(--dur-base) ease-smooth hover:border-gold hover:bg-ink hover:text-gold sm:size-12 md:absolute md:top-1/2 md:z-20 md:-translate-y-1/2';

/**
 * Endless review strip with one card held at the centre.
 *
 * Built on native overflow scrolling with CSS scroll snapping rather than a
 * carousel library: touch, trackpad, keyboard and screen readers all work
 * without any JavaScript, and the script here only adds the auto-play, the
 * arrows, the seamless wrap and the reading of which card is centred. If
 * hydration fails it degrades to a plain scrollable list.
 *
 * The card in the middle is the one being read, so it is the one marked. Its
 * neighbours are deliberately cut by the edges of the strip — five cards are
 * in view and only the middle one is whole, which is what tells you the list
 * runs past the frame in both directions without needing a scrollbar to say so.
 *
 * Two things make that work. `snap-center` rather than `snap-start`, so a card
 * settles in the middle instead of against the left edge; and the padding on
 * the track, half the leftover width, without which the first and last cards
 * could never reach the centre at all — the strip would stop with them jammed
 * against the ends and the marked card would be the wrong one.
 *
 * The loop is seamless because the list is rendered twice: when the strip
 * reaches the start of the second copy it snaps back to the first instantly,
 * which is invisible since the two are identical. WCAG 2.2.2 needs moving
 * content to be pausable, so it stops on hover, on focus, while a finger is
 * held on it and when the tab is hidden — and never starts at all under
 * prefers-reduced-motion.
 */
export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
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

  /**
   * Scrolls so that card `index` sits in the middle of the strip.
   *
   * Measured off the element rather than multiplied out from a card width,
   * because the width is a clamp on vw at two breakpoints and the padding that
   * lets the ends centre is derived from it — duplicating either here would
   * mean the JS and the CSS could disagree at exactly the sizes nobody tests.
   */
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

  // Start with a card centred rather than flush left. Without this the strip
  // opens with nothing marked and the first card half off the edge.
  useEffect(() => {
    goTo(0, false);
  }, [goTo]);

  /**
   * Reads which card is centred, rather than trusting the index the last
   * programmatic scroll set.
   *
   * The two part company constantly: a flick, a trackpad swipe, a keyboard
   * arrow or a snap settling after the seam all move the strip without going
   * through goTo. Measuring the DOM is the only version that stays true for
   * every one of them, and it is cheap — one pass over a dozen elements,
   * throttled to a frame.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
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
      indexRef.current = nearest % reviews.length;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reviews.length]);

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
     * mouseenter on tap and then nothing until the next tap.
     *
     * onTouchEnd and onTouchCancel both release. Cancel matters: sliding the
     * finger off the strip, or the browser claiming the gesture for a scroll,
     * ends the touch without a touchend, and without it the strip would stay
     * frozen until the page was touched again. */
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
        /* --rev-card is the one place a card's width is written down. The
           track's inline padding is half the leftover, which is what lets the
           first and last cards reach the middle; both the card and the padding
           read the same variable, so they cannot drift.

           The widths are chosen so five cards are in view on a wide screen and
           only the centre one is whole. At 22rem against a 1200px column that
           leaves about 4rem of the second neighbour showing on each side —
           enough to read as "there is more this way", not enough to compete
           with the card being read. */
        className="no-scrollbar -mx-[var(--container-pad)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[calc((100%+2*var(--container-pad)-var(--rev-card))/2)] py-2 [--rev-card:min(78vw,19rem)] sm:gap-5 md:[--rev-card:20rem] lg:[--rev-card:21rem]"
      >
        {loop.map((review, index) => {
          const duplicate = index >= reviews.length;
          const isActive = index === active;
          return (
            <li
              key={`${review.id}-${index}`}
              // The second copy exists only to make the wrap seamless; hide
              // it from assistive tech and keyboard focus so nothing reads
              // twice.
              aria-hidden={duplicate || undefined}
              inert={duplicate || undefined}
              data-active={isActive || undefined}
              /* The mark itself: the centred card keeps full contrast and
                 takes the gold ring, everything else steps back. Opacity and
                 a ring only — nothing here changes the box, so a card moving
                 through the middle cannot nudge its neighbours sideways.

                 70% and not lower, which is a contrast limit rather than a
                 taste one. These are white cards on the dark band, so dimming
                 fades the text and its own background towards each other at
                 the same time: at 55% the body copy lands on 3.97:1 and fails
                 AA, at 70% it holds 5.20:1. A neighbour is still plainly
                 secondary at 70% — the gold ring is doing most of that work
                 anyway.

                 The ring goes on the <li> rather than inside ReviewCard so the
                 card component stays the same object everywhere it is used,
                 and so the transition can sit on the wrapper that is not also
                 the scroll-reveal target. */
              className="flex w-[var(--rev-card)] shrink-0 snap-center opacity-70 transition-opacity duration-(--dur-base) ease-smooth data-active:opacity-100 [&>*]:transition-[box-shadow,border-color] [&>*]:duration-(--dur-base) [&>*]:ease-smooth data-active:[&>*]:border-gold data-active:[&>*]:shadow-[var(--shadow-lift)]"
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
