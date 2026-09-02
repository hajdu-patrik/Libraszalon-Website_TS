import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { GoldRule } from '@/components/ui/GoldRule';
import { GoldSignature } from '@/components/ui/GoldSignature';
import { JsonLd } from '@/components/ui/JsonLd';
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

      {

}
      <Section tone="cream" spacing="normal">
        <Reveal className="w-full">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-lift)] sm:p-10 lg:p-14">
            <GoldSignature className="absolute inset-x-0 top-0" />

            {

}
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[length:var(--text-lead)] leading-relaxed text-ink">
                {contact.booking.lead}
                <Link
                  href={contact.booking.rulesHref}
                  className="font-semibold text-gold-ink underline decoration-gold/50 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/50"
                >
                  {contact.booking.rulesLabel}
                </Link>
                {contact.booking.body}
              </p>

              <GoldRule centered className="mt-8" />

              {

}
              <p className="mt-8 text-[length:var(--text-lead)] leading-relaxed text-muted">
                <strong className="font-semibold text-ink">
                  {contact.directions.parking}
                </strong>
                {contact.directions.parkingBody}
                <span className="font-semibold text-ink">
                  {contact.directions.transitLabel}
                </span>
                {contact.directions.transitBody}
              </p>
            </div>

            {

}
            <div className="mt-10 grid gap-6 border-t border-line pt-10 sm:mt-12 sm:pt-12 md:grid-cols-2 md:gap-8">
              <MapEmbed />
              <ContactDetails />
            </div>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Kapcsolat', path: pageSeo.contact.path },
        ])}
      />
    </>
  );
}
