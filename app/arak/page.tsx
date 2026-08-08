import type { Metadata } from 'next';
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
  return (
    <>
      <PageHeader
        eyebrow={pricesPage.eyebrow}
        title={pricesPage.title}
        background="bg-prices"
      />

      <Section spacing="normal">
        <SectionHeading title={pricesPage.heading} lead={pricesPage.lead} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prices.map((item, index) => (
            <PriceCard key={item.title} item={item} index={index} />
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            href={pageSeo.firstMassage.path}
            className="inline-flex min-h-11 items-center font-heading text-base font-semibold text-gold-ink underline decoration-gold/40 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            {pricesPage.firstMassageLinkLabel}
          </Link>
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
