'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MobileNav } from '@/components/layout/MobileNav';
import { Picture } from '@/components/ui/Picture';
import { homeItem, navItems } from '@/content/nav';
import { site } from '@/content/site';

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
    <header
      data-scrolled={scrolled || undefined}
      className="sticky top-0 z-40 border-b border-transparent bg-surface/80 backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 ease-[var(--ease-out-expo)] data-scrolled:border-line data-scrolled:bg-surface/92 data-scrolled:shadow-[0_1px_20px_rgb(44_40_40_/_0.06)]"
    >
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link
          href={homeItem.href}
          aria-label={`${site.legalName} — ${homeItem.label}`}
          className="group flex shrink-0 items-center"
        >
          <Picture
            slug="logo"
            alt=""
            sizes="220px"
            className="w-auto transition-[height] duration-300 ease-[var(--ease-out-expo)] h-11 group-hover:opacity-85 sm:h-14 in-data-scrolled:h-10 sm:in-data-scrolled:h-11"
          />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Főmenü" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className="group relative inline-flex min-h-11 items-center font-heading text-[1.0625rem] text-ink transition-colors duration-200 hover:text-gold-ink aria-[current=page]:text-gold-ink"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-0.5 h-px origin-center bg-gold transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileNav pathname={pathname} />
      </div>
    </header>
  );
}
