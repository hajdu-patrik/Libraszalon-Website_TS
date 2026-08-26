'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/**
 * Whether the page has scrolled further than `threshold` pixels.
 *
 * Two components ask this and nothing else about scrolling: the header, which
 * grows a hairline and a shadow past 24px, and the back-to-top button, which
 * appears past 600px. Both had the same listener, the same passive flag and the
 * same teardown written out in full.
 *
 * Passive, because neither caller can cancel a scroll and saying so lets the
 * browser keep the gesture off the main thread. The value is a boolean, so a
 * render only happens on the two frames where it actually flips, not on every
 * frame of every scroll.
 */
export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
