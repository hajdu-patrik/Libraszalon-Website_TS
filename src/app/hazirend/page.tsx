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
          {/* The callout's own inset, less one step — 1.75rem against its 2rem.

              items-start already lines the two *boxes* up, but a reader does
              not see boxes. The callout's first line starts a padding step
              below its top edge, so against a paragraph that starts at its own
              edge the columns read 32px out of true; mirroring the padding
              exactly still leaves 4px, because the two first lines are not the
              same kind of line. The callout opens on a 12px heading, and the
              base layer sets line-height 1.12 on headings, so its glyphs sit
              almost flush with the top of their line box. The paragraph is
              17px at 1.75, and half of that leading — a little over 4px — sits
              above its first glyph before any text is drawn.

              1.75rem instead of 2rem pays that difference back. In rem, so it
              survives text zoom: both the leading and the correction scale
              together. Measured at 1024, 1280 and 1440: 0px apart.

              Only from lg, the one place the two are side by side. Stacked,
              the padding would just be a gap. */}
          <Reveal className="lg:pt-7">
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
          <h2
            id="hazirend-szabalyok"
            className="text-[length:var(--text-h2)] text-ink"
          >
            {houseRules.rulesHeading}
          </h2>
          <GoldRule className="mt-6" />
        </Reveal>

        {/*
          The symmetrical two-column grid — see `rules-grid` in globals.css for
          why it is built the way it is.

          role="list" is not redundant. Preflight sets list-style: none on every
          ol, and VoiceOver drops list semantics when it does; this list is the
          structure of the page, so "list, 14 items" is worth keeping.

          --rule-rows is derived rather than written, so the grid follows the
          content file. Half the rules, rounded up: with an odd count the first
          column simply carries the extra one and the columns still end level.
        */}
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
              {/* gold-ink, not gold. The numerals were text-gold/60, which
                  composites to #e0c299 on the card and 1.70:1 — under AA for
                  text, and under even the 3:1 large-text floor the 24-36px
                  size would otherwise qualify for. Raw gold at full opacity
                  still only reaches 2.54:1. gold-ink is the same hue taken
                  dark enough to clear 4.5:1, which is what the palette keeps
                  it for.

                  aria-hidden because the ol already numbers these; tabular so
                  the two-digit numerals hold a column. */}
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
