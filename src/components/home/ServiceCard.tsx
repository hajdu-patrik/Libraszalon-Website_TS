import { GoldRule } from '@/components/ui/GoldRule';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import type { Service } from '@/content/services';

type ServiceCardProps = {
  service: Service;
  index: number;
};

/**
 * One service as a full-width editorial row: large photograph on one side,
 * a serial number, serif title and body on the other. Rows alternate sides,
 * which reads as a rhythm at full width (the old two-column grid could not
 * alternate without the middle photographs colliding).
 */
export function ServiceCard({ service, index }: ServiceCardProps) {
  const flipped = index % 2 === 1;

  return (
    // Two explicit tracks rather than a 12-column grid: at 200% text zoom the
    // eleven internal gaps of a 12-track grid alone exceed the container and
    // force horizontal overflow; one gap between two tracks cannot.
    <article className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <Reveal
        variant={flipped ? 'right' : 'left'}
        className={flipped ? 'lg:order-2' : undefined}
      >
        <div className="group overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
          {/* The transition lives here, on the image's resting state, not on
              the hover — that is what makes the return journey as smooth as
              the outward one. `hover:` only supplies the end transform.

              2% over the full 700ms on the gentle curve. It used to be 4% on
              --ease-smooth, which front-loads its travel: ~19px of scale
              landed in the first few frames and then crawled, which reads as
              a snap. Two percent is still ~10px, plainly visible, and now
              takes the whole 700ms to get there. */}
          <Picture
            slug={service.image}
            alt={service.alt}
            sizes="(max-width: 1024px) 100vw, 480px"
            className="aspect-[4/3] w-full object-cover transition-transform duration-(--dur-slow) ease-gentle group-hover:scale-[1.02]"
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
