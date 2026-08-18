import type { Metadata } from 'next';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { contact } from '@/content/pages/contact';
import { pageSeo } from '@/content/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.contact);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow={contact.eyebrow}
        title={contact.title}
        background="service-aromatherapy"
      />

      <Section spacing="normal">
        {/* Two panels, nothing else. `items-stretch` is what makes the split
            work: the details card sets the row height from its content and the
            map, which has none of its own, matches it. Below md the same two
            children stack — details first, because a visitor who came here for
            a phone number should not have to scroll past a map to find it. */}
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:gap-8">
          <Reveal variant="left" className="h-full">
            <ContactDetails />
          </Reveal>

          <Reveal variant="right" index={1} className="h-full">
            <MapEmbed />
          </Reveal>
        </div>

        {/* Wayfinding, kept deliberately: the map pin lands on the building but
            the salon is on its top floor, reached from the car park, and the
            bus stop is the thing most visitors actually navigate to. Set as one
            quiet run of text under the split rather than as a third panel. */}
        <Reveal index={2} className="mt-10 sm:mt-12">
          <p className="prose-measure text-[0.9375rem] leading-relaxed text-muted">
            <strong className="font-semibold text-ink">
              {contact.directions.parking}
            </strong>
            {contact.directions.parkingBody}
            <span className="font-semibold text-ink">
              {contact.directions.transitLabel}
            </span>
            {contact.directions.transitBody}
          </p>
        </Reveal>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: 'Kapcsolat', path: pageSeo.contact.path },
            ]),
          ),
        }}
      />
    </>
  );
}
