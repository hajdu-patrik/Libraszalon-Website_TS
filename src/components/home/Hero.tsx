import { Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { home } from '@/content/pages/home';
import { reviewStats } from '@/content/reviews';
import { site } from '@/content/site';

/**
 * Full-bleed cinematic opener: the salon photograph under a dark scrim, the
 * brand quote set large in the serif display face, and the two actions the
 * whole site funnels toward.
 *
 * Animated with plain CSS rather than a Reveal wrapper because this is above
 * the fold on every device — it should start the moment the HTML paints, not
 * after hydration installs an observer.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[min(88svh,54rem)] items-center overflow-hidden bg-ink-deep">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="h-full w-full"
          style={{ animation: 'hero-image 0.9s var(--ease-out-expo) both' }}
        >
          <Picture
            slug="hero"
            alt=""
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Side scrim carries the copy; the foot fade hands over to the page. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep/90 via-ink-deep/60 to-ink-deep/20" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-deep/70 to-transparent" />
      </div>

      <div className="container-page py-20 sm:py-28">
        <div className="max-w-3xl">
          <p
            className="eyebrow-dark"
            style={{ animation: 'line-rise 0.5s var(--ease-out-expo) both', animationDelay: '0.05s' }}
          >
            {site.legalName} · {home.hero.location}
          </p>

          {/* hyphens-none: the body turns on Hungarian hyphenation, but a
              display headline must break at word boundaries only. */}
          <h1 className="mt-6 text-[length:var(--text-hero)] leading-[1.08] text-cream-text hyphens-none">
            {home.heroQuote.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <span
                  className="block"
                  style={{
                    animation: 'line-rise 0.55s var(--ease-out-expo) both',
                    animationDelay: `${0.12 + index * 0.12}s`,
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="mt-6 text-lg text-cream-muted"
            style={{ animation: 'line-rise 0.5s var(--ease-out-expo) both', animationDelay: '0.4s' }}
          >
            {site.owner} · {site.ownerTitle}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            style={{ animation: 'line-rise 0.5s var(--ease-out-expo) both', animationDelay: '0.5s' }}
          >
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
            <div
              className="mt-10 flex items-center gap-3"
              style={{ animation: 'fade-in 0.6s var(--ease-out-expo) both', animationDelay: '0.65s' }}
            >
              <span
                role="img"
                aria-label={`${reviewStats.average} csillag az 5-ből`}
                className="flex items-center gap-1"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    aria-hidden="true"
                    className={`size-4 ${
                      index < Math.round(reviewStats.average)
                        ? 'fill-gold text-gold'
                        : 'fill-cream-text/20 text-cream-text/20'
                    }`}
                  />
                ))}
              </span>
              <p className="text-sm text-cream-muted">
                <span className="font-semibold text-cream-text">
                  {reviewStats.average.toLocaleString('hu-HU')} / 5
                </span>{' '}
                — {reviewStats.count} {home.hero.ratingSuffix}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
