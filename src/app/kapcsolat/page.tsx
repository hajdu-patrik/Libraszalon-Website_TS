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
        The whole page is one card.

        There are four facts, two paragraphs and a map here — not enough to
        justify three separate framed widgets floating in a 1200px column, which
        is what it was. Held in a single panel they read as one thing: what to
        know, then where it is and how to reach me.

        56.25rem = 900px at the default root size, but written in rem on
        purpose. At 200% text zoom a px cap would hold the card at 900px while
        the copy inside it doubled; in rem the frame grows with its contents and
        the measure stays where it was designed.

        The padding is the other half of the effect. It is deliberately larger
        than the site's usual card inset and scales with the viewport — with
        this little content, the space around it is what reads as considered
        rather than sparse.
      */}
      <Section tone="cream" spacing="normal">
        <Reveal className="mx-auto w-full max-w-[56.25rem]">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-lift)] sm:p-10 lg:p-14">
            {/* Gold signature line across the top of the card. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent"
            />

            {/* What to know before booking. Capped tighter than the card so a
                centred line never runs past the length the eye can sweep back
                from, however wide the panel gets. */}
            <div className="mx-auto max-w-[42rem] text-center">
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

              {/* Wayfinding, kept deliberately: the map pin lands on the
                  building but the salon is on its top floor, reached from the
                  car park, and the bus stop is the thing most visitors actually
                  navigate to. */}
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

            {/* Map and details, level with each other on the default stretch:
                the details column sets the row height and the map, which has no
                height of its own, matches it. Below md the same two children
                stack. The hairline is what keeps the panel one object rather
                than a paragraph sitting on top of two columns. */}
            <div className="mt-10 grid gap-6 border-t border-line pt-10 sm:mt-12 sm:pt-12 md:grid-cols-2 md:gap-8">
              <MapEmbed />
              <ContactDetails />
            </div>
          </div>
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
