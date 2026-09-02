import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/FacebookIcon';
import { GitHubIcon } from '@/components/ui/GitHubIcon';
import { LinkedInIcon } from '@/components/ui/LinkedInIcon';
import Link from 'next/link';
import { CurrentYear } from '@/components/ui/CurrentYear';
import { homeItem, navItems } from '@/content/nav';
import { developer, site } from '@/content/site';

export function Footer() {

  const buildYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-deep text-cream-text">
      <div className="container-page pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 sm:gap-x-10 lg:grid-cols-[1.4fr_0.8fr_1.2fr_0.9fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link
              href={homeItem.href}
              className="inline-flex min-h-11 items-center font-heading text-3xl text-cream-text transition-colors hover:text-gold"
            >
              {site.legalName}
            </Link>
            <p className="mt-4 max-w-sm font-script text-[1.55rem] leading-snug text-gold">
              {site.tagline}
            </p>
            <p className="mt-5 text-[length:var(--text-meta)] text-cream-muted">
              {site.owner} · {site.ownerTitle}
            </p>
          </div>

          <nav aria-label="Lábléc menü">
            <h2 className="eyebrow-dark mb-4">Oldalak</h2>
            <ul>
              {[homeItem, ...navItems].map((item) => (
                <li key={item.href}>
                  {
}
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

          <div className="lg:order-4">
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
                    className="inline-flex min-h-11 items-center gap-3.5 text-cream-muted transition-colors hover:text-gold"
                  >
                    <Icon className="size-5 shrink-0 text-gold" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:order-3 lg:col-span-1">
            <h2 className="eyebrow-dark mb-4">Elérhetőségek</h2>
            <ul className="space-y-1">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex min-h-11 items-center gap-3.5 text-cream-muted transition-colors hover:text-gold"
                >
                  <Phone aria-hidden="true" className="size-5 shrink-0 text-gold" strokeWidth={1.8} />
                  <span dir="ltr">{site.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center gap-3.5 break-all text-cream-muted transition-colors hover:text-gold"
                >
                  <Mail aria-hidden="true" className="size-5 shrink-0 text-gold" strokeWidth={1.8} />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.social.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-start gap-3.5 py-2.5 text-cream-muted transition-colors hover:text-gold"
                >
                  <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" strokeWidth={1.8} />
                  {site.address.formatted}
                </a>
              </li>
              <li>
                <span className="inline-flex min-h-11 items-center gap-3.5 text-cream-muted">
                  <Clock aria-hidden="true" className="size-5 shrink-0 text-gold" strokeWidth={1.8} />
                  {site.openingHoursDisplay}
                </span>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3.5 text-cream-muted transition-colors hover:text-gold"
                >
                  <FacebookIcon className="size-5 shrink-0 text-gold" />
                  {site.social.facebookLabel}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cream-text/10 pt-6 text-center text-[length:var(--text-meta)] text-cream-muted sm:mt-14">
          <CurrentYear fallback={buildYear} /> © {site.legalName} · {site.copyright}
        </div>
      </div>
    </footer>
  );
}
