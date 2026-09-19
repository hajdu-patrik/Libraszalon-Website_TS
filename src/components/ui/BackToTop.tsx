'use client';

import { ArrowUp } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { prefersReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useScrolledPast } from '@/lib/hooks/useScrolledPast';

export function BackToTop() {
  const visible = useScrolledPast(600);

  return (
    <IconButton
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        })
      }
      aria-label="Vissza az oldal tetejére"
      {...(!visible && { tabIndex: -1, 'aria-hidden': true })}
      className={`fixed right-4 bottom-4 z-30 bg-ink-deep/90 text-cream-text shadow-[var(--shadow-lift)] backdrop-blur transition-[background-color,color,translate,opacity] duration-(--dur-base) ease-smooth in-data-notice:hidden hover:bg-gold hover:text-ink-deep sm:right-6 sm:bottom-6 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp aria-hidden="true" className="size-5" strokeWidth={1.8} />
    </IconButton>
  );
}
