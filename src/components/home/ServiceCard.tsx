import { GoldRule } from '@/components/ui/GoldRule';
import { Numeral } from '@/components/ui/Numeral';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import type { Service } from '@/content/services';

type ServiceCardProps = {
  service: Service;
  index: number;
};

/** Image and copy alternate sides on desktop, so the list reads as a zig-zag. */
export function ServiceCard({ service, index }: ServiceCardProps) {
  const flipped = index % 2 === 1;

  return (
    <article className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <Reveal variant={flipped ? 'right' : 'left'} className={flipped ? 'lg:order-2' : undefined}>
        <div className="card-interactive overflow-hidden rounded-3xl">
          <Picture
            slug={service.image}
            alt={service.alt}
            sizes={`(min-width: 1024px) ${flipped ? 663 : 473}px, 100vw`}
            className="aspect-[3/2] w-full object-cover lg:aspect-[4/3]"
          />
        </div>
      </Reveal>

      <Reveal variant={flipped ? 'left' : 'right'} index={1}>
        <Numeral value={index + 1} className="text-5xl" />
        <h3 className="mt-4 max-w-xl text-h3">{service.title}</h3>
        <GoldRule className="mt-6" />
        <p className="prose-measure mt-6 text-subtle">{service.body}</p>
      </Reveal>
    </article>
  );
}
