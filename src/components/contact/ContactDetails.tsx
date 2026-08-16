import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/FacebookIcon';
import { contact } from '@/content/pages/contact';
import { site } from '@/content/site';

/** Every way to reach the salon, gathered on one dark card. */
export function ContactDetails() {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-ink-deep p-7 text-cream-text shadow-[var(--shadow-lift)] sm:p-9">
      {/* Gold signature line across the top of the card. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent"
      />

      <h2 className="font-heading text-[length:var(--text-h3)] text-cream-text">
        {contact.detailsHeading}
      </h2>

      <ul className="mt-6 space-y-2">
        <li>
          <a
            href={`tel:${site.phoneHref}`}
            className="inline-flex min-h-11 items-center gap-3.5 text-cream-muted transition-colors hover:text-gold"
          >
            <Phone aria-hidden="true" className="size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
            <span dir="ltr">{site.phone}</span>
          </a>
        </li>
        <li>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center gap-3.5 break-all text-cream-muted transition-colors hover:text-gold"
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
            className="inline-flex min-h-11 items-start gap-3.5 py-2.5 text-cream-muted transition-colors hover:text-gold"
          >
            <MapPin aria-hidden="true" className="mt-1 size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
            {site.address.formatted}
          </a>
        </li>
        <li>
          <span className="inline-flex min-h-11 items-center gap-3.5 text-cream-muted">
            <Clock aria-hidden="true" className="size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
            {site.openingHoursDisplay}
          </span>
        </li>
      </ul>

      <div className="mt-8 border-t border-cream-text/10 pt-6">
        <h2 className="eyebrow-dark">{contact.socialHeading}</h2>
        <a
          href={site.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-3.5 text-cream-muted transition-colors hover:text-gold"
        >
          <FacebookIcon className="size-[18px] shrink-0 text-gold" />
          {site.social.facebookLabel}
        </a>
      </div>
    </div>
  );
}
