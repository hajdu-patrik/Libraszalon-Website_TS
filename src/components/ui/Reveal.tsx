'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/hooks/useReducedMotion';

type RevealProps = {
  children: ReactNode;

  variant?: 'up' | 'fade' | 'left' | 'right' | 'zoom';

  index?: number;
  as?: ElementType;
  className?: string;
};

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

const step = Math.min(index, 3);

  return (
    <Tag
      ref={ref}
      data-reveal={variant === 'up' ? '' : variant}
      style={step ? ({ '--reveal-index': step } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
