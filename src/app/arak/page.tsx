import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PriceCard } from '@/components/prices/PriceCard';
import { PageHeader } from '@/components/ui/PageHeader';
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
