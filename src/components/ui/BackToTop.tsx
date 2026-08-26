'use client';

import { ArrowUp } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useScrolledPast } from '@/lib/hooks/useScrolledPast';

/**
 * Appears once the visitor is well past the fold — but not while the standing
 * notice is on screen. That card takes the same corner and paints over the top
 * of this button, so without the in-data-notice: variant below the two of them
 * ship a control that is visibly there and impossible to press. WelcomeModal
 * owns the flag on <html>.
 */
export function BackToTop() {
  const visible = useScrolledPast(600);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        })
      }
      aria-label="Vissza az oldal tetejére"
      {...(!visible && { tabIndex: -1, 'aria-hidden': true })}
      className={`fixed right-4 bottom-4 z-30 inline-flex size-12 items-center justify-center rounded-full bg-ink-deep/90 text-cream-text shadow-[var(--shadow-lift)] backdrop-blur transition-all duration-(--dur-base) ease-smooth in-data-notice:hidden hover:bg-gold hover:text-ink-deep sm:right-6 sm:bottom-6 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp aria-hidden="true" className="size-5" strokeWidth={1.8} />
    </button>
  );
}
