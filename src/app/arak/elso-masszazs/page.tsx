import type { Metadata } from 'next';
import { InfoCard } from '@/components/ui/InfoCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { Numeral } from '@/components/ui/Numeral';
import { PageHeader } from '@/components/ui/PageHeader';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { firstMassage } from '@/content/pages/first-massage';
import { pageSeo } from '@/content/seo';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.firstMassage);

export default function FirstMassagePage() {
  return (
    <>
      <PageHeader
        eyebrow={firstMassage.eyebrow}
        title={firstMassage.title}
        background="bg-first-massage"
      />

      <Section>
        <div className="split-gap grid items-start lg:grid-cols-[1fr_minmax(0,26rem)]">
          <Reveal>
            <SectionHeading align="left" title={firstMassage.assessment.heading} />
            <p className="prose-measure mt-6 text-subtle">{firstMassage.assessment.body}</p>
          </Reveal>

          <Reveal
            variant="right"
            index={1}
            className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:mx-0 lg:max-w-none"
          >
            <Picture
              slug="about-room"
              alt={firstMassage.imageAlt}
              sizes="(min-width: 1024px) 26rem, min(100vw, 28rem)"
              className="card-interactive aspect-[3/4] w-full rounded-t-[10rem] rounded-b-3xl object-cover object-[72%_50%] lg:aspect-[2/3] lg:rounded-t-[13rem]"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" spacing="tight">
        <Reveal>
          <SectionHeading title={firstMassage.sensitiveSkin.heading} lead={firstMassage.sensitiveSkin.body} />
        </Reveal>
      </Section>

      <Section tone="cream">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow={firstMassage.tips.subheading}
            title={firstMassage.tips.heading}
          />
        </Reveal>

        <ol role="list" className="section-body grid gap-grid sm:grid-cols-2">
          {firstMassage.tips.items.map((tip, index) => (
            <InfoCard key={tip} index={index % 2} marker={<Numeral value={index + 1} />} body={tip} />
          ))}
        </ol>
      </Section>

      <JsonLd data={webPageJsonLd('firstMassage')} />

      <JsonLd data={breadcrumbJsonLd('prices', 'firstMassage')} />
    </>
  );
}
