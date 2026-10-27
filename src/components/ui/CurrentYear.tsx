'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** The static build can outlive a New Year's Eve, so the visitor's clock has the final say. */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );

  return <>{year}</>;
}
