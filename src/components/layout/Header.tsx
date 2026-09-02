'use client';

import { Clock, Phone } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/FacebookIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileNav } from '@/components/layout/MobileNav';
import { Picture } from '@/components/ui/Picture';
import { homeItem, navItems } from '@/content/nav';
import { site } from '@/content/site';
import { useScrolledPast } from '@/lib/hooks/useScrolledPast';

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(24);

  return (
    <>
      {
}
      <div className="hidden bg-ink-deep text-[0.8125rem] text-cream-muted md:block">
        <div className="container-page flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${site.phoneHref}`}
              className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold"
            >
              <Phone aria-hidden="true" className="size-3.5 text-gold" strokeWidth={1.8} />
              <span dir="ltr">{site.phone}</span>
            </a>
            <span className="inline-flex min-h-11 items-center gap-2">
              <Clock aria-hidden="true" className="size-3.5 text-gold" strokeWidth={1.8} />
              {site.openingHoursDisplay}
            </span>
          </div>
          <a
            href={site.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold"
          >
            <FacebookIcon className="size-3.5 text-gold" />
            {site.social.facebookLabel}
          </a>
        </div>
      </div>

      <header
        data-scrolled={scrolled || undefined}
        className="sticky top-0 z-40 border-b border-transparent bg-surface/85 backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-(--dur-base) ease-smooth data-scrolled:border-line data-scrolled:bg-surface/95 data-scrolled:shadow-[0_1px_20px_rgb(44_40_40_/_0.07)]"
      >
        <div className="container-page flex items-center justify-between gap-4 py-4 sm:py-3">
          <Link
            href={homeItem.href}
            aria-label={`${site.legalName} — ${homeItem.label}`}
            className="flex min-h-11 shrink-0 items-center"
          >
            <Picture
              slug="logo"
              alt=""
              sizes="220px"
              className="h-13 w-auto transition-[height] duration-(--dur-base) ease-smooth sm:h-14 in-data-scrolled:h-11 sm:in-data-scrolled:h-11"
            />
          </Link>

          <nav aria-label="Főmenü" className="hidden lg:block">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className="group relative inline-flex min-h-11 items-center px-3 font-body text-[0.9375rem] font-semibold tracking-wide text-ink transition-colors duration-(--dur-quick) ease-smooth hover:text-gold-ink aria-[current=page]:text-gold-ink"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3 bottom-1 h-px origin-center bg-gold transition-transform duration-(--dur-quick) ease-smooth ${
                          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={`tel:${site.phoneHref}`}
            className="hidden min-h-11 items-center gap-2 rounded-full bg-gold px-5 font-body text-sm font-semibold tracking-wide text-ink-deep shadow-[var(--shadow-card)] transition-all duration-(--dur-base) ease-smooth hover:-translate-y-0.5 hover:bg-gold-ink hover:text-surface lg:inline-flex"
          >
            <Phone aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Időpontfoglalás
          </a>

          <MobileNav pathname={pathname} />
        </div>
      </header>
    </>
  );
}
