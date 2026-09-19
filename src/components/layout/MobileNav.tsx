'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Clock, Mail, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '@/components/ui/IconButton';
import { navItems } from '@/content/nav';
import { site } from '@/content/site';
import { useHasMounted } from '@/lib/hooks/useHasMounted';

type MobileNavProps = {
  pathname: string;
};

export function MobileNav({ pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

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

const mounted = useHasMounted();

  const overlay = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 overflow-hidden lg:hidden">
          <motion.div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="absolute inset-0 bg-ink-deep/40 backdrop-blur-[2px]"
          />

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
            <IconButton
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Menü bezárása"
              className="absolute top-4 right-5 text-cream-muted transition-colors hover:text-gold"
            >
              <X aria-hidden="true" className="size-6" strokeWidth={1.6} />
            </IconButton>

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
        <span aria-hidden="true" className="relative block h-[1.125rem] w-7">
          <span
            className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-[top,rotate] duration-(--dur-quick) ease-smooth ${
              open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-px -translate-y-1/2'
            }`}
          />
          <span
            className={`absolute top-1/2 left-0 block h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-(--dur-quick) ease-smooth ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-[top,rotate] duration-(--dur-quick) ease-smooth ${
              open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[calc(100%-1px)] -translate-y-1/2'
            }`}
          />
        </span>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
