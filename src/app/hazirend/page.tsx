import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { InfoCard } from '@/components/ui/InfoCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { Numeral } from '@/components/ui/Numeral';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { houseRules } from '@/content/pages/house-rules';
import { pageSeo } from '@/content/seo';
import { breadcrumbJsonLd, houseRulesFaqJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.houseRules);

const RULES_HEADING_ID = 'hazirend-szabalyok';

export default function HouseRulesPage() {
  return (
    <>
      <PageHeader eyebrow={houseRules.eyebrow} title={houseRules.title} background="bg-prices-alt" />

      <Section>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal className="lg:pt-7">
            <p className="text-subtle">{houseRules.intro}</p>
          </Reveal>

          <Reveal variant="right" index={1}>
            <div className="rounded-r-2xl border-l-[3px] border-gold bg-cream p-card">
              <h2 className="eyebrow">{houseRules.scope.heading}</h2>
              <p className="mt-4 text-subtle">{houseRules.scope.body}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <Reveal>
          <SectionHeading align="left" id={RULES_HEADING_ID} title={houseRules.rulesHeading} />
        </Reveal>

        <ol
          role="list"
          aria-labelledby={RULES_HEADING_ID}
          className="column-flow mt-12 sm:mt-16"
          style={{ '--rows': Math.ceil(houseRules.rules.length / 2) } as CSSProperties}
        >
          {houseRules.rules.map((rule, index) => (
            <InfoCard
              key={rule.question}
              index={index % 2}
              marker={<Numeral value={index + 1} />}
              title={rule.question}
              body={rule.text}
            />
          ))}
        </ol>
      </Section>

      <JsonLd data={houseRulesFaqJsonLd()} />
      <JsonLd data={breadcrumbJsonLd('houseRules')} />
    </>
  );
}
