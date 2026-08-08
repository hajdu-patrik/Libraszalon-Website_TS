import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import type { Service } from '@/content/services';

type ServiceCardProps = {
  service: Service;
  index: number;
};

/**
 * One service.
 *
 * Image is always on the left, as on the original site. Alternating sides was
 * tried first, but in a two-column grid it pushes the two middle photographs
 * against each other and the row reads as one lopsided block.
 */
export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <Reveal
      as="article"
      index={index % 2}
      className="group grid overflow-hidden rounded border border-line bg-surface shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:grid-cols-[minmax(0,12rem)_1fr]"
    >
      <div className="overflow-hidden">
        <Picture
          slug={service.image}
          alt={service.alt}
          sizes="(max-width: 640px) 100vw, 12rem"
          className="h-48 w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 sm:h-full"
        />
      </div>

      <div className="flex flex-col justify-center gap-3 p-5 sm:p-6">
        <h3 className="text-[length:var(--text-h3)] text-ink">{service.title}</h3>
        <p className="text-[0.9375rem] leading-relaxed text-muted">{service.body}</p>
      </div>
    </Reveal>
  );
}
