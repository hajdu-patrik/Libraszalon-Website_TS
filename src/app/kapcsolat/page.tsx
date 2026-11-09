import type { Metadata } from 'next';
import { Bus, SquareParking } from 'lucide-react';
import Link from 'next/link';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { BookingActions } from '@/components/ui/BookingActions';
import { IconChip, InfoCard } from '@/components/ui/InfoCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { contact } from '@/content/pages/contact';
import { pageSeo } from '@/content/seo';
import { booking } from '@/content/ui';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.contact);

/** The content layer names the icon; only the page knows about lucide-react. */
const DIRECTION_ICONS = { parking: SquareParking, transit: Bus } as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow={contact.eyebrow} title={contact.title} background="service-aromatherapy" />

      <Section>
        <div className="split-gap grid items-start lg:grid-cols-[1fr_minmax(0,26rem)]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow={contact.booking.eyebrow}
              title={contact.booking.heading}
            />

            <p className="prose-measure mt-6 text-subtle">
              {contact.booking.lead}
              <Link
                href={pageSeo.houseRules.path}
                className="link-inline"
              >
                {contact.booking.rulesLabel}
              </Link>
              {contact.booking.body}
            </p>
            <p className="prose-measure mt-5 text-subtle">{booking.callBody}</p>

            <BookingActions className="mt-9" />
          </Reveal>

          <Reveal variant="right" index={1} className="lg:sticky lg:top-28">
            <ContactDetails />
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" spacing="tight">
        <Reveal>
          <SectionHeading title={contact.promise.heading} lead={contact.promise.body} />
        </Reveal>
      </Section>

      <Section tone="cream" background="bg-prices-alt">
        <Reveal>
          <SectionHeading eyebrow={contact.directions.eyebrow} title={contact.directions.heading} />
        </Reveal>

        <div className="section-body grid gap-grid lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left" className="h-full">
            <MapEmbed />
          </Reveal>

          <div className="grid gap-grid sm:grid-cols-2 lg:grid-cols-1">
            {contact.directions.items.map((item, index) => {
              const Icon = DIRECTION_ICONS[item.icon];
              return (
                <InfoCard
                  key={item.title}
                  as="article"
                  variant="right"
                  index={index + 1}
                  marker={
                    <IconChip>
                      <Icon className="size-5" strokeWidth={1.8} />
                    </IconChip>
                  }
                  title={item.title}
                  body={item.body}
                />
              );
            })}
          </div>
        </div>
      </Section>

      <JsonLd data={webPageJsonLd('contact', 'ContactPage')} />

      <JsonLd data={breadcrumbJsonLd('contact')} />
    </>
  );
}
