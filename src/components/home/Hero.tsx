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
 * The copy is deliberately not animated. It is the first thing on the site and
 * it sits behind the intro curtain, so a staggered entrance would land after
 * the curtain had already lifted — the visitor watches an empty scrim, then
 * words assembling, before reading a single one. Rendering it at rest means
 * the quote is legible in the same frame the curtain clears.
 *
 * Only the photograph moves: it settles out of a slow zoom under the copy,
 * which reads as the shot breathing rather than as the page loading. That runs
 * as plain CSS rather than a Reveal wrapper because it is above the fold on
 * every device and must start when the HTML paints, not after hydration
 * installs an observer.
 */
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
        {/* Side scrim carries the copy; the foot fade hands over to the page. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep/90 via-ink-deep/60 to-ink-deep/20" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-deep/70 to-transparent" />
      </div>

      <div className="container-page py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow-dark">
            {site.legalName} · {home.hero.location}
          </p>

          {/* hyphens-none: the body turns on Hungarian hyphenation, but a
              display headline must break at word boundaries only. */}
          <h1 className="mt-6 text-[length:var(--text-hero)] leading-[1.08] text-cream-text hyphens-none">
            {home.heroQuote.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 text-lg text-cream-muted">
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
              {/* The average carries the proof; the raw count is deliberately
                  not shown — a small honest number reads as a weakness next to
                  a five-star average. reviewStats.count still gates the block,
                  so nothing is claimed when there are no reviews. */}
              <p className="text-sm text-cream-muted">
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
