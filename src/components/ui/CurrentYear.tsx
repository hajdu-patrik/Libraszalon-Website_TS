'use client';

import { useSyncExternalStore } from 'react';

/** The year never changes under the visitor's feet, so there is nothing to
 *  subscribe to — the snapshot functions carry all the behaviour. */
const noop = () => () => {};

/**
 * The copyright year, always current.
 *
 * This is a static export, so a plain new Date() in the footer would freeze the
 * year at build time and only move on the next deploy. useSyncExternalStore
 * renders the build-time year on the server and through hydration (so no-JS
 * visitors and crawlers see a sensible value), then switches to the visitor's
 * actual current year on the client — which is what rolls it over on New Year's
 * Day without a rebuild, with no hydration mismatch.
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => fallback,
  );

  return <>{year}</>;
}
