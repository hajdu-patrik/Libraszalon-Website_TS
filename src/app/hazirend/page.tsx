import type { Metadata } from 'next';
import { GoldRule } from '@/components/ui/GoldRule';
import { PageHeader } from '@/components/ui/PageHeader';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { houseRules } from '@/content/pages/house-rules';
import { pageSeo } from '@/content/seo';
import { breadcrumbJsonLd, houseRulesFaqJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.houseRules);

export default function HouseRulesPage() {
  return (
    <>
      <PageHeader
        eyebrow={houseRules.eyebrow}
        title={houseRules.title}
        background="bg-prices-alt"
      />

      <Section spacing="normal">
        <Reveal>
          <p className="prose-measure text-muted">{houseRules.intro}</p>
        </Reveal>

        {/* The scope statement gets callout treatment: it is the sentence the
            whole page hangs on. */}
        <Reveal index={1} className="mt-12">
          <div className="max-w-3xl rounded-r-2xl border-l-[3px] border-gold bg-cream p-6 sm:p-8">
            <p className="eyebrow">{houseRules.scope.heading}</p>
            <p className="mt-4 text-muted">{houseRules.scope.body}</p>
          </div>
        </Reveal>
      </Section>

      <Section tone="cream" spacing="normal">
        <Reveal>
          <h2 className="text-[length:var(--text-h2)] text-ink">
            {houseRules.rulesHeading}
          </h2>
          <GoldRule className="mt-6" />
        </Reveal>

        <ol className="mt-12 max-w-3xl space-y-5">
          {houseRules.rules.map((rule, index) => (
            <Reveal
              key={rule.question}
              as="li"
              className="flex gap-5 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-(--dur-base) ease-smooth hover:border-gold/50 hover:shadow-[var(--shadow-lift)] sm:gap-6 sm:p-7"
            >
              <span
                aria-hidden="true"
                className="font-heading text-4xl leading-none font-medium text-gold/60"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="font-heading text-[1.375rem] leading-tight text-ink">
                  {rule.question}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {rule.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* The 10-session pass referenced by the payment and expiry rules */}
      <Section spacing="normal">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {(
            [
              { slug: 'pass-front', caption: houseRules.passCaptions.front },
              { slug: 'pass-back', caption: houseRules.passCaptions.back },
            ] as const
          ).map((item, index) => (
            <Reveal key={item.slug} index={index} as="figure">
              <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
                <Picture
                  slug={item.slug}
                  alt={item.caption}
                  sizes="(max-width: 640px) 100vw, 560px"
                  className="w-full object-cover transition-transform duration-(--dur-slow) ease-smooth hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-4 text-sm text-muted">
                {item.caption}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(houseRulesFaqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: houseRules.title, path: pageSeo.houseRules.path },
            ]),
          ),
        }}
      />
    </>
  );
}
