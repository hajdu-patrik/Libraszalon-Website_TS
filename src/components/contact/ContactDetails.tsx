import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/FacebookIcon';
import { contact } from '@/content/pages/contact';
import { site } from '@/content/site';

/**
 * Every way to reach the salon, gathered on one light card.
 *
 * White on the section's cream, separated by a hairline and the soft card
 * shadow rather than by a block of colour — the espresso panel this replaces
 * read as a second header dropped into the middle of the page and pulled the
 * eye away from the copy above it.
 *
 * Text colours are the light-surface pair the rest of the site uses: --muted
 * for the entries (7.1:1 on white) and --gold-ink for their hover state
 * (4.99:1), since the raw brand gold only manages 2.54:1 and is reserved here
 * for the icons and the top rule, which carry no meaning of their own.
 */
export function ContactDetails() {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-[var(--shadow-card)] sm:p-9">
      {/* Gold signature line across the top of the card. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent"
      />

      <h2 className="font-heading text-[length:var(--text-h3)] text-ink">
        {contact.detailsHeading}
      </h2>

      <ul className="mt-6 space-y-2">
        <li>
          <a
            href={`tel:${site.phoneHref}`}
            className="inline-flex min-h-11 items-center gap-3.5 text-muted transition-colors hover:text-gold-ink"
          >
            <Phone aria-hidden="true" className="size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
            <span dir="ltr">{site.phone}</span>
          </a>
        </li>
        <li>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center gap-3.5 break-all text-muted transition-colors hover:text-gold-ink"
          >
            <Mail aria-hidden="true" className="size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
            {site.email}
          </a>
        </li>
        <li>
          <a
            href={site.social.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-start gap-3.5 py-2.5 text-muted transition-colors hover:text-gold-ink"
          >
            <MapPin aria-hidden="true" className="mt-1 size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
            {site.address.formatted}
          </a>
        </li>
        <li>
          <span className="inline-flex min-h-11 items-center gap-3.5 text-muted">
            <Clock aria-hidden="true" className="size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
            {site.openingHoursDisplay}
          </span>
        </li>
      </ul>

      <div className="mt-8 border-t border-line pt-6">
        <h2 className="eyebrow">{contact.socialHeading}</h2>
        <a
          href={site.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-3.5 text-muted transition-colors hover:text-gold-ink"
        >
          <FacebookIcon className="size-[18px] shrink-0 text-gold" />
          {site.social.facebookLabel}
        </a>
      </div>
    </div>
  );
}
