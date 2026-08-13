import { Picture } from '@/components/ui/Picture';
import { home } from '@/content/pages/home';

/**
 * Opening panel. The quote wipes upward line by line while the photograph
 * settles out of a slight zoom.
 *
 * Animated with plain CSS rather than a Reveal wrapper because this is above
 * the fold on every device — it should start the moment the HTML paints, not
 * after hydration installs an observer.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-surface">
      <div className="container-page py-14 sm:py-20 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <h1 className="font-script text-[length:var(--text-hero)] leading-[1.25] text-ink">
            {home.heroQuote.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <span
                  className="block"
                  style={{
                    animation: `line-rise 0.35s var(--ease-out-expo) both`,
                    animationDelay: `${0.06 + index * 0.1}s`,
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div
            className="overflow-hidden rounded"
            style={{
              animation: 'hero-image 0.4s var(--ease-out-expo) both',
              animationDelay: '0.1s',
            }}
          >
            <Picture
              slug="hero"
              alt={home.heroImageAlt}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="w-full rounded object-cover shadow-[var(--shadow-card)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
