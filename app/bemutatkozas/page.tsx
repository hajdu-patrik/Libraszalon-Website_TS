import type { Metadata } from 'next';
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
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-14">
          <Reveal variant="left">
            <Picture
              slug="about-portrait"
              alt={`${about.name}, ${site.ownerTitle}, a ${site.legalName} alapítója`}
              sizes="(max-width: 1024px) 100vw, 22rem"
              className="w-full rounded object-cover shadow-[var(--shadow-card)]"
            />
            <h2 className="mt-6 text-[length:var(--text-h2)] text-ink">
              {about.name}
            </h2>
          </Reveal>

          <Reveal variant="right" index={1}>
            <p className="prose-measure text-muted">{about.intro}</p>
          </Reveal>
        </div>
      </Section>

      {/* Hippocrates quote */}
      <Section tone="subtle" spacing="tight">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Picture
            slug="quote-mark"
            alt=""
            sizes="48px"
            className="mx-auto size-10 opacity-30"
          />
          <blockquote className="mt-5 font-script text-[length:var(--text-h2)] leading-snug text-ink">
            {about.quote.text}
          </blockquote>
          <cite className="mt-4 block text-sm not-italic text-muted">
            {about.quote.attribution}
          </cite>
        </Reveal>
      </Section>

      {/* The balance the salon is named after */}
      <Section spacing="normal">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal variant="left">
            <p className="prose-measure text-muted">{about.balance}</p>
            <p className="mt-6 font-script text-[1.5rem] leading-snug text-ink">
              {about.closing}
            </p>
          </Reveal>

          <Reveal variant="right" index={1}>
            <Picture
              slug="about-room"
              alt="A Libra Masszázs Szalon kezelőhelyisége"
              sizes="(max-width: 1024px) 100vw, 540px"
              className="w-full rounded object-cover shadow-[var(--shadow-card)]"
            />
          </Reveal>
        </div>
      </Section>

      {/* Cupping tools */}
      <Section tone="subtle" spacing="normal">
        <div className="grid gap-6 sm:grid-cols-2">
          {(
            [
              { slug: 'cupping-plastic', caption: about.cuppingCaptions.plastic },
              { slug: 'cupping-silicone', caption: about.cuppingCaptions.silicone },
            ] as const
          ).map((item, index) => (
            <Reveal key={item.slug} index={index} as="figure">
              <Picture
                slug={item.slug}
                alt={item.caption}
                sizes="(max-width: 640px) 100vw, 540px"
                className="w-full rounded object-cover shadow-[var(--shadow-card)]"
              />
              <figcaption className="mt-3 text-sm text-muted">
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
