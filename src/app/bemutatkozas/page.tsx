import type { Metadata } from 'next';
import { Quote } from 'lucide-react';
import { GoldRule } from '@/components/ui/GoldRule';
import { PageHeader } from '@/components/ui/PageHeader';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { about } from '@/content/pages/about';
import { pageSeo } from '@/content/seo';
import { site } from '@/content/site';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.about);

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={about.eyebrow}
        title={about.title}
        background="bg-about"
      />

      {/* Portrait and professional background */}
      <Section spacing="normal">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <Reveal variant="left">
            {/* The arch crown is the page's signature shape — a quiet nod to
                doorways and spa architecture. */}
            <Picture
              slug="about-portrait"
              alt={`${about.name}, ${site.ownerTitle}, a ${site.legalName} alapítója`}
              sizes="(max-width: 1024px) 100vw, 24rem"
              className="aspect-[4/5] w-full rounded-b-3xl rounded-t-[12rem] object-cover shadow-[var(--shadow-lift)]"
            />
          </Reveal>

          <Reveal variant="right" index={1}>
            <h2 className="text-[length:var(--text-h2)] text-ink">{about.name}</h2>
            <p className="eyebrow mt-3">{site.ownerTitle}</p>
            <GoldRule className="mt-5" />
            <p className="prose-measure mt-7 text-muted first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-[3.4em] first-letter:leading-[0.8] first-letter:text-gold-ink">
              {about.intro}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Hippocrates quote on the dark band */}
      <Section tone="dark" spacing="normal">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Quote
            aria-hidden="true"
            className="mx-auto size-9 fill-gold/40 text-gold/40"
          />
          <blockquote className="mt-6 font-heading text-[length:var(--text-h2)] leading-snug text-cream-text italic">
            {about.quote.text}
          </blockquote>
          <cite className="mt-6 block text-sm tracking-wide not-italic text-cream-muted">
            {about.quote.attribution}
          </cite>
        </Reveal>
      </Section>

      {/* The balance the salon is named after */}
      <Section tone="cream" background="bg-about" spacing="normal">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <p className="prose-measure text-muted">{about.balance}</p>
            <p className="mt-8 font-script text-[1.6rem] leading-snug text-gold-ink">
              {about.closing}
            </p>
          </Reveal>

          <Reveal variant="right" index={1}>
            <Picture
              slug="about-room"
              alt="A Libra Masszázs Szalon kezelőhelyisége"
              sizes="(max-width: 1024px) 100vw, 560px"
              className="w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
            />
          </Reveal>
        </div>
      </Section>

      {/* Cupping tools */}
      <Section spacing="normal">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {(
            [
              { slug: 'cupping-plastic', caption: about.cuppingCaptions.plastic },
              { slug: 'cupping-silicone', caption: about.cuppingCaptions.silicone },
            ] as const
          ).map((item, index) => (
            <Reveal key={item.slug} index={index} as="figure">
              <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
                <Picture
                  slug={item.slug}
                  alt={item.caption}
                  sizes="(max-width: 640px) 100vw, 560px"
                  className="w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.03]"
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: about.title, path: pageSeo.about.path },
            ]),
          ),
        }}
      />
    </>
  );
}
