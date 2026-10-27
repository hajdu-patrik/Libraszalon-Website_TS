import type { ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';

type InfoCardProps = {
  /** A <Numeral /> or an icon chip, shown beside the text (above it on narrow phones). */
  marker: ReactNode;
  title?: string;
  body: string;
  as?: 'li' | 'article';
  index?: number;
  variant?: 'up' | 'left' | 'right';
};

export function InfoCard({ marker, title, body, as = 'li', index, variant }: InfoCardProps) {
  return (
    <Reveal
      as={as}
      index={index}
      variant={variant}
      className="card card-interactive grid content-start gap-x-5 gap-y-3 min-[30rem]:grid-cols-[auto_minmax(0,1fr)]"
    >
      {marker}
      <div className="min-w-0">
        {title && <h3 className="text-h4 leading-tight">{title}</h3>}
        <p className={`${title ? 'mt-3' : ''} text-ui leading-relaxed text-subtle`}>{body}</p>
      </div>
    </Reveal>
  );
}

export function IconChip({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-ink"
    >
      {children}
    </span>
  );
}
