import type { ReactNode } from 'react';
import { Picture } from '@/components/ui/Picture';
import type { ImageSlug } from '@/lib/images';

const TONES = {
  surface: { section: 'bg-surface', fade: 'from-surface to-surface' },
  cream: { section: 'bg-cream', fade: 'from-cream to-cream' },
  dark: { section: 'tone-dark', fade: 'from-ink-deep to-ink-deep' },
} as const;

const SPACING = {
  normal: 'py-16 sm:py-24 lg:py-28',
  tight: 'py-12 sm:py-16',
} as const;

type SectionProps = {
  children: ReactNode;
  tone?: keyof typeof TONES;
  spacing?: keyof typeof SPACING;
  /** A photo washed almost to the section colour, purely as texture. */
  background?: ImageSlug;
  className?: string;
};

export function Section({
  children,
  tone = 'surface',
  spacing = 'normal',
  background,
  className = '',
}: SectionProps) {
  const { section, fade } = TONES[tone];

  return (
    <section className={`relative isolate ${section} ${SPACING[spacing]} ${className}`}>
      {background && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <Picture
            slug={background}
            alt=""
            sizes="100vw"
            className="h-full w-full object-cover opacity-[0.07]"
          />
          <div className={`absolute inset-0 bg-gradient-to-b via-transparent ${fade}`} />
        </div>
      )}
      <div className="container-page">{children}</div>
    </section>
  );
}
