import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/FacebookIcon';
import { GitHubIcon } from '@/components/ui/GitHubIcon';
import { LinkedInIcon } from '@/components/ui/LinkedInIcon';
import Link from 'next/link';
import { CurrentYear } from '@/components/ui/CurrentYear';
import { homeItem, navItems } from '@/content/nav';
import { developer, site } from '@/content/site';

/**
 * Dark closing panel. The logo image is drawn for a white ground, so the brand
 * block here is typographic instead: the salon name in the serif display face
 * with the script tagline beneath it.
 */
export function Footer() {
  // Fallback only; CurrentYear reconciles to the visitor's real year on mount.
  const buildYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-deep text-cream-text">
      <div className="container-page pt-14 pb-8 sm:pt-20 sm:pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.2fr_0.9fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              href={homeItem.href}
              className="inline-flex min-h-11 items-center font-heading text-3xl text-cream-text transition-colors hover:text-gold"
            >
              {site.legalName}
            </Link>
            <p className="mt-4 max-w-sm font-script text-[1.4rem] leading-snug text-gold">
              {site.tagline}
            </p>
            <p className="mt-5 text-sm text-cream-muted">
              {site.owner} · {site.ownerTitle}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Lábléc menü">
            <h2 className="eyebrow-dark mb-4">Oldalak</h2>
            <ul>
              {[homeItem, ...navItems].map((item) => (
                <li key={item.href}>
                  {/* Full-width rather than inline: "Árak" is only 34px of
                      text, so the row itself has to carry the 44px target. */}
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center text-cream-muted transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="eyebrow-dark mb-4">Elérhetőségek</h2>
            <ul className="space-y-1">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex min-h-11 items-center gap-3 text-cream-muted transition-colors hover:text-gold"
                >
                  <Phone aria-hidden="true" className="size-4 shrink-0 text-gold" strokeWidth={1.8} />
                  <span dir="ltr">{site.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center gap-3 break-all text-cream-muted transition-colors hover:text-gold"
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-gold" strokeWidth={1.8} />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.social.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-start gap-3 py-2.5 text-cream-muted transition-colors hover:text-gold"
                >
                  <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-gold" strokeWidth={1.8} />
                  {site.address.formatted}
                </a>
              </li>
              <li>
                <span className="inline-flex min-h-11 items-center gap-3 text-cream-muted">
                  <Clock aria-hidden="true" className="size-4 shrink-0 text-gold" strokeWidth={1.8} />
                  {site.openingHoursDisplay}
                </span>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 text-cream-muted transition-colors hover:text-gold"
                >
                  <FacebookIcon className="size-4 shrink-0 text-gold" />
                  {site.social.facebookLabel}
                </a>
              </li>
            </ul>
          </div>

          {/* Credit */}
          <div>
            <h2 className="eyebrow-dark mb-4">{developer.heading}</h2>
            <ul>
              {[
                { ...developer.github, Icon: GitHubIcon },
                { ...developer.linkedin, Icon: LinkedInIcon },
              ].map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-3 text-cream-muted transition-colors hover:text-gold"
                  >
                    <Icon className="size-4 shrink-0 text-gold" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cream-text/10 pt-6 text-center text-sm text-cream-muted">
          <CurrentYear fallback={buildYear} /> © {site.legalName} · {site.copyright}
        </div>
      </div>
    </footer>
  );
}
