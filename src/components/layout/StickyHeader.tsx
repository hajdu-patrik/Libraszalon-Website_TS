'use client';

import type { ReactNode } from 'react';
import { useScrolledPast } from '@/lib/hooks/useScrolledPast';

/** The only client part of the header: flags `data-scrolled` so the server-rendered bar
 *  inside can compact itself with `in-data-scrolled:` utilities. From md up the contact
 *  strip (h-11) scrolls away and the bar below it stays pinned, hence the negative top. */
export function StickyHeader({ children }: { children: ReactNode }) {
  const scrolled = useScrolledPast(24);

  return (
    <header data-scrolled={scrolled || undefined} className="sticky top-0 z-40 md:-top-11">
      {children}
    </header>
  );
}
