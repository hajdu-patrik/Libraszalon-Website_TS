import type { Metadata } from 'next';
import { GoldRule } from '@/components/ui/GoldRule';
import { JsonLd } from '@/components/ui/JsonLd';
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
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16">
          <Reveal>
            <h2 className="text-[length:var(--text-h2)] text-ink">
              {firstMassage.assessment.heading}
            </h2>
            <GoldRule className="mt-5" />
            <p className="prose-measure mt-7 text-muted">
              {firstMassage.assessment.body}
            </p>
          </Reveal>

          {

}
          <Reveal
            variant="right"
            index={1}
            className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:mx-0 lg:max-w-none"
          >
            <Picture
              slug="about-detail"
              alt="Masszázs közben a Libra Masszázs Szalonban"
              sizes="(max-width: 1024px) min(100vw, 28rem), 26rem"
              className="card-interactive aspect-[3/4] w-full rounded-b-3xl rounded-t-[10rem] object-cover lg:aspect-[2/3] lg:rounded-t-[13rem]"
            />
          </Reveal>
        </div>
      </Section>

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
              key={tip}
              as="li"
              index={index % 2}
              className="card-interactive flex gap-5 rounded-2xl bg-surface p-6"
            >
              <span
                aria-hidden="true"
                className="font-heading text-4xl leading-none font-medium text-gold/60"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[length:var(--text-ui)] leading-relaxed text-muted">{tip}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Árak', path: pageSeo.prices.path },
          { name: firstMassage.title, path: pageSeo.firstMassage.path },
        ])}
      />
    </>
  );
}
