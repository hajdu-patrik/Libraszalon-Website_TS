import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/FacebookIcon';
import { contact } from '@/content/pages/contact';
import { site } from '@/content/site';

/**
 * Every way to reach the salon, as one block inside the page's shared card.
 *
 * Deliberately carries no chrome of its own — no background, border or shadow.
 * It used to be a card, and beside a map that was also a card, inside a section
 * that framed both, the page read as three competing containers holding four
 * short facts. The frame now belongs to the page; this is just its right-hand
 * column.
 *
 * Marked up as <address>, which is what the element is for: contact details
 * for the nearest article or, as here, for the document. That is also what
 * makes the block legible to a parser that is not reading the labels — the
 * tel:, mailto: and geo links inside it are then unambiguously *the* way to
 * reach this business, and they match the LocalBusiness JSON-LD in the layout.
 *
 * Text colours are the light-surface pair the rest of the site uses: --muted
 * for the entries (7.1:1 on white) and --gold-ink for their hover state
 * (4.99:1), since the raw brand gold only manages 2.54:1 and is reserved here
 * for the icons, which carry no meaning of their own.
 */
export function ContactDetails() {
  return (
    <div>
      <h2 className="font-heading text-[length:var(--text-h3)] text-ink">
        {contact.detailsHeading}
      </h2>

      {/* not-italic: the UA stylesheet italicises <address>, and the semantics
          are the reason it is here — the slant is not wanted with them. */}
      <address className="mt-5 not-italic">
        <ul className="space-y-1">
          <li>
            <a
              href={`tel:${site.phoneHref}`}
              aria-label={`${contact.labels.call}: ${site.phone}`}
              className="inline-flex min-h-11 items-center gap-3.5 text-muted transition-colors hover:text-gold-ink"
            >
              <Phone aria-hidden="true" className="size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
              <span dir="ltr">{site.phone}</span>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${site.email}`}
              aria-label={`${contact.labels.email}: ${site.email}`}
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
              aria-label={`${site.address.formatted} — ${contact.labels.maps}`}
              className="inline-flex min-h-11 items-start gap-3.5 py-2.5 text-muted transition-colors hover:text-gold-ink"
            >
              <MapPin aria-hidden="true" className="mt-1 size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
              {site.address.formatted}
            </a>
          </li>
          <li>
            {/* Opening hours are not a contact method, but they answer the same
                question ("can I reach her now?") and belong beside the phone
                number. <time> would be wrong: this is a recurring schedule, not
                a date, and the machine-readable form of it is the
                openingHoursSpecification already in the LocalBusiness JSON-LD. */}
            <span className="inline-flex min-h-11 items-center gap-3.5 text-muted">
              <Clock aria-hidden="true" className="size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
              {site.openingHoursDisplay}
            </span>
          </li>
        </ul>

      </address>

      {/* A second <address>, not a continuation of the first. The element's
          content model forbids heading content inside it, so the "Social"
          heading cannot live in the block above — and a social profile is
          still a way to reach the salon, so the link itself belongs in an
          address rather than outside one. Sibling address elements are fine;
          only nesting them is not. */}
      <div className="mt-7 border-t border-line pt-6">
        <h3 className="eyebrow">{contact.socialHeading}</h3>
        <address className="not-italic">
          <a
            href={site.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.social.facebookLabel} — ${contact.labels.facebook}`}
            className="mt-2 inline-flex min-h-11 items-center gap-3.5 text-muted transition-colors hover:text-gold-ink"
          >
            <FacebookIcon className="size-[18px] shrink-0 text-gold" />
            {site.social.facebookLabel}
          </a>
        </address>
      </div>
    </div>
  );
}
