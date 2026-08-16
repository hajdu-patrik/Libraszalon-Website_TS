import type { ReactNode } from 'react';
import { Picture } from '@/components/ui/Picture';
import type { ImageSlug } from '@/lib/images';

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Faint photograph behind the content. */
  background?: ImageSlug;
  /** Surface: white / warm cream / deep espresso. */
  tone?: 'surface' | 'cream' | 'dark';
  /** Vertical rhythm. */
  spacing?: 'normal' | 'tight' | 'loose';
};

const SPACING = {
  tight: 'py-12 sm:py-16',
  normal: 'py-16 sm:py-24 lg:py-28',
  loose: 'py-20 sm:py-28 lg:py-36',
} as const;

const TONE = {
  surface: 'bg-surface',
  cream: 'bg-cream',
  dark: 'bg-ink-deep text-cream-text',
} as const;

/**
 * Page section with the shared container width and optional decorative photo.
 * The photograph is drawn at low opacity so it reads as texture without
 * competing with the copy; the gradient fades it into the section's own tone
 * at both edges.
 */
export function Section({
  children,
  id,
  className = '',
  background,
  tone = 'surface',
  spacing = 'normal',
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative isolate ${TONE[tone]} ${SPACING[spacing]} ${className}`}
    >
      {background && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <Picture
            slug={background}
            alt=""
            sizes="100vw"
            className={`h-full w-full object-cover ${tone === 'dark' ? 'opacity-[0.09]' : 'opacity-[0.07]'}`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b via-transparent ${
              tone === 'dark'
                ? 'from-ink-deep to-ink-deep'
                : tone === 'cream'
                  ? 'from-cream to-cream'
                  : 'from-surface to-surface'
            }`}
          />
        </div>
      )}
      <div className="container-page">{children}</div>
    </section>
  );
}
