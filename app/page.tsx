import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel';
import { ServiceCard } from '@/components/home/ServiceCard';
import { Button } from '@/components/ui/Button';
import { MailIcon, PhoneIcon } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { home } from '@/content/pages/home';
import { publishedReviews, reviewsNote } from '@/content/reviews';
import { pageSeo } from '@/content/seo';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.home);

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Services — no section heading, matching the original page. */}
      <Section background="bg-home" spacing="normal">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-7">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </Section>

      <Section tone="subtle" spacing="normal">
        <SectionHeading
          eyebrow={home.reviews.eyebrow}
          title={home.reviews.title}
          lead={reviewsNote}
        />
        <div className="mt-12">
          <ReviewsCarousel reviews={publishedReviews} />
        </div>
      </Section>

      <Section spacing="tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-script text-[length:var(--text-h2)] leading-snug text-ink">
            {site.tagline}
          </p>
          <p className="mt-6 text-muted">{home.cta.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              href={`tel:${site.phoneHref}`}
              icon={<PhoneIcon className="size-[18px]" />}
            >
              {home.cta.callLabel}
            </Button>
            <Button
              href={`mailto:${site.email}`}
              variant="outline"
              icon={<MailIcon className="size-[18px]" />}
            >
              {home.cta.emailLabel}
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
