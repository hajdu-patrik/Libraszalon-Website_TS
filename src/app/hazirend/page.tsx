import type { Metadata } from 'next';
import { GoldRule } from '@/components/ui/GoldRule';
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

      {/*
        Two text blocks across the full width.

        The pass photographs used to hold the right-hand third of this row, and
        the introduction was squeezed into what was left. They are gone (the
        copy for them is still in the content file), so the two things a reader
        has to take in before the rules start — why the rules exist, and what
        the salon actually offers — get a column each instead of one column and
        a picture.

        Side by side rather than stacked because the two run to almost the same
        length; stacked, each would have made a 75-character line of a paragraph
        that is already dense. items-start so the callout keeps its own height
        instead of being stretched to match the paragraph beside it.
      */}
      <Section spacing="normal">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="text-muted">{houseRules.intro}</p>
          </Reveal>

          {/* The scope statement gets callout treatment: it is the sentence
              the whole page hangs on. */}
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
          <h2 className="text-[length:var(--text-h2)] text-ink">
            {houseRules.rulesHeading}
          </h2>
          <GoldRule className="mt-6" />
        </Reveal>

        {/*
          Multi-column, not a two-track grid.

          A grid with items-start stops a short card being stretched to its
          neighbour's height, but it cannot stop the row itself: rules 2 and 5
          are one sentence and rule 8 is most of a page, so every row was as
          tall as its tallest card and the short ones left a hole underneath.
          Fourteen rules of wildly uneven length produced a column of holes.

          `columns-2` takes the rows out of the equation. The list is one flow
          that the browser balances into two columns of equal height, so a short
          rule is followed immediately by the next one — the masonry effect,
          from the layout mode that has always done it, with no script and no
          measuring. It also splits the list roughly 1-7 / 8-14, which is the
          right reading order for something numbered: down one column, then down
          the next.

          break-inside-avoid is not optional here. Without it the browser is
          free to end a column halfway through rule 8 and resume it at the top
          of the next one, which for a numbered rule is not a wrap, it is a
          different rule.
        */}
        <ol className="mt-12 gap-6 md:columns-2">
          {houseRules.rules.map((rule, index) => (
            <Reveal
              key={rule.question}
              as="li"
              index={index % 2}
              className="mb-5 flex break-inside-avoid gap-4 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-(--dur-base) ease-smooth hover:border-gold/50 hover:shadow-[var(--shadow-lift)] sm:gap-5 md:mb-6 lg:gap-6 lg:p-7"
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
