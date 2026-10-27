import { Clock, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { FacebookIcon } from '@/components/ui/BrandIcons';
import { SmartLink } from '@/components/ui/SmartLink';
import { site } from '@/content/site';
import { ui } from '@/content/ui';

export type ContactKey = 'phone' | 'email' | 'address' | 'hours' | 'facebook';

type ContactEntry = {
  icon: LucideIcon | typeof FacebookIcon;
  label: ReactNode;
  href?: string;
  /** Read after the label by screen readers, where the visible text alone is ambiguous. */
  hint?: string;
  /** Long values wrap, so the icon aligns with the first line instead of the middle. */
  wraps?: boolean;
};

const ENTRIES: Record<ContactKey, ContactEntry> = {
  phone: { icon: Phone, label: <span dir="ltr">{site.phone}</span>, href: `tel:${site.phoneHref}` },
  email: { icon: Mail, label: <span className="break-all">{site.email}</span>, href: `mailto:${site.email}` },
  address: {
    icon: MapPin,
    label: site.address.formatted,
    href: site.social.googleMaps,
    hint: ui.mapsHint,
    wraps: true,
  },
  hours: { icon: Clock, label: site.openingHoursDisplay },
  facebook: {
    icon: FacebookIcon,
    label: site.social.facebookLabel,
    href: site.social.facebook,
    hint: ui.facebookHint,
  },
};

const SIZES = {
  sm: { row: 'gap-2', icon: 'size-3.5' },
  md: { row: 'gap-3.5', icon: 'size-5' },
} as const;

type ContactListProps = {
  items: readonly ContactKey[];
  size?: keyof typeof SIZES;
  className?: string;
};

/** The salon's contact details as icon rows; text colour comes from the surrounding
 *  surface and links turn to the surface's accent colour on hover. */
export function ContactList({ items, size = 'md', className = '' }: ContactListProps) {
  const { row, icon } = SIZES[size];

  return (
    <ul className={className}>
      {items.map((key) => {
        const { icon: Icon, label, href, hint, wraps } = ENTRIES[key];
        const rowClass = `inline-flex min-h-11 ${row} ${wraps ? 'items-start py-2.5' : 'items-center'}`;
        const content = (
          <>
            <Icon
              aria-hidden="true"
              strokeWidth={1.8}
              className={`${icon} shrink-0 text-gold ${wraps ? 'mt-1' : ''}`}
            />
            {label}
            {hint && <span className="sr-only"> – {hint}</span>}
          </>
        );

        return (
          <li key={key}>
            {href ? (
              <SmartLink href={href} className={`${rowClass} transition-colors hover:text-accent`}>
                {content}
              </SmartLink>
            ) : (
              <span className={rowClass}>{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
