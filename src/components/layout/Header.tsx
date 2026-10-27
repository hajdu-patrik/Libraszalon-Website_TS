import { Phone } from 'lucide-react';
import Link from 'next/link';
import { MobileNav } from '@/components/layout/MobileNav';
import { NavLinks } from '@/components/layout/NavLinks';
import { StickyHeader } from '@/components/layout/StickyHeader';
import { Button } from '@/components/ui/Button';
import { ContactList } from '@/components/ui/ContactList';
import { Picture } from '@/components/ui/Picture';
import { homeItem } from '@/content/nav';
import { site } from '@/content/site';
import { ui } from '@/content/ui';

export function Header() {
  return (
    <StickyHeader>
      <div className="tone-dark hidden h-11 text-[0.8125rem] md:block">
        <div className="container-page flex h-full items-center justify-between gap-6">
          <ContactList items={['phone', 'hours']} size="sm" className="flex items-center gap-6 text-subtle" />
          <ContactList items={['facebook']} size="sm" className="text-subtle" />
        </div>
      </div>

      <div className="border-b border-transparent bg-surface/85 backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-(--dur-base) ease-smooth in-data-scrolled:border-line in-data-scrolled:bg-surface/95 in-data-scrolled:shadow-header">
        <div className="container-page flex items-center justify-between gap-4 py-4 sm:py-3">
          <Link
            href={homeItem.href}
            aria-label={`${site.legalName} — ${homeItem.label}`}
            className="flex min-h-11 shrink-0 items-center"
          >
            <Picture
              slug="logo"
              alt=""
              sizes="77px"
              loading="eager"
              className="h-13 w-auto transition-[height] duration-(--dur-base) ease-smooth sm:h-14 in-data-scrolled:h-11 sm:in-data-scrolled:h-11"
            />
          </Link>

          <nav aria-label={ui.mainNav} className="hidden lg:block">
            <NavLinks />
          </nav>

          <div className="hidden lg:block">
            <Button
              href={`tel:${site.phoneHref}`}
              size="sm"
              icon={<Phone className="size-4" strokeWidth={1.8} />}
            >
              {ui.bookingCta}
            </Button>
          </div>

          <MobileNav />
        </div>
      </div>
    </StickyHeader>
  );
}
