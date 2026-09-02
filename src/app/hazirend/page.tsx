import type { Metadata } from 'next';
import { GoldRule } from '@/components/ui/GoldRule';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHeader } from '@/components/ui/PageHeader';
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

      {

}
      <Section spacing="normal">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          {

}
          <Reveal className="lg:pt-7">
            <p className="text-muted">{houseRules.intro}</p>
          </Reveal>

          {
}
          <Reveal variant="right" index={1}>
            <div className="rounded-r-2xl border-l-[3px] border-gold bg-cream p-6 sm:p-8">
              <h2 className="eyebrow">{houseRules.scope.heading}</h2>
              <p className="mt-4 text-muted">{houseRules.scope.body}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="cream" spacing="normal">
        <Reveal>
          <h2
            id="hazirend-szabalyok"
            className="text-[length:var(--text-h2)] text-ink"
          >
            {houseRules.rulesHeading}
          </h2>
          <GoldRule className="mt-6" />
        </Reveal>

        {

}
        <ol
          role="list"
          aria-labelledby="hazirend-szabalyok"
          className="rules-grid mt-12"
          style={
            {
              '--rule-rows': Math.ceil(houseRules.rules.length / 2),
            } as React.CSSProperties
          }
        >
          {houseRules.rules.map((rule, index) => (
            <Reveal
              key={rule.question}
              as="li"
              index={index % 2}
              className="rule-card card-interactive"
            >
              {

}
              <span
                aria-hidden="true"
                className="font-heading text-[length:var(--text-rule-num)] leading-none font-medium text-gold-ink tabular-nums max-[30rem]:mb-1"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="font-heading text-[length:var(--text-rule-title)] leading-tight text-ink">
                  {rule.question}
                </h3>
                <p className="mt-3 text-[length:var(--text-rule-body)] leading-relaxed text-muted">
                  {rule.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <JsonLd data={houseRulesFaqJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: houseRules.title, path: pageSeo.houseRules.path },
        ])}
      />
    </>
  );
}
