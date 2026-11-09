import type { Metadata } from 'next';
import { Quote } from 'lucide-react';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHeader } from '@/components/ui/PageHeader';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { about } from '@/content/pages/about';
import { pageSeo } from '@/content/seo';
import { site } from '@/content/site';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.about);

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={about.eyebrow} title={about.title} background="bg-about" />

      <Section>
        <div className="split-gap grid items-start lg:grid-cols-[minmax(0,28rem)_1fr]">
          <Reveal variant="left" className="mx-auto w-full max-w-md lg:mx-0 lg:mt-14 lg:max-w-none">
            <Picture
              slug="about-detail"
              alt={about.portraitAlt}
              sizes="(min-width: 1024px) 28rem, min(100vw, 28rem)"
              className="card-interactive aspect-[4/5] w-full rounded-t-[12rem] rounded-b-3xl object-cover object-[50%_20%] lg:rounded-t-[14rem]"
            />
          </Reveal>

          <Reveal variant="right" index={1}>
            <SectionHeading align="left" title={about.name} subtitle={site.ownerTitle} />
            <p className="prose-measure mt-6 text-subtle first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-[3.4em] first-letter:leading-[0.8] first-letter:text-accent">
              {about.intro}
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Quote aria-hidden="true" className="mx-auto size-9 fill-gold/40 text-gold/40" />
          <figure className="mt-6">
            <blockquote className="font-heading text-h2 leading-snug italic">
              <p>{about.quote.text}</p>
            </blockquote>
            <figcaption className="mt-6 text-meta tracking-wide text-subtle">
              {about.quote.attribution}
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      <Section tone="cream" background="bg-about">
        <div className="split-gap grid items-start lg:grid-cols-[1fr_minmax(0,28rem)]">
          <Reveal variant="left">
            <p className="prose-measure text-subtle">{about.balance}</p>
            <p className="mt-8 font-script text-script leading-snug text-accent">{about.closing}</p>
          </Reveal>

          <Reveal
            variant="right"
            index={1}
            className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:mx-0 lg:max-w-none"
          >
            <Picture
              slug="about-room"
              alt={about.roomAlt}
              sizes="(min-width: 1024px) 28rem, min(100vw, 28rem)"
              className="card-interactive aspect-[4/3] w-full rounded-3xl object-cover"
            />
          </Reveal>
        </div>
      </Section>

      <JsonLd data={webPageJsonLd('about', 'AboutPage')} />

      <JsonLd data={breadcrumbJsonLd('about')} />
    </>
  );
}
