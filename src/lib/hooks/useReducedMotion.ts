'use client';

import { useSyncExternalStore } from 'react';

/**
 * The OS "reduce motion" setting, in the two shapes the site needs it.
 *
 * It was written out by hand in four places before this — as state plus an
 * effect in the reviews carousel, as a bare matchMedia call in the scroll
 * reveal and again in the back-to-top button, each with its own copy of the
 * query string. A typo in one of them would have been a silently ignored
 * accessibility preference, which is the kind of bug nothing ever reports.
 */

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * One-shot read, for code that only needs the answer at the moment it acts —
 * wiring up an observer, or deciding how a single scroll should behave. Callers
 * must already be on the client; every one of them is inside an effect or an
 * event handler.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * The live value, for components that have to keep answering it — anything
 * still moving after the first paint.
 *
 * useSyncExternalStore rather than state seeded in an effect: the media query
 * is an external store, and this is the API React provides for reading one
 * without a render pass holding the wrong answer first. The server snapshot is
 * false so the markup is identical for every visitor and stays cacheable; the
 * real value arrives on the client before anything has had time to move.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
