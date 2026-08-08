import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'outline';
  icon?: ReactNode;
  className?: string;
};

/**
 * Call-to-action link. Every variant clears a 44px hit area so it stays
 * comfortably tappable on a phone.
 */
export function Button({
  href,
  children,
  variant = 'solid',
  icon,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex min-h-11 items-center justify-center gap-2.5 rounded px-6 py-3 font-heading text-base font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 active:translate-y-0';

  const styles =
    variant === 'solid'
      ? 'bg-ink text-surface shadow-[var(--shadow-card)] hover:bg-gold-ink hover:shadow-[var(--shadow-lift)]'
      : 'border border-line bg-surface text-ink hover:border-gold hover:text-gold-ink';

  // mailto:/tel: bypass the router; next/link would try to prefetch them.
  const isExternal = /^(mailto:|tel:|https?:)/.test(href);
  const Tag = isExternal ? 'a' : Link;

  return (
    <Tag
      href={href}
      className={`${base} ${styles} ${className}`}
      {...(href.startsWith('http') && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
    >
      {icon}
      {children}
    </Tag>
  );
}
