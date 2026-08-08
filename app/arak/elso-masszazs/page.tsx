import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { firstMassage } from '@/content/pages/first-massage';
import { pageSeo } from '@/content/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.firstMassage);

export default function FirstMassagePage() {
  return (
    <>
      <PageHeader
        eyebrow={firstMassage.eyebrow}
        title={firstMassage.title}
        background="bg-first-massage"
      />

      <Section spacing="normal">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-14">
          <Reveal>
            <h2 className="text-[length:var(--text-h2)] text-ink">
              {firstMassage.assessment.heading}
            </h2>
            <p className="prose-measure mt-5 text-muted">
              {firstMassage.assessment.body}
            </p>
          </Reveal>

          <Reveal variant="right" index={1} className="lg:sticky lg:top-28">
            <Picture
              slug="about-detail"
              alt="Masszázs közben a Libra Masszázs Szalonban"
              sizes="(max-width: 1024px) 100vw, 20rem"
              className="w-full rounded object-cover shadow-[var(--shadow-card)]"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="subtle" spacing="tight">
        <Reveal>
          <h2 className="text-[length:var(--text-h2)] text-ink">
            {firstMassage.sensitiveSkin.heading}
          </h2>
          <p className="prose-measure mt-5 text-muted">
            {firstMassage.sensitiveSkin.body}
          </p>
        </Reveal>
      </Section>

      <Section spacing="normal">
        <Reveal>
          <p className="eyebrow">{firstMassage.tips.subheading}</p>
          <h2 className="mt-2 text-[length:var(--text-h2)] text-ink">
            {firstMassage.tips.heading}
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {firstMassage.tips.items.map((tip, index) => (
            <Reveal
              key={tip.slice(0, 40)}
              as="li"
              index={index % 2}
              className="flex gap-4 rounded border border-line bg-surface p-5 shadow-[var(--shadow-card)]"
            >
              <span
                aria-hidden="true"
                className="font-heading text-[1.375rem] leading-none font-semibold text-gold"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[0.9375rem] leading-relaxed text-muted">{tip}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10">
          <Link
            href={pageSeo.houseRules.path}
            className="inline-flex min-h-11 items-center font-heading text-base font-semibold text-gold-ink underline decoration-gold/40 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            Házirend
          </Link>
        </Reveal>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: 'Árak', path: pageSeo.prices.path },
              { name: firstMassage.title, path: pageSeo.firstMassage.path },
            ]),
          ),
        }}
      />
    </>
  );
}
