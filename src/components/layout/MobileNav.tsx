'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ContactList } from '@/components/ui/ContactList';
import { IconButton } from '@/components/ui/IconButton';
import { navItems } from '@/content/nav';
import { ui } from '@/content/ui';

/** Tailwind's `lg`: from here the header shows the inline nav and the drawer has no opener. */
const DESKTOP_QUERY = '(min-width: 64rem)';

const DRAWER_CLASS = [
  'tone-dark fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(23rem,88vw)] max-w-none overflow-y-auto overscroll-contain border-0 px-6 pt-28 pb-10 sm:px-7 shadow-lift',
  // A `display` class on a <dialog> beats the browser's `display: none` for a closed one,
  // so the flex column only applies while it is open.
  'open:flex open:flex-col',
  'translate-x-full transition-[translate,display,overlay] transition-discrete duration-(--dur-base) ease-smooth open:translate-x-0 starting:open:translate-x-full',
  'backdrop:bg-ink-deep/0 backdrop:backdrop-blur-[2px] backdrop:transition-[background-color,display,overlay] backdrop:transition-discrete backdrop:duration-(--dur-base) open:backdrop:bg-ink-deep/40 starting:open:backdrop:bg-ink-deep/0 motion-reduce:backdrop:transition-none',
].join(' ');

const ITEM_CLASS =
  'border-b border-cream-text/10 transition-[opacity,translate] duration-(--dur-base) ease-smooth last:border-b-0 starting:translate-x-4 starting:opacity-0 motion-reduce:transition-none';

function isInside(element: HTMLElement, x: number, y: number): boolean {
  const box = element.getBoundingClientRect();
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pressStartedInside = useRef(false);

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener('change', closeOnDesktop);
    return () => query.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={ui.menuOpen}
        className="-mr-2.5 inline-flex size-12 items-center justify-center rounded text-ink lg:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 28 18"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-[1.125rem] w-7"
        >
          <path d="M1 1h26M1 9h26M1 17h26" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label={ui.mainNav}
        onClose={(event) => {
          setOpen(false);
          // Safari neither focuses a button on click nor moves focus out of a closing dialog,
          // so hand it back here, unless something else (a page change) has already taken it.
          const { activeElement } = document;
          if (!activeElement || activeElement === document.body || event.currentTarget.contains(activeElement)) {
            toggleRef.current?.focus();
          }
        }}
        onPointerDown={(event) => {
          pressStartedInside.current = isInside(event.currentTarget, event.clientX, event.clientY);
        }}
        onClick={(event) => {
          // A click on the backdrop is reported on the dialog itself; a drag that began inside
          // (selecting the e-mail address) and ended outside must not count as one.
          const startedInside = pressStartedInside.current;
          pressStartedInside.current = false;
          if (
            event.target === event.currentTarget &&
            !startedInside &&
            !isInside(event.currentTarget, event.clientX, event.clientY)
          ) {
            close();
          }
        }}
        className={DRAWER_CLASS}
      >
        <IconButton
          onClick={close}
          aria-label={ui.menuClose}
          className="absolute top-4 right-5 text-cream-muted transition-colors hover:text-gold"
        >
          <X aria-hidden="true" className="size-6" strokeWidth={1.6} />
        </IconButton>

        <nav aria-label={ui.mobileNav}>
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li
                key={item.href}
                style={{ transitionDelay: `${80 + index * 45}ms` }}
                className={ITEM_CLASS}
              >
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="flex min-h-15 items-center font-heading text-[1.75rem] transition-colors hover:text-gold aria-[current=page]:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ContactList
          items={['phone', 'email', 'hours']}
          className="mt-auto space-y-1 pt-10 text-subtle transition-opacity delay-300 duration-(--dur-base) starting:opacity-0 motion-reduce:transition-none"
        />
      </dialog>
    </>
  );
}
