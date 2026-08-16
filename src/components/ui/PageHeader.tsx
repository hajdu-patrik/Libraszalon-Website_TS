import { GoldRule } from '@/components/ui/GoldRule';
import { Picture } from '@/components/ui/Picture';
import type { ImageSlug } from '@/lib/images';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  background?: ImageSlug;
};

/**
 * The banner every inner page opens with: a full-bleed photograph under a
 * dark scrim, with the page title set bottom-left in the serif display face.
 * The h1 lives here, so each page has exactly one and it always carries the
 * page's own name.
 *
 * Animated with plain CSS rather than a Reveal wrapper because this is above
 * the fold — it should start the moment the HTML paints, not after hydration.
 */
export function PageHeader({ eyebrow, title, background }: PageHeaderProps) {
  return (
    <header className="relative isolate flex min-h-[16rem] items-end overflow-hidden bg-ink-deep sm:min-h-[22rem] lg:min-h-[26rem]">
      {background && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Picture
            slug={background}
            alt=""
            priority
            sizes="100vw"
            className="h-full w-full object-cover opacity-70"
          />
          {/* Double scrim: a flat darkening for the whole frame plus a heavier
              foot so the title always sits on a stable, readable ground. */}
          <div className="absolute inset-0 bg-ink-deep/40" />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink-deep via-ink-deep/55 to-transparent" />
        </div>
      )}

      <div className="container-page pt-24 pb-10 sm:pt-32 sm:pb-14">
        <div style={{ animation: 'fade-in 0.5s var(--ease-out-expo) both' }}>
          {eyebrow && <p className="eyebrow-dark mb-4">{eyebrow}</p>}
          <h1 className="max-w-3xl text-[length:var(--text-h1)] text-cream-text hyphens-none">
            {title}
          </h1>
          <GoldRule className="mt-6" />
        </div>
      </div>
    </header>
  );
}
