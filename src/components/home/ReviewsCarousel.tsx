'use client';

import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ReviewCard } from '@/components/home/ReviewCard';
import { IconButton } from '@/components/ui/IconButton';
import type { Review } from '@/content/reviews';
import { usePrefersReducedMotion } from '@/lib/hooks/useReducedMotion';
import { ui } from '@/content/ui';

type ReviewsCarouselProps = {
  reviews: Review[];
};

type Announcement = { id: number; text: string };

const AUTO_ADVANCE_MS = 4000;

/** Three copies of the list: the middle one is real, the outer two let the track scroll
 *  past either end and are swapped back for the middle one once scrolling settles. */
const COPIES = 3;

/** Scroll-end fallback for browsers without the `scrollend` event. */
const SETTLE_MS = 200;
const MAX_SETTLE_WAITS = 5;

/** Below `lg` one card sits centred with its neighbours peeking in; from `lg` the track
 *  is exactly the container wide and holds three whole cards, so nothing is cut off. */
const TRACK_CLASS =
  'no-scrollbar -mx-(--container-pad) flex snap-x snap-mandatory gap-(--rev-gap) overflow-x-auto overscroll-x-contain px-[calc((100%+2*var(--container-pad)-var(--rev-card))/2)] py-2 [--rev-card:min(86vw,20rem)] [--rev-gap:1rem] sm:[--rev-gap:1.25rem] md:[--rev-card:20rem] lg:mx-0 lg:px-0';

const SLIDE_CLASS =
  'flex w-(--rev-card) shrink-0 snap-center data-active:*:border-gold data-active:*:shadow-lift lg:w-[calc((100%-2*var(--rev-gap))/3)]';

const CONTROL_CLASS =
  'border border-cream-text/25 bg-ink-deep text-cream-text transition-colors hover:border-gold hover:text-gold';

/** Focus that arrived by keyboard, as opposed to a mouse click that merely focused a button. */
function isKeyboardFocus(element: Element): boolean {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
}

/** Distance between the left edges of two neighbouring cards. */
function cardStep(track: HTMLElement): number {
  const [first, second] = track.children;
  if (!first || !second) return 0;
  return second.getBoundingClientRect().left - first.getBoundingClientRect().left;
}

export function ReviewsCarousel({ reviews }: Readonly<ReviewsCarouselProps>) {
  const count = reviews.length;

  const trackRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);
  const glidingRef = useRef(false);
  const targetRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  const [active, setActive] = useState(count);
  const [userPaused, setUserPaused] = useState(false);
  const [pointerOver, setPointerOver] = useState(false);
  const [touching, setTouching] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [restarts, setRestarts] = useState(0);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const autoAdvance = !reduced && !userPaused && !pointerOver && !touching && !focusInside;

  const goTo = useCallback((index: number, behavior: ScrollBehavior) => {
    const track = trackRef.current;
    const card = track?.children[index];
    if (!track || !card) return;

    const trackBox = track.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    const shift = cardBox.left + cardBox.width / 2 - (trackBox.left + trackBox.width / 2);
    const left = Math.min(track.scrollWidth - track.clientWidth, Math.max(0, track.scrollLeft + shift));

    indexRef.current = index;
    glidingRef.current = behavior === 'smooth';
    targetRef.current = left;
    track.scrollTo({ left, behavior });
  }, []);

  const advance = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;

      let from = indexRef.current;
      if (from < count || from >= count * 2) {
        // Quick presses can outrun the settle that swaps the copies back, and the first and
        // last cards cannot be centred. Swap now, by whole copies, so a glide in progress
        // keeps its place.
        const copies = from < count ? 1 : -1;
        track.scrollTo({ left: track.scrollLeft + copies * count * cardStep(track), behavior: 'instant' });
        from += copies * count;
      }
      goTo(from + direction, reduced ? 'instant' : 'smooth');
    },
    [count, goTo, reduced],
  );

  useLayoutEffect(() => {
    goTo(count, 'instant');
  }, [count, goTo]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    let settleTimer = 0;

    // Cards are equally wide and equally spaced, so the first one and the step fix every position.
    const measure = () => {
      const step = cardStep(track);
      if (step <= 0) return;

      const trackBox = track.getBoundingClientRect();
      const first = track.children[0].getBoundingClientRect();
      const offset = trackBox.left + trackBox.width / 2 - (first.left + first.width / 2);
      const nearest = Math.min(track.children.length - 1, Math.max(0, Math.round(offset / step)));

      setActive(nearest);
      if (!glidingRef.current) indexRef.current = nearest;
    };

    const settle = () => {
      glidingRef.current = false;
      measure();
      const index = indexRef.current;
      if (index < count) goTo(index + count, 'instant');
      else if (index >= count * 2) goTo(index - count, 'instant');
    };

    // Without `scrollend`, "no scroll event for a moment" stands in for it. A smooth scroll
    // can stall that long when a new one interrupts it, so keep waiting until it has arrived.
    let waits = 0;
    const settleOnceArrived = () => {
      const underway = glidingRef.current && Math.abs(track.scrollLeft - targetRef.current) > 2;
      if (underway && waits < MAX_SETTLE_WAITS) {
        waits += 1;
        settleTimer = window.setTimeout(settleOnceArrived, SETTLE_MS);
        return;
      }
      waits = 0;
      settle();
    };

    const canScrollEnd = 'onscrollend' in track;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
      if (!canScrollEnd) {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(settleOnceArrived, SETTLE_MS);
      }
    };

    const resizeObserver = new ResizeObserver(() => goTo(indexRef.current, 'instant'));

    track.addEventListener('scroll', onScroll, { passive: true });
    if (canScrollEnd) track.addEventListener('scrollend', settle);
    resizeObserver.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('scrollend', settle);
      resizeObserver.disconnect();
    };
  }, [count, goTo]);

  useEffect(() => {
    if (!autoAdvance) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      advance(1);
      setAnnouncement(null);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [advance, autoAdvance, restarts]);

  if (count === 0) return null;

  const goBy = (direction: 1 | -1) => {
    advance(direction);
    setRestarts((value) => value + 1);

    const position = ((indexRef.current % count) + count) % count;
    const text = `${position + 1} / ${count}: ${reviews[position].author}`;
    setAnnouncement((previous) => ({ id: (previous?.id ?? 0) + 1, text }));
  };

  const loop = Array.from({ length: COPIES }, () => reviews).flat();

  return (
    <div
      role="region"
      aria-label={ui.reviews.region}
      onPointerEnter={(event) => event.pointerType !== 'touch' && setPointerOver(true)}
      onPointerLeave={(event) => event.pointerType !== 'touch' && setPointerOver(false)}
      onTouchStart={() => setTouching(true)}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
      onFocus={(event) => setFocusInside(isKeyboardFocus(event.target))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
      }}
    >
      <ul ref={trackRef} role="list" tabIndex={-1} className={TRACK_CLASS}>
        {loop.map((review, index) => {
          const duplicate = index < count || index >= count * 2;
          return (
            <li
              key={`${review.id}-${index}`}
              aria-hidden={duplicate || undefined}
              inert={duplicate || undefined}
              data-active={index === active || undefined}
              className={SLIDE_CLASS}
            >
              <ReviewCard review={review} />
            </li>
          );
        })}
      </ul>

      <div className="mt-7 flex items-center justify-center gap-3">
        <IconButton onClick={() => goBy(-1)} aria-label={ui.reviews.previous} className={CONTROL_CLASS}>
          <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </IconButton>

        <IconButton
          onClick={() => setUserPaused((value) => !value)}
          aria-label={
            userPaused ? ui.reviews.play : ui.reviews.pause
          }
          className={`${CONTROL_CLASS} motion-reduce:hidden`}
        >
          {/* Never the pointer target: when the icon under a still pointer is swapped, Safari
              keeps tracking the removed node and the region's pointerleave never fires. */}
          {userPaused ? (
            <Play aria-hidden="true" className="pointer-events-none size-5" strokeWidth={1.8} />
          ) : (
            <Pause aria-hidden="true" className="pointer-events-none size-5" strokeWidth={1.8} />
          )}
        </IconButton>

        <IconButton onClick={() => goBy(1)} aria-label={ui.reviews.next} className={CONTROL_CLASS}>
          <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </IconButton>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement && <span key={announcement.id}>{announcement.text}</span>}
      </p>
    </div>
  );
}
