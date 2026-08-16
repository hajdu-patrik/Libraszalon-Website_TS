'use client';

import { Clock, Phone } from 'lucide-react';
import { FacebookIcon } from '@/components/ui/FacebookIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MobileNav } from '@/components/layout/MobileNav';
import { Picture } from '@/components/ui/Picture';
import { homeItem, navItems } from '@/content/nav';
import { site } from '@/content/site';

/**
 * Utility bar + sticky header.
 *
 * The dark utility bar carries the phone number, hours and Facebook link and
 * scrolls away with the page; the white header beneath it stays pinned and
 * grows a hairline and shadow once the page moves.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Utility bar — desktop only; on a phone the same facts are one tap
          away in the menu drawer. */}
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
        className="sticky top-0 z-40 border-b border-transparent bg-surface/85 backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 ease-[var(--ease-out-expo)] data-scrolled:border-line data-scrolled:bg-surface/95 data-scrolled:shadow-[0_1px_20px_rgb(44_40_40_/_0.07)]"
      >
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <Link
            href={homeItem.href}
            aria-label={`${site.legalName} — ${homeItem.label}`}
            // min-h-11 on the link, not the image: the logo shrinks to 40px in
            // the scrolled state, and the tap target must not shrink with it.
            className="group flex min-h-11 shrink-0 items-center"
          >
            <Picture
              slug="logo"
              alt=""
              sizes="220px"
              className="h-11 w-auto transition-[height,opacity] duration-300 ease-[var(--ease-out-expo)] group-hover:opacity-85 sm:h-14 in-data-scrolled:h-10 sm:in-data-scrolled:h-11"
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Főmenü" className="hidden lg:block">
            {/* gap-2 + px-3 on the links, not bare gaps on text: the rhythm is
                the same, but "Árak" is 32px wide and needs the padding to
                reach a 44px target. */}
            <ul className="flex items-center gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className="group relative inline-flex min-h-11 items-center px-3 font-body text-[0.9375rem] font-semibold tracking-wide text-ink transition-colors duration-200 hover:text-gold-ink aria-[current=page]:text-gold-ink"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3 bottom-1 h-px origin-center bg-gold transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Booking CTA — the single action the whole site funnels toward. */}
          <a
            href={`tel:${site.phoneHref}`}
            className="hidden min-h-11 items-center gap-2 rounded-full bg-gold px-5 font-body text-sm font-semibold tracking-wide text-ink-deep shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-gold-ink hover:text-surface lg:inline-flex"
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
