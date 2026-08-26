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
        {/* The photograph answers the pointer with the site's one card
            gesture — card-interactive, the same utility the rule cards, the
            price cards and the review cards use: the hairline warms to gold
            and the resting shadow opens into the lifted one.

            Nothing moves, and that is the point. What came off these images
            was a zoom, and a photograph that travels under the cursor is
            motion you notice rather than feel. A frame that warms is not
            that; it is the same acknowledgement every other framed thing on
            the site already gives.

            card-interactive brings its own resting shadow, so the explicit
            shadow-card that used to be here would only be saying it twice.
            overflow-hidden stays — it is what clips the image to the rounded
            frame and has nothing to do with the hover. */}
        <div className="card-interactive overflow-hidden rounded-3xl">
          <Picture
            slug={service.image}
            alt={service.alt}
            sizes="(max-width: 1024px) 100vw, 480px"
            // 3:2 on a phone, 4:3 where the row splits into two columns.
            //
            // Full-bleed at 4:3 the photograph was 268px of a 357px-wide
            // column, and it was arriving above a 22px title and 16px body:
            // the picture was not just larger than the words, it was larger
            // than all of them together. Losing 30px of height is enough to
            // put the title back in the frame on the same screenful, and 3:2
            // is a crop these photographs already survive — the subject is
            // centred in every one of them.
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
