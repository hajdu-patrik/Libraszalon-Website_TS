import type { ReactNode } from 'react';
import { Picture } from '@/components/ui/Picture';
import type { ImageSlug } from '@/lib/images';

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Faint photograph behind the content. */
  background?: ImageSlug;
  /** Tints the section with the off-white used across the original site. */
  tone?: 'surface' | 'subtle';
  /** Vertical rhythm. */
  spacing?: 'normal' | 'tight' | 'loose';
};

const SPACING = {
  tight: 'py-10 sm:py-14',
  normal: 'py-14 sm:py-20 lg:py-24',
  loose: 'py-20 sm:py-28 lg:py-32',
} as const;

/**
 * Page section with the shared container width and optional decorative photo.
 *
 * The original site laid a 95%-opaque white panel over full-bleed photographs,
 * which washed them out to almost nothing and left the pages looking empty.
 * Here the photograph is simply drawn at low opacity, so it reads as texture
 * without competing with the copy.
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
      className={`relative isolate ${tone === 'subtle' ? 'bg-subtle' : 'bg-surface'} ${SPACING[spacing]} ${className}`}
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
            className="h-full w-full object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface" />
        </div>
      )}
      <div className="container-page">{children}</div>
    </section>
  );
}
