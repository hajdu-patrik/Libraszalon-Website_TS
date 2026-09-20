import type { Metadata } from 'next';
import { Bus, Mail, Phone, SquareParking } from 'lucide-react';
import Link from 'next/link';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { Button } from '@/components/ui/Button';
import { GoldRule } from '@/components/ui/GoldRule';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { contact } from '@/content/pages/contact';
import { pageSeo } from '@/content/seo';
import { site } from '@/content/site';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.contact);

/** The directions cards pick their mark by name so the copy stays icon-agnostic
 *  in src/content — the content layer never imports from lucide-react. */
const DIRECTION_ICONS = { parking: SquareParking, transit: Bus } as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow={contact.eyebrow}
        title={contact.title}
        background="service-aromatherapy"
      />

      {/* Prose left, contact card right — the same two-column rhythm the
          bemutatkozás and első masszázs pages open with. */}
      <Section spacing="normal">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16">
          <Reveal>
            <p className="eyebrow">{contact.booking.eyebrow}</p>
            <h2 className="mt-3 text-[length:var(--text-h2)] text-ink">
              {contact.booking.heading}
            </h2>
            <GoldRule className="mt-5" />

            <p className="prose-measure mt-7 text-muted">
              {contact.booking.lead}
              <Link
                href={contact.booking.rulesHref}
                className="font-semibold text-gold-ink underline decoration-gold/50 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/50"
              >
                {contact.booking.rulesLabel}
              </Link>
              {contact.booking.body}
            </p>

            <p className="prose-measure mt-5 text-muted">{contact.booking.callBody}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                href={`tel:${site.phoneHref}`}
                icon={<Phone className="size-[18px]" strokeWidth={1.8} />}
              >
                {contact.booking.callLabel}
              </Button>
              <Button
                href={`mailto:${site.email}`}
                variant="outline"
                icon={<Mail className="size-[18px]" strokeWidth={1.8} />}
              >
                {contact.booking.emailLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal variant="right" index={1} className="lg:sticky lg:top-28">
            <ContactDetails />
          </Reveal>
        </div>
      </Section>

      {/* Dark breather, mirroring the quote strip on bemutatkozás and the
          "Érzékeny bőrápolás" strip on az első masszázs. */}
      <Section tone="dark" spacing="tight">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[length:var(--text-h2)] text-cream-text">
            {contact.promise.heading}
          </h2>
          <GoldRule centered className="mt-6" />
          <p className="mt-7 text-cream-muted">{contact.promise.body}</p>
        </Reveal>
      </Section>

      <Section tone="cream" background="bg-prices-alt" spacing="normal">
        <SectionHeading
          eyebrow={contact.directions.eyebrow}
          title={contact.directions.heading}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-10">
          <Reveal variant="left" className="h-full">
            <MapEmbed />
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {contact.directions.items.map((item, index) => {
              const Icon = DIRECTION_ICONS[item.icon];
              return (
                <Reveal
                  key={item.title}
                  as="article"
                  variant="right"
                  index={index + 1}
                  className="card-interactive flex gap-5 rounded-2xl bg-surface p-6"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-ink"
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-[length:var(--text-rule-title)] leading-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[length:var(--text-rule-body)] leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Kapcsolat', path: pageSeo.contact.path },
        ])}
      />
    </>
  );
}
