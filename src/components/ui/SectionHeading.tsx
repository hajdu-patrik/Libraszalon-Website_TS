import type { ElementType } from 'react';
import { GoldRule } from '@/components/ui/GoldRule';
import { Reveal } from '@/components/ui/Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: ElementType;
  align?: 'left' | 'center';
  /** Colour scheme of the surface the heading sits on. */
  tone?: 'light' | 'dark';
  className?: string;
};

/** Eyebrow, serif heading and gold rule — the heading pattern used site-wide. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = 'h2',
  align = 'center',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';
  const dark = tone === 'dark';

  return (
    <Reveal className={`${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className={`${dark ? 'eyebrow-dark' : 'eyebrow'} mb-4`}>{eyebrow}</p>
      )}
      <Tag
        className={`text-[length:var(--text-h2)] ${dark ? 'text-cream-text' : 'text-ink'}`}
      >
        {title}
      </Tag>
      <GoldRule centered={centered} className="mt-6" />
      {lead && (
        <p
          className={`mt-6 max-w-2xl ${dark ? 'text-cream-muted' : 'text-muted'} ${
            centered ? 'mx-auto text-balance' : ''
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
