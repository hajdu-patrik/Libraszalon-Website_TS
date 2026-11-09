import { Phone } from 'lucide-react';
import { StarRating } from '@/components/home/StarRating';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { home } from '@/content/pages/home';
import { reviewStats } from '@/content/reviews';
import { pageSeo } from '@/content/seo';
import { site } from '@/content/site';

export function Hero() {
  return (
    <section className="tone-dark relative isolate flex min-h-[min(88svh,54rem)] items-center overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full animate-hero">
          <Picture slug="hero" alt="" priority sizes="100vw" className="h-full w-full object-cover" />
        </div>
        {/* On phones the copy spans the full width, including the bright right half of
            the photo, so the scrim stays dark across instead of fading out. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep/90 via-ink-deep/80 to-ink-deep/70 sm:via-ink-deep/60 sm:to-ink-deep/20" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-deep/70 to-transparent" />
      </div>

      <div className="container-page py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow">
            {site.legalName} · {home.hero.location}
          </p>

          <h1 className="mt-6 text-hero leading-[1.08] hyphens-none">
            {home.heroQuote.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 text-lead text-subtle">
            {site.owner} · {site.ownerTitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button
              href={`tel:${site.phoneHref}`}
              icon={<Phone strokeWidth={1.8} />}
            >
              {home.hero.primaryCta}
            </Button>
            <Button href={pageSeo.prices.path} variant="outline">
              {home.hero.secondaryCta}
            </Button>
          </div>

          {reviewStats.count > 0 && (
            <div className="mt-10 flex items-center gap-3">
              <StarRating rating={reviewStats.average} />
              <p className="text-meta text-subtle">
                <span className="font-semibold text-cream-text">
                  {reviewStats.average.toLocaleString('hu-HU')} / 5
                </span>{' '}
                — {home.hero.ratingSuffix}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
