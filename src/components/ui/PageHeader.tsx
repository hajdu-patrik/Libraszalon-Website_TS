import { GoldRule } from '@/components/ui/GoldRule';
import { Picture } from '@/components/ui/Picture';
import type { ImageSlug } from '@/lib/images';

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  background: ImageSlug;
};

export function PageHeader({ title, eyebrow, background }: PageHeaderProps) {
  return (
    <header className="tone-dark relative isolate flex min-h-64 items-end overflow-hidden sm:min-h-88 lg:min-h-104">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Picture
          slug={background}
          alt=""
          priority
          sizes="100vw"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-ink-deep/40" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink-deep via-ink-deep/55 to-transparent" />
      </div>

      <div className="container-page pt-24 pb-10 sm:pt-32 sm:pb-14">
        <div className="animate-enter">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="max-w-3xl text-h1 hyphens-none">{title}</h1>
          <GoldRule className="mt-6" />
        </div>
      </div>
    </header>
  );
}
