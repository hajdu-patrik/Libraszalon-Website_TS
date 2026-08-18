'use client';

import { useEffect } from 'react';

/**
 * Brings each page in on navigation. A template (rather than the layout)
 * remounts per route, which is what restarts the animation.
 *
 * Deliberately the same rise-and-fade the scroll reveal uses, so arriving at a
 * page and scrolling down it feel like one motion language instead of two. It
 * runs at --dur-base rather than --dur-enter: a whole page is a far larger
 * surface than a single card, and the longer curve that reads as soft on one
 * element reads as a delay when everything is waiting on it.
 *
 * The first load of a visit is the exception and gets no animation at all.
 * That load already has an opener — the intro curtain — and stacking a second
 * entrance underneath it means the visitor watches the curtain lift only to
 * find the page still assembling itself. Nowhere is that worse than the home
 * hero, whose whole job is to be readable the instant the curtain clears.
 */

/**
 * Module scope, not a ref: the template remounts on every navigation, so a
 * per-instance flag would report "first load" every single time.
 */
let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  // Read during render so the very first client render matches the server's
  // (both animation-less) and hydration stays clean.
  const animate = navigated;

  useEffect(() => {
    navigated = true;
  }, []);

  return (
    <div
      style={
        animate
          ? { animation: 'enter-rise var(--dur-base) var(--ease-smooth) both' }
          : undefined
      }
    >
      {children}
    </div>
  );
}
