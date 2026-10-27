'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '@/content/nav';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-2">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className="group relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-semibold tracking-wide transition-colors hover:text-accent aria-[current=page]:text-accent"
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
  );
}
