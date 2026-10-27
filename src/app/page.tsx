import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel';
import { ServiceCard } from '@/components/home/ServiceCard';
import { BookingActions } from '@/components/ui/BookingActions';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { home } from '@/content/pages/home';
import { publishedReviews, reviewsNote } from '@/content/reviews';
import { pageSeo } from '@/content/seo';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { booking } from '@/content/ui';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(pageSeo.home);

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section tone="cream" background="bg-home">
        <Reveal>
          <SectionHeading title={home.services.title} />
        </Reveal>
        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-24">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <Reveal>
          <SectionHeading eyebrow={home.reviews.eyebrow} title={home.reviews.title} lead={reviewsNote} />
        </Reveal>
        <div className="mt-12 sm:mt-16">
          <ReviewsCarousel reviews={publishedReviews} />
        </div>
      </Section>

      <Section tone="cream" background="bg-prices-alt">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-script text-h2 leading-snug">{site.tagline}</p>
          <p className="mt-6 text-subtle">{booking.callBody}</p>
          <BookingActions className="mt-9 justify-center" />
        </Reveal>
      </Section>
    </>
  );
}
