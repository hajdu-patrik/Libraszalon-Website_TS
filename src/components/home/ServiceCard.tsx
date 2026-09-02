import { GoldRule } from '@/components/ui/GoldRule';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import type { Service } from '@/content/services';

type ServiceCardProps = {
  service: Service;
  index: number;
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  const flipped = index % 2 === 1;

  return (

<article className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <Reveal
        variant={flipped ? 'right' : 'left'}
        className={flipped ? 'lg:order-2' : undefined}
      >
        {

}
        <div className="card-interactive overflow-hidden rounded-3xl">
          <Picture
            slug={service.image}
            alt={service.alt}
            sizes="(max-width: 1024px) 100vw, 480px"

className="aspect-[3/2] w-full object-cover lg:aspect-[4/3]"
          />
        </div>
      </Reveal>

      <Reveal variant={flipped ? 'left' : 'right'} index={1}>
        <p
          aria-hidden="true"
          className="font-heading text-5xl leading-none font-medium text-gold/45"
        >
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-4 max-w-xl text-[length:var(--text-h3)] text-ink">
          {service.title}
        </h3>
        <GoldRule className="mt-5" />
        <p className="prose-measure mt-6 text-muted">{service.body}</p>
      </Reveal>
    </article>
  );
}
