'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReviewCard } from '@/components/home/ReviewCard';
import type { Review } from '@/content/reviews';
import { usePrefersReducedMotion } from '@/lib/hooks/useReducedMotion';

type ReviewsCarouselProps = {
  reviews: Review[];
};

/** How long each card rests before the strip advances to the next one. */
const AUTO_ADVANCE_MS = 4000;

/**
 * How many times the list is laid down end to end.
 *
 * Two is enough to cover the seam, and two is what this was — but two only
 * covers it on the side you are travelling towards. With the strip parked on
 * the first review there is nothing at all to its left, and the track's inline
 * padding (half the leftover width, which is what lets an end card reach the
 * centre) turns that into a hole: measured at 1550px, 464px of empty band on
 * the left while the cards ran off the right edge. It reads as a strip that
 * failed to load rather than one you can scroll both ways.
 *
 * On a phone the same layout is fine, which is why this went unnoticed: a card
 * is 86vw there, so the leftover is a sliver either side.
 *
 * Three copies with the strip held in the middle one gives every position a
 * full list on both sides, at every width. It also makes the seam ordinary —
 * a single step from any position in the middle copy lands on a real
 * neighbouring card, so nothing has to be spliced mid-move.
 */
const COPIES = 3;

/**
 * Quiet time after the last scroll event before the strip counts as still.
 *
 * The timer restarts on every event, so this is "nothing has moved for a
 * quarter of a second" rather than a fixed delay - long enough to sit out a
 * smooth scroll and the momentum tail of a flick, short enough that the seam
 * is tidied away before anyone can act on it.
 */
const SETTLE_MS = 250;

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
 * The loop is seamless because the list is laid down COPIES times over, so
 * every position has a twin one copy away showing the identical card. Once
 * everything has stopped the strip slides onto the twin in the middle copy -
 * invisibly, since the card on screen does not change. That is what makes the
 * wrap free in both directions, and it is what keeps the card being read a
 * real one: the outer copies are aria-hidden and inert, so parking in one
 * would leave the visible review unreachable by keyboard and absent from the
 * accessibility tree. WCAG 2.2.2 needs moving
 * content to be pausable, so it stops on hover, on focus, while a finger is
 * held on it and when the tab is hidden — and never starts at all under
 * prefers-reduced-motion.
 */
export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);
  // Two reasons to hold the strip, tracked separately and combined here.
  //
  // They shared one boolean before, and a shared boolean means whichever
  // handler fires last wins — which is not what either of them means. Clicking
  // an arrow focuses it, so the strip is held for focus as well as for the
  // pointer; moving the mouse off then cleared the flag outright and the strip
  // started advancing under a control the visitor still had focus on. The
  // reverse case is the one that shows: with the pointer resting on the strip
  // after a click, mouseleave never comes and nothing ever releases it.
  //
  // A reason to pause is not a reason to resume. Only the absence of every
  // reason is.
  const [pointerHeld, setPointerHeld] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const paused = pointerHeld || focusWithin;

  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  const count = reviews.length;
  const loopLength = count * COPIES;
  // The exposed copy: reviews 0..count-1 live at loop indices count..2*count-1.
  const firstExposed = count;

  /**
   * Scrolls so that card `index` sits in the middle of the strip.
   *
   * `index` addresses the doubled strip, 0 to 2N-1 - the space
   * track.children is in, and the space indexRef is kept in.
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
      const from = indexRef.current;
      let next = from + direction;

      // Stepping off the end of the whole strip: hop to the identical card one
      // copy over first - the same picture, so nothing moves on screen - and
      // take the single step from there.
      //
      // With the strip normalised into the middle copy this is unreachable by
      // arrow or auto-advance; only a hand-scroll left parked at the very end
      // can get here. It stays because that is still a state the component can
      // be in, and because the arithmetic is the part that used to be wrong:
      // it rebased the *target* rather than the position being left, then
      // added a step on top, landing one card past the end of the move. On a
      // loop that means a review is passed over every time round. Measured on
      // the built page with the auto-advance held: forward ran 5, 6, 7, 1, 2
      // and backward ran 2, 1, 0, 6, 5 - both directions, always the same
      // review, and invisible from outside because the strip does keep
      // moving.
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

  // Open on the first review *of the middle copy*, so the strip starts with a
  // card centred, marked, and a full list either side of it. Without this it
  // opens flush left with nothing marked.
  useEffect(() => {
    goTo(firstExposed, false);
  }, [firstExposed, goTo]);

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
      // The strip's index space, not the review's. goTo indexes
      // track.children, so a number reduced modulo the review count would
      // address the first copy while the strip was physically in the second,
      // and turn a one-card step into a jump back down the list.
      indexRef.current = nearest;
    };

    // Everything has stopped: if the strip drifted out of the middle copy, put
    // it on the twin of the card it is already showing. Identical content, so
    // the screen does not change - see the note on the component.
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

  // Laid down COPIES times so the wrap has identical content to land on, and
  // so there is always a full list on both sides of whatever is centred.
  const loop = Array.from({ length: COPIES }, () => reviews).flat();

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
      onMouseEnter={() => setPointerHeld(true)}
      onMouseLeave={() => setPointerHeld(false)}
      onTouchStart={() => setPointerHeld(true)}
      onTouchEnd={() => setPointerHeld(false)}
      onTouchCancel={() => setPointerHeld(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
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
        className="no-scrollbar -mx-[var(--container-pad)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[calc((100%+2*var(--container-pad)-var(--rev-card))/2)] py-2 [--rev-card:min(86vw,20rem)] sm:gap-5 md:[--rev-card:20rem] lg:[--rev-card:21rem]"
      >
        {loop.map((review, index) => {
          const duplicate = index < firstExposed || index >= firstExposed + count;
          const isActive = index === active;
          return (
            <li
              key={`${review.id}-${index}`}
              // The outer copies exist only to make the wrap seamless; hide
              // them from assistive tech and keyboard focus so nothing reads
              // three times.
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
