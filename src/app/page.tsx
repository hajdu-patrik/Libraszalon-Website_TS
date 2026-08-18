import type { Metadata } from 'next';
import { Mail, Phone } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel';
import { ServiceCard } from '@/components/home/ServiceCard';
import { Button } from '@/components/ui/Button';
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

      {/* Services as editorial rows */}
      <Section tone="cream" background="bg-home" spacing="normal">
        <SectionHeading title={home.services.title} />
        <div className="mt-14 space-y-16 sm:mt-20 sm:space-y-24">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </Section>

      {/* Reviews on the dark band */}
      <Section tone="dark" spacing="normal">
        <SectionHeading
          tone="dark"
          eyebrow={home.reviews.eyebrow}
          title={home.reviews.title}
          lead={reviewsNote}
        />
        <div className="mt-12">
          <ReviewsCarousel reviews={publishedReviews} />
        </div>
      </Section>

      {/* Closing call to action */}
      <Section tone="cream" background="bg-prices-alt" spacing="normal">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-script text-[length:var(--text-h2)] leading-snug text-ink">
            {site.tagline}
          </p>
          <p className="mt-6 text-muted">{home.cta.body}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button
              href={`tel:${site.phoneHref}`}
              icon={<Phone className="size-[18px]" strokeWidth={1.8} />}
            >
              {home.cta.callLabel}
            </Button>
            <Button
              href={`mailto:${site.email}`}
              variant="outline"
              icon={<Mail className="size-[18px]" strokeWidth={1.8} />}
            >
              {home.cta.emailLabel}
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
