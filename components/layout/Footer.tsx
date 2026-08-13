import Link from 'next/link';
import { Picture } from '@/components/ui/Picture';
import { MailIcon, PhoneIcon, PinIcon } from '@/components/ui/Icons';
import { homeItem, navItems } from '@/content/nav';
import { site } from '@/content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-subtle">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand and tagline */}
          <div>
            <Link href={homeItem.href} className="inline-block" aria-label={site.legalName}>
              <Picture slug="logo" alt="" sizes="220px" className="h-14 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm font-script text-[1.375rem] leading-snug text-ink">
              {site.tagline}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Lábléc menü">
            <h2 className="eyebrow mb-4">Oldalak</h2>
            <ul className="space-y-1">
              {[homeItem, ...navItems].map((item) => (
                <li key={item.href}>
                  {/* Full-width rather than inline: "Árak" is only 34px of
                      text, so the row itself has to carry the 44px target. */}
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center text-muted transition-colors hover:text-gold-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="eyebrow mb-4">Elérhetőségek</h2>
            <ul className="space-y-2 text-muted">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center gap-2.5 break-all transition-colors hover:text-gold-ink"
                >
                  <MailIcon className="size-[18px] shrink-0 text-gold" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex min-h-11 items-center gap-2.5 transition-colors hover:text-gold-ink"
                >
                  <PhoneIcon className="size-[18px] shrink-0 text-gold" />
                  <span dir="ltr">{site.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={site.social.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-start gap-2.5 transition-colors hover:text-gold-ink"
                >
                  <PinIcon className="mt-[3px] size-[18px] shrink-0 text-gold" />
                  {site.address.formatted}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center text-sm text-muted">
          {year} © {site.copyright}
        </div>
      </div>
    </footer>
  );
}
