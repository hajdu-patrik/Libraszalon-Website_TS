import type { Metadata } from 'next';
import { Quote } from 'lucide-react';
import { GoldRule } from '@/components/ui/GoldRule';
import { JsonLd } from '@/components/ui/JsonLd';
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

      <Section spacing="normal">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-16">
          {

}
          <Reveal
            variant="left"
            className="mx-auto w-full max-w-md lg:mx-0 lg:mt-14 lg:max-w-none"
          >
            {

}
            <Picture
              slug="about-portrait"
              alt={`${about.name}, ${site.ownerTitle}, a ${site.legalName} alapítója`}
              sizes="(max-width: 1024px) min(100vw, 28rem), 28rem"
              className="card-interactive aspect-[4/5] w-full rounded-b-3xl rounded-t-[12rem] object-cover lg:rounded-t-[14rem]"
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

      <Section tone="dark" spacing="normal">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Quote
            aria-hidden="true"
            className="mx-auto size-9 fill-gold/40 text-gold/40"
          />
          <blockquote className="mt-6 font-heading text-[length:var(--text-h2)] leading-snug text-cream-text italic">
            {about.quote.text}
          </blockquote>
          <cite className="mt-6 block text-[length:var(--text-meta)] tracking-wide not-italic text-cream-muted">
            {about.quote.attribution}
          </cite>
        </Reveal>
      </Section>

      <Section tone="cream" background="bg-about" spacing="normal">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16">
          <Reveal variant="left">
            <p className="prose-measure text-muted">{about.balance}</p>
            <p className="mt-8 font-script text-[1.6rem] leading-snug text-gold-ink">
              {about.closing}
            </p>
          </Reveal>

          <Reveal
            variant="right"
            index={1}
            className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:mx-0 lg:max-w-none"
          >
            <Picture
              slug="about-room"
              alt="A Libra Masszázs Szalon kezelőhelyisége"
              sizes="(max-width: 1024px) min(100vw, 28rem), 28rem"
              className="card-interactive aspect-[4/3] w-full rounded-3xl object-cover"
            />
          </Reveal>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: about.title, path: pageSeo.about.path },
        ])}
      />
    </>
  );
}
