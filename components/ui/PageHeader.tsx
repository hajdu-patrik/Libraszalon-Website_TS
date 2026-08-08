import { GoldRule } from '@/components/ui/GoldRule';
import { Picture } from '@/components/ui/Picture';
import type { ImageSlug } from '@/lib/images';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  background?: ImageSlug;
};

/**
 * The banner every inner page opens with. The h1 lives here, so each page has
 * exactly one and it always carries the page's own name.
 */
export function PageHeader({ eyebrow, title, background }: PageHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden bg-subtle pt-16 pb-12 sm:pt-24 sm:pb-16">
      {background && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Picture
            slug={background}
            alt=""
            sizes="100vw"
            className="h-full w-full object-cover opacity-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-transparent to-surface" />
        </div>
      )}

      <div className="container-page">
        <div
          className="text-center"
          style={{ animation: 'fade-in 0.7s var(--ease-out-expo) both' }}
        >
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-[length:var(--text-h1)] text-ink">{title}</h1>
          <GoldRule centered className="mt-6" />
        </div>
      </div>
    </header>
  );
}
