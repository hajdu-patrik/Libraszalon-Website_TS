'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => fallback,
  );

  return <>{year}</>;
}
