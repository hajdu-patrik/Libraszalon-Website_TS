import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PriceCard } from '@/components/prices/PriceCard';
import { GoldRule } from '@/components/ui/GoldRule';
import { PageHeader } from '@/components/ui/PageHeader';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { prices } from '@/content/prices';
import { pricesPage } from '@/content/pages/prices';
import { pageSeo } from '@/content/seo';
import { breadcrumbJsonLd, serviceCatalogJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.prices);

export default function PricesPage() {
  // The first session opens the list and the visitor journey, so it leads the
  // page as a featured card; everything else sits in the grid below it.
  const [firstSession, ...rest] = prices;

  return (
    <>
      <PageHeader
        eyebrow={pricesPage.eyebrow}
        title={pricesPage.title}
        background="bg-prices"
      />

      <Section tone="cream" spacing="normal">
        <SectionHeading title={pricesPage.heading} lead={pricesPage.lead} />

        <div className="mt-14">
          <PriceCard item={firstSession} index={0} featured />

          <Reveal className="mt-5 text-center sm:text-right">
            <Link
              href={pageSeo.firstMassage.path}
              className="group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-gold-ink transition-colors hover:text-ink"
            >
              {pricesPage.firstMassageLinkLabel}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-(--dur-quick) ease-smooth group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, index) => (
              <PriceCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>

        {/*
          The pass and the névjegy, at the foot of the list.

          Fenced off with a hairline and a wide inset rather than its own
          section: neither is a price, but they are the last thing the price
          list has to say, and a full section break here would read as a new
          topic.

          Three equal tracks from md, stacked and centred below it. A grid
          rather than the flex row this was: three items on one flex line
          divide the leftover space, not the space itself, so a card with a
          slightly different aspect ratio would take a slightly wider slot and
          the three frames would not line up. Equal tracks make them
          identical, which is what a row of printed cards has to look like.

          The 24rem cap is gone with the third image — it existed so a pair
          would not stretch across a 1200px row, and three across fill that row
          honestly. It survives only in the stacked state, where a single frame
          at the full container width would be a card printed the size of a
          poster.

          The images themselves need no sizing rules: `img { max-width: 100%;
          height: auto }` in the base layer already holds them inside their
          frame at every width, down to 320px.
        */}
        <Reveal className="mt-16 border-t border-line pt-14 sm:mt-20 sm:pt-16">
          <h2 className="text-center text-[length:var(--text-h3)] text-ink">
            {pricesPage.pass.heading}
          </h2>
          <GoldRule centered className="mt-5" />

          <div className="mt-10 grid justify-items-center gap-5 md:grid-cols-3 md:gap-6">
            {(
              [
                {
                  slug: 'pass-front',
                  caption: pricesPage.pass.captions.front,
                  label: pricesPage.pass.labels.front,
                },
                {
                  slug: 'pass-back',
                  caption: pricesPage.pass.captions.back,
                  label: pricesPage.pass.labels.back,
                },
                {
                  slug: 'business-card',
                  caption: pricesPage.pass.captions.card,
                  label: pricesPage.pass.labels.card,
                },
              ] as const
            ).map((item) => (
              <figure key={item.slug} className="w-full max-w-sm md:max-w-none">
                <div className="card-interactive overflow-hidden rounded-2xl">
                  <Picture
                    slug={item.slug}
                    alt={item.caption}
                    sizes="(max-width: 767px) min(100vw, 24rem), min(30vw, 24rem)"
                    className="w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-center text-sm text-muted">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceCatalogJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: pricesPage.title, path: pageSeo.prices.path },
            ]),
          ),
        }}
      />
    </>
  );
}
