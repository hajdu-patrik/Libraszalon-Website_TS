'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Clock, Mail, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { navItems } from '@/content/nav';
import { site } from '@/content/site';
import { useHasMounted } from '@/lib/hooks/useHasMounted';

type MobileNavProps = {
  pathname: string;
};

/**
 * Slide-in menu drawer.
 *
 * Framer Motion mounts the drawer only while it is open, which also solves an
 * old layout problem for free: a permanently rendered off-canvas panel counts
 * toward the document's scroll width and shows up as horizontal overflow.
 *
 * The drawer carries its own close button. The toggle in the header has
 * `relative z-50` on it, which is what that was for: fold the bars into an X
 * and let the same control close what it opened. It has not been able to do
 * that since the overlay was portalled. The header is a stacking context of
 * its own (position: sticky plus backdrop-filter), so the toggle's z-50 is
 * spent inside the header's z-40 — and the portalled overlay, also z-40 but
 * later in the document, paints over the whole thing. Measured at 393px the
 * panel runs from x=47 to the right edge and the toggle sits at 337: fully
 * covered, so the X was drawn every time and seen none of them, and the one
 * gesture every drawer on the web answers to did nothing.
 *
 * Raising the header instead would put a translucent white bar across the top
 * of a dark panel, so the close control moves inside the panel where it is
 * unambiguously part of it. The toggle keeps its fold animation: it is correct
 * for the state it describes, and it is what shows if the stacking ever changes.
 *
 * The overlay is portalled to <body> rather than rendered where it is declared,
 * and that is load-bearing, not tidiness. The sticky header carries
 * `backdrop-blur-md`, and backdrop-filter makes an element a containing block
 * for its fixed-position descendants — exactly like transform does. Left in
 * place, the drawer's `fixed inset-0` resolved against the header's own box
 * instead of the viewport, so the full-height panel collapsed into a 320x68
 * stub pinned over the header. Portalling moves it out of that subtree, which
 * is the only fix that does not cost the header its blur.
 */
export function MobileNav({ pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  // Close whenever the route changes, otherwise the drawer stays open over the
  // page the visitor just navigated to. Adjusted during render rather than in
  // an effect so the stale open drawer is never committed.
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

  // The portal target only exists in the browser, so the first client render
  // has to match the server's (no overlay) before it can be used.
  const mounted = useHasMounted();

  const overlay = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <motion.div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="absolute inset-0 bg-ink-deep/40 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Főmenü"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 right-0 flex w-[min(23rem,88vw)] flex-col overflow-y-auto bg-ink-deep px-7 pt-28 pb-10 text-cream-text shadow-[var(--shadow-lift)]"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Menü bezárása"
              className="absolute top-4 right-5 inline-flex size-12 items-center justify-center rounded-full text-cream-muted transition-colors hover:text-gold"
            >
              <X aria-hidden="true" className="size-6" strokeWidth={1.6} />
            </button>

            <nav aria-label="Mobil főmenü">
              <ul className="flex flex-col">
                {navItems.map((item, index) => {
                  const active = pathname === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={reduced ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                        delay: reduced ? 0 : 0.08 + index * 0.045,
                      }}
                      className="border-b border-cream-text/10 last:border-b-0"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`flex min-h-15 items-center font-heading text-[1.75rem] transition-colors hover:text-gold ${
                          active ? 'text-gold' : 'text-cream-text'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : 0.3 }}
              className="mt-auto space-y-1 pt-10"
            >
              <a
                href={`tel:${site.phoneHref}`}
                className="flex min-h-11 items-center gap-3 text-cream-muted transition-colors hover:text-gold"
              >
                <Phone aria-hidden="true" className="size-5 shrink-0 text-gold" strokeWidth={1.8} />
                <span dir="ltr">{site.phone}</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex min-h-11 items-center gap-3 break-all text-cream-muted transition-colors hover:text-gold"
              >
                <Mail aria-hidden="true" className="size-5 shrink-0 text-gold" strokeWidth={1.8} />
                {site.email}
              </a>
              <span className="flex min-h-11 items-center gap-3 text-cream-muted">
                <Clock aria-hidden="true" className="size-5 shrink-0 text-gold" strokeWidth={1.8} />
                {site.openingHoursDisplay}
              </span>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
        className="relative z-50 -mr-2.5 inline-flex size-12 items-center justify-center rounded text-ink lg:hidden"
      >
        <span className="sr-only">{open ? 'Menü bezárása' : 'Menü megnyitása'}</span>
        {/* Three bars that fold into an X.

            18x28 of 2px bars, not 16x24 of hairlines. A 1px rule on a phone at
            2.75x device pixel ratio is drawn under three device pixels, and
            next to a 52px logo it read as a smudge rather than the only
            control on the header — the one thing on a phone the whole
            navigation is behind.

            Every bar is positioned from its own centre (top + -translate-y-1/2)
            rather than from its top edge. With hairlines the difference was
            half a pixel and nobody noticed; at 2px the two rotated bars would
            cross 1px above the middle bar's line and the X would sit visibly
            askew. The closed positions are given in the same terms so `top`
            has a value to animate between at both ends. */}
        <span aria-hidden="true" className="relative block h-[1.125rem] w-7">
          <span
            className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-(--dur-quick) ease-smooth ${
              open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-px -translate-y-1/2'
            }`}
          />
          <span
            className={`absolute top-1/2 left-0 block h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-all duration-(--dur-quick) ease-smooth ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-(--dur-quick) ease-smooth ${
              open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[calc(100%-1px)] -translate-y-1/2'
            }`}
          />
        </span>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
