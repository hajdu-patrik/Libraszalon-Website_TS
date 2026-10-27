'use client';

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/hooks/useReducedMotion';

type RevealProps = {
  children: ReactNode;
  variant?: 'up' | 'left' | 'right';
  /** Position in a group; staggers the entrance (capped so long lists don't lag). */
  index?: number;
  as?: ElementType;
  className?: string;
};

const MAX_STAGGER_STEPS = 3;

let sharedObserver: IntersectionObserver | undefined;

function observer(): IntersectionObserver {
  sharedObserver ??= new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-revealed', '');
        self.unobserve(entry.target);
      }
    },
    { threshold: 0.01, rootMargin: '0px 0px -40px 0px' },
  );
  return sharedObserver;
}

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

    if (prefersReducedMotion()) {
      el.setAttribute('data-revealed', '');
      return;
    }

    const io = observer();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  const step = Math.min(index, MAX_STAGGER_STEPS);

  return (
    <Tag
      ref={ref}
      data-reveal={variant === 'up' ? '' : variant}
      style={step ? ({ '--reveal-index': step } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
