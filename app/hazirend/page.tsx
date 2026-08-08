import type { Metadata } from 'next';
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

        <Reveal index={1} className="mt-12">
          <p className="eyebrow">{houseRules.scope.heading}</p>
          <p className="prose-measure mt-4 text-muted">{houseRules.scope.body}</p>
        </Reveal>
      </Section>

      <Section tone="subtle" spacing="normal">
        <Reveal>
          <h2 className="text-[length:var(--text-h2)] text-ink">
            {houseRules.rulesHeading}
          </h2>
        </Reveal>

        <ol className="mt-10 space-y-4">
          {houseRules.rules.map((rule, index) => (
            <Reveal
              key={rule.question}
              as="li"
              className="flex gap-4 rounded border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:gap-5 sm:p-6"
            >
              <span
                aria-hidden="true"
                className="font-heading text-[1.375rem] leading-none font-semibold text-gold"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="font-heading text-base font-semibold text-ink">
                  {rule.question}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  {rule.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* The 10-session pass referenced by the payment and expiry rules */}
      <Section spacing="normal">
        <div className="grid gap-6 sm:grid-cols-2">
          {(
            [
              { slug: 'pass-front', caption: houseRules.passCaptions.front },
              { slug: 'pass-back', caption: houseRules.passCaptions.back },
            ] as const
          ).map((item, index) => (
            <Reveal key={item.slug} index={index} as="figure">
              <Picture
                slug={item.slug}
                alt={item.caption}
                sizes="(max-width: 640px) 100vw, 540px"
                className="w-full rounded object-cover shadow-[var(--shadow-card)]"
              />
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
