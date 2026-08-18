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

      {/* The pass sits here rather than at the foot of the page: it is the one
          thing on /hazirend/ a visitor might be looking for by sight, and the
          rules that govern it — payment, expiry, late cancellation — are all
          below. Showing it up front means the reader has seen the object before
          the first rule mentions it. */}
      <Section spacing="normal">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-16">
          <div>
            <Reveal>
              <p className="prose-measure text-muted">{houseRules.intro}</p>
            </Reveal>

            {/* The scope statement gets callout treatment: it is the sentence
                the whole page hangs on. */}
            <Reveal index={1} className="mt-12">
              <div className="rounded-r-2xl border-l-[3px] border-gold bg-cream p-6 sm:p-8">
                <p className="eyebrow">{houseRules.scope.heading}</p>
                <p className="mt-4 text-muted">{houseRules.scope.body}</p>
              </div>
            </Reveal>
          </div>

          <Reveal
            variant="right"
            index={2}
            className="mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:mx-0 lg:max-w-none"
          >
            <p className="eyebrow">{houseRules.passHeading}</p>
            <div className="mt-5 space-y-6">
              {(
                [
                  {
                    slug: 'pass-front',
                    caption: houseRules.passCaptions.front,
                    label: houseRules.passLabels.front,
                  },
                  {
                    slug: 'pass-back',
                    caption: houseRules.passCaptions.back,
                    label: houseRules.passLabels.back,
                  },
                ] as const
              ).map((item) => (
                <figure key={item.slug}>
                  <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                    <Picture
                      slug={item.slug}
                      alt={item.caption}
                      sizes="(max-width: 1024px) min(100vw, 24rem), 24rem"
                      className="w-full object-cover transition-transform duration-(--dur-base) ease-gentle hover:scale-[1.02]"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted">
                    {item.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="cream" spacing="normal">
        <Reveal>
          <h2 className="text-[length:var(--text-h2)] text-ink">
            {houseRules.rulesHeading}
          </h2>
          <GoldRule className="mt-6" />
        </Reveal>

        {/*
          Fourteen rules in a single 48rem column ran for most of a screen and
          a half of near-identical cards. Paired up they read as a reference
          table, which is what they are.

          items-start rather than the default stretch: rule 14 is one sentence
          and rule 8 is most of a page, and a stretched row would blow the short
          one up to match, leaving a card that is four fifths empty. Each card
          keeps its own height instead.

          The stagger is index % 2, so the pair that arrives together is offset
          against itself — the same trick the tips grid on /arak/elso-masszazs/
          uses — instead of the whole list queueing behind one delay chain.
        */}
        <ol className="mt-12 grid items-start gap-5 md:grid-cols-2 md:gap-6">
          {houseRules.rules.map((rule, index) => (
            <Reveal
              key={rule.question}
              as="li"
              index={index % 2}
              className="flex gap-4 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-(--dur-base) ease-smooth hover:border-gold/50 hover:shadow-[var(--shadow-lift)] sm:gap-5 lg:gap-6 lg:p-7"
            >
              <span
                aria-hidden="true"
                className="font-heading text-3xl leading-none font-medium text-gold/60 lg:text-4xl"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="font-heading text-[1.25rem] leading-tight text-ink lg:text-[1.375rem]">
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
