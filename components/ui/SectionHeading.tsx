import type { ElementType } from 'react';
import { GoldRule } from '@/components/ui/GoldRule';
import { Reveal } from '@/components/ui/Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: ElementType;
  align?: 'left' | 'center';
  className?: string;
};

/** Eyebrow, heading and gold rule — the heading pattern used site-wide. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = 'h2',
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Reveal className={`${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag className="text-[length:var(--text-h2)] text-ink">{title}</Tag>
      <GoldRule centered={centered} className="mt-5" />
      {lead && (
        <p
          className={`mt-6 text-muted ${centered ? 'mx-auto text-balance' : ''} max-w-2xl`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
