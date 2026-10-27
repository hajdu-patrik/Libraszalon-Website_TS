'use client';

import { useEffect, type ReactNode } from 'react';

/** Module scope survives client-side navigations but not a full load, so only in-app
 *  page changes get the entrance animation and the first paint never waits on one. */
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animate = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return <div className={animate ? 'animate-page' : undefined}>{children}</div>;
}
