import { FacebookIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/ui/Icons';
import { GoldRule } from '@/components/ui/GoldRule';
import { contact } from '@/content/pages/contact';
import { site } from '@/content/site';

export function ContactDetails() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="eyebrow">{contact.detailsHeading}</h2>
        <GoldRule className="mt-3" />

        <ul className="mt-5 space-y-3">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-11 items-center gap-3 break-all text-ink transition-colors hover:text-gold-ink"
            >
              <MailIcon className="size-5 shrink-0 text-gold" />
              {site.email}
            </a>
          </li>
          <li>
            <a
              href={`tel:${site.phoneHref}`}
              className="inline-flex min-h-11 items-center gap-3 text-ink transition-colors hover:text-gold-ink"
            >
              <PhoneIcon className="size-5 shrink-0 text-gold" />
              <span dir="ltr">{site.phone}</span>
            </a>
          </li>
          <li>
            <a
              href={site.social.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-start gap-3 py-2 text-ink transition-colors hover:text-gold-ink"
            >
              <PinIcon className="mt-0.5 size-5 shrink-0 text-gold" />
              {site.address.formatted}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="eyebrow">{contact.socialHeading}</h2>
        <GoldRule className="mt-3" />

        <a
          href={site.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-3 text-ink transition-colors hover:text-gold-ink"
        >
          <FacebookIcon className="size-5 shrink-0 text-gold" />
          {site.social.facebookLabel}
        </a>
      </div>
    </div>
  );
}
