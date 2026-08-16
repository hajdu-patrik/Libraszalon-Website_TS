import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { PageHeader } from '@/components/ui/PageHeader';
import { Picture } from '@/components/ui/Picture';
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
        <Reveal>
          <p className="prose-measure text-muted">
            {contact.intro.map((part, index) =>
              part.href ? (
                <Link
                  key={index}
                  href={part.href}
                  className="font-semibold text-ink underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold-ink"
                >
                  {part.text}
                </Link>
              ) : part.strong ? (
                <strong key={index} className="font-semibold text-ink">
                  {part.text}
                </strong>
              ) : (
                <span key={index}>{part.text}</span>
              ),
            )}
          </p>
        </Reveal>

        <Reveal index={1} className="mt-8">
          <p className="prose-measure text-muted">
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

      <Section tone="cream" spacing="normal">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
          <Reveal variant="left" className="h-full">
            <MapEmbed />
          </Reveal>

          <Reveal variant="right" index={1} className="h-full">
            <ContactDetails />
          </Reveal>
        </div>
      </Section>

      <Section spacing="tight">
        <Reveal variant="zoom" className="mx-auto max-w-lg">
          <Picture
            slug="business-card"
            alt={contact.businessCardAlt}
            sizes="(max-width: 640px) 100vw, 32rem"
            className="w-full rounded-2xl object-cover shadow-[var(--shadow-lift)]"
          />
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
