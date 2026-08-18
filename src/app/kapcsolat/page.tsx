import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { GoldRule } from '@/components/ui/GoldRule';
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

      {/*
        1 — What to know before you call.

        A single centred column on white, set one step above body size. This is
        the page's actual message: everything below it is reference material a
        visitor looks up once they have decided. Capped at 48rem and centred so
        the measure stays readable — centred text past ~75 characters a line is
        where the eye starts losing the return sweep.
      */}
      <Section spacing="tight">
        <Reveal className="mx-auto max-w-3xl text-center">
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
        </Reveal>

        <Reveal index={1}>
          <GoldRule centered className="mt-10" />
        </Reveal>

        {/* Wayfinding, kept deliberately: the map pin lands on the building but
            the salon is on its top floor, reached from the car park, and the
            bus stop is the thing most visitors actually navigate to. */}
        <Reveal index={2} className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-[length:var(--text-lead)] leading-relaxed text-muted">
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

      {/*
        2 — Where it is and how to reach it.

        Two panels on the warm cream, which is what lets both of them be white:
        on the surface tone the details card would have no edge to show. Map
        left, details right. `items-stretch` is what makes the split work: the
        details card sets the row height from its content and the map, which
        has none of its own, matches it. Below md the same two children stack.
      */}
      <Section tone="cream" spacing="normal">
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:gap-8">
          <Reveal variant="left" className="h-full">
            <MapEmbed />
          </Reveal>

          <Reveal variant="right" index={1} className="h-full">
            <ContactDetails />
          </Reveal>
        </div>
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
