import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/FacebookIcon';
import { GoldSignature } from '@/components/ui/GoldSignature';
import { contact } from '@/content/pages/contact';
import { site } from '@/content/site';

export function ContactDetails() {
  return (
    /* Bordered, gold-capped card — the same shell the featured price card and
       the welcome notice use, so the panel reads as part of the set. */
    <div className="relative overflow-hidden rounded-2xl border border-line bg-cream p-6 shadow-[var(--shadow-card)] sm:p-7">
      <GoldSignature className="absolute inset-x-0 top-0" />

      <h2 className="font-heading text-[length:var(--text-h3)] text-ink">
        {contact.detailsHeading}
      </h2>

      {
}
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
            <span className="inline-flex min-h-11 items-center gap-3.5 text-muted">
              <Clock aria-hidden="true" className="size-[18px] shrink-0 text-gold" strokeWidth={1.8} />
              {site.openingHoursDisplay}
            </span>
          </li>
        </ul>

      </address>

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
