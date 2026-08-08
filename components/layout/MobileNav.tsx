'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { navItems } from '@/content/nav';
import { site } from '@/content/site';
import { MailIcon, PhoneIcon } from '@/components/ui/Icons';

type MobileNavProps = {
  pathname: string;
};

export function MobileNav({ pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close whenever the route changes, otherwise the drawer stays open over the
  // page the visitor just navigated to.
  //
  // Adjusted during render rather than in an effect: React re-runs this
  // component immediately with the new state and never commits the stale open
  // drawer, so there is no flash and no cascading render.
  const [routeWhenOpened, setRouteWhenOpened] = useState(pathname);
  if (routeWhenOpened !== pathname) {
    setRouteWhenOpened(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      // Keep focus inside the drawer while it is open.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
        className="relative z-50 -mr-2 inline-flex size-11 items-center justify-center rounded text-ink lg:hidden"
      >
        <span className="sr-only">{open ? 'Menü bezárása' : 'Menü megnyitása'}</span>
        <span aria-hidden="true" className="relative block h-4 w-6">
          {/* Three bars that fold into an X. */}
          <span
            className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-[var(--ease-out-expo)] ${
              open ? 'top-1/2 rotate-45' : 'top-0'
            }`}
          />
          <span
            className={`absolute top-1/2 left-0 block h-px w-full bg-current transition-all duration-200 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-[var(--ease-out-expo)] ${
              open ? 'top-1/2 -rotate-45' : 'top-full'
            }`}
          />
        </span>
      </button>

      {/*
        Viewport-sized clipping frame.

        Parking the drawer off-canvas with translate-x-full makes it stick out
        past the right edge, and a fixed element still counts toward the
        document's scroll width — which showed up as horizontal overflow on
        every page at every width. Clipping it inside an exactly-viewport-sized
        frame keeps the slide-in animation and removes the overflow entirely.
      */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden lg:hidden">
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className={`absolute inset-0 bg-ink/25 backdrop-blur-[2px] transition-opacity duration-300 ${
            open ? 'pointer-events-auto opacity-100' : 'opacity-0'
          }`}
        />

        {/* Drawer */}
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Főmenü"
          {...(!open && { inert: true })}
          className={`absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto bg-surface px-6 pt-24 pb-10 shadow-[var(--shadow-lift)] transition-transform duration-400 ease-[var(--ease-out-expo)] ${
            open ? 'pointer-events-auto translate-x-0' : 'translate-x-full'
          }`}
        >
        <nav aria-label="Mobil főmenü">
          <ul className="flex flex-col">
            {navItems.map((item, index) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      transitionDelay: open ? `${120 + index * 40}ms` : '0ms',
                    }}
                    className={`flex min-h-14 items-center font-heading text-lg transition-all duration-400 ease-[var(--ease-out-expo)] ${
                      open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    } ${active ? 'text-gold-ink' : 'text-ink'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto space-y-3 pt-10">
          <a
            href={`tel:${site.phoneHref}`}
            className="flex min-h-11 items-center gap-3 text-ink transition-colors hover:text-gold-ink"
          >
            <PhoneIcon className="size-5 shrink-0 text-gold" />
            <span dir="ltr">{site.phone}</span>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex min-h-11 items-center gap-3 break-all text-ink transition-colors hover:text-gold-ink"
          >
            <MailIcon className="size-5 shrink-0 text-gold" />
            {site.email}
          </a>
          </div>
        </div>
      </div>
    </>
  );
}
