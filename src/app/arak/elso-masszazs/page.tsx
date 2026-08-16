import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GoldRule } from '@/components/ui/GoldRule';
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
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
          <Reveal>
            <h2 className="text-[length:var(--text-h2)] text-ink">
              {firstMassage.assessment.heading}
            </h2>
            <GoldRule className="mt-5" />
            <p className="prose-measure mt-7 text-muted">
              {firstMassage.assessment.body}
            </p>
          </Reveal>

          <Reveal variant="right" index={1} className="lg:sticky lg:top-28">
            <Picture
              slug="about-detail"
              alt="Masszázs közben a Libra Masszázs Szalonban"
              sizes="(max-width: 1024px) 100vw, 22rem"
              className="aspect-[3/4] w-full rounded-b-3xl rounded-t-[10rem] object-cover shadow-[var(--shadow-lift)]"
            />
          </Reveal>
        </div>
      </Section>

      {/* Sensitive skin note on the dark band */}
      <Section tone="dark" spacing="tight">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[length:var(--text-h2)] text-cream-text">
            {firstMassage.sensitiveSkin.heading}
          </h2>
          <GoldRule centered className="mt-6" />
          <p className="mt-7 text-cream-muted">{firstMassage.sensitiveSkin.body}</p>
        </Reveal>
      </Section>

      <Section tone="cream" spacing="normal">
        <Reveal>
          <p className="eyebrow">{firstMassage.tips.subheading}</p>
          <h2 className="mt-3 text-[length:var(--text-h2)] text-ink">
            {firstMassage.tips.heading}
          </h2>
          <GoldRule className="mt-6" />
        </Reveal>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2">
          {firstMassage.tips.items.map((tip, index) => (
            <Reveal
              key={tip.slice(0, 40)}
              as="li"
              index={index % 2}
              className="flex gap-5 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]"
            >
              <span
                aria-hidden="true"
                className="font-heading text-4xl leading-none font-medium text-gold/60"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[0.9375rem] leading-relaxed text-muted">{tip}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12">
          <Button
            href={pageSeo.houseRules.path}
            variant="dark"
            icon={<ArrowRight className="size-[18px]" strokeWidth={1.8} />}
          >
            Házirend
          </Button>
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
