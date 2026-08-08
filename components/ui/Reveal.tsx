'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Direction the element travels in from. */
  variant?: 'up' | 'fade' | 'left' | 'right' | 'zoom';
  /** Position within a staggered group; each step adds 80ms. */
  index?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Reveals its children once they scroll into view.
 *
 * The visual states live in globals.css under [data-reveal] so the initial
 * hidden state is applied by CSS on first paint rather than after hydration —
 * without that, every element would flash visible then jump.
 *
 * Deliberately not a motion library: this is roughly a kilobyte and does the
 * only thing the site needs.
 */
export function Reveal({
  children,
  variant = 'up',
  index = 0,
  as: Tag = 'div',
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect the OS setting: show everything immediately, observe nothing.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.setAttribute('data-revealed', '');
      return;
    }

    // The bottom margin is a small fixed inset, not a percentage, and the
    // threshold is a sliver rather than 15%.
    //
    // With `-10%` and `threshold: 0.15`, an element sitting in the last tenth
    // of the page could never satisfy both once scrolling had bottomed out —
    // it stayed at opacity 0 forever. Content that cannot be revealed is worse
    // than content that reveals slightly early.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant === 'up' ? '' : variant}
      style={index ? ({ '--reveal-index': index } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
