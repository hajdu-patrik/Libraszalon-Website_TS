'use client';

import { useSyncExternalStore } from 'react';

/** Nothing to subscribe to: the answer changes once, when React hydrates. */
const subscribe = () => () => {};

/**
 * False on the server and through the first client render, true afterwards.
 *
 * For the one thing that genuinely cannot exist until then — a portal, which
 * needs document.body. The obvious spelling is useState(false) plus an effect
 * that sets it to true, and that is a cascading render React now warns about:
 * the component renders, the effect fires, it renders again.
 *
 * useSyncExternalStore gets there in one pass. It is the same shape
 * CurrentYear already uses to tell the build-time year from the visitor's.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
