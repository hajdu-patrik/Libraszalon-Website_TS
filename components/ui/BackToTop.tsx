'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@/components/ui/Icons';

/** Appears once the visitor is well past the fold. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
      aria-label="Vissza az oldal tetejére"
      {...(!visible && { tabIndex: -1, 'aria-hidden': true })}
      className={`fixed right-4 bottom-4 z-30 inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease-out-expo)] hover:border-gold hover:text-gold-ink sm:right-6 sm:bottom-6 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUpIcon className="size-5" />
    </button>
  );
}
