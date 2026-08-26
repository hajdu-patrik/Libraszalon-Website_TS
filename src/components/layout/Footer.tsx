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
 *
 * Two columns from the smallest screen up, not from sm.
 *
 * One column was costing the footer twice. "Oldalak" and the developer credit
 * are six and two rows of a single word each; given the whole 357px of a phone
 * they used about 90px of it and stacked, which is how four short blocks turned
 * into a 900px scroll of left-aligned links with nothing to tell them apart.
 * Pairing the two short lists puts that width to work and takes roughly a third
 * off the height.
 *
 * The two long blocks stay full-width — the brand, whose tagline wants a line
 * it can breathe on, and the contact list, where "libraszalon@gmail.com" and
 * "Budapest, Hidegkúti út 174, 1028" in a 170px column is exactly the
 * break-all mess this is meant to be fixing. col-span-2 on both, released at
 * lg where the four-column layout takes over.
 *
 * The credit is declared before the contact block, so on a phone the pairing
 * falls out of the DOM order and the reading order is the visual one. Desktop
 * puts the two back the way round they were with lg:order — contact belongs
 * next to the salon's own blocks, and the developer credit belongs last. The
 * four track widths are therefore unchanged from before this layout existed.
 */
export function Footer() {
  // Fallback only; CurrentYear reconciles to the visitor's real year on mount.
  const buildYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-deep text-cream-text">
      <div className="container-page pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 sm:gap-x-10 lg:grid-cols-[1.4fr_0.8fr_1.2fr_0.9fr] lg:gap-12">
          {/* Brand */}
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

          {/* Credit */}
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

          {/* Contact */}
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
