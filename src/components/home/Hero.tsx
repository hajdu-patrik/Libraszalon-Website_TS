import { Phone } from 'lucide-react';
import { StarRating } from '@/components/home/StarRating';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { home } from '@/content/pages/home';
import { reviewStats } from '@/content/reviews';
import { site } from '@/content/site';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[min(88svh,54rem)] items-center overflow-hidden bg-ink-deep">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="h-full w-full"
          style={{ animation: 'hero-image var(--dur-slow) var(--ease-smooth) both' }}
        >
          <Picture
            slug="hero"
            alt=""
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep/90 via-ink-deep/60 to-ink-deep/20" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-deep/70 to-transparent" />
      </div>

      <div className="container-page py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow-dark">
            {site.legalName} · {home.hero.location}
          </p>

          {
}
          <h1 className="mt-6 text-[length:var(--text-hero)] leading-[1.08] text-cream-text hyphens-none">
            {home.heroQuote.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 text-[length:var(--text-lead)] text-cream-muted">
            {site.owner} · {site.ownerTitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button
              href={`tel:${site.phoneHref}`}
              icon={<Phone className="size-[18px]" strokeWidth={1.8} />}
            >
              {home.hero.primaryCta}
            </Button>
            <Button href="/arak/" variant="outline-light">
              {home.hero.secondaryCta}
            </Button>
          </div>

          {reviewStats.count > 0 && (
            <div className="mt-10 flex items-center gap-3">
              <StarRating rating={reviewStats.average} tone="dark" animate={false} />
              <p className="text-[length:var(--text-meta)] text-cream-muted">
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
