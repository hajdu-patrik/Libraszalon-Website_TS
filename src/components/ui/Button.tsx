import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = {
  href: string;
  children: ReactNode;

variant?: 'gold' | 'dark' | 'outline' | 'outline-light';
  icon?: ReactNode;
  className?: string;
};

export function Button({
  href,
  children,
  variant = 'gold',
  icon,
  className = '',
}: ButtonProps) {
  const base =
    'group/btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 font-body text-[length:var(--text-ui)] font-semibold tracking-wide transition-[background-color,color,border-color,transform,box-shadow] duration-(--dur-base) ease-smooth hover:-translate-y-0.5 active:translate-y-0';

  const styles = {

    gold: 'bg-gold text-ink-deep shadow-[var(--shadow-card)] hover:bg-gold-ink hover:text-surface hover:shadow-[var(--shadow-lift)]',
    dark: 'bg-ink text-cream-text shadow-[var(--shadow-card)] hover:bg-gold-ink hover:shadow-[var(--shadow-lift)]',
    outline:
      'border border-ink/25 bg-transparent text-ink hover:border-gold-ink hover:text-gold-ink',
    'outline-light':
      'border border-cream-text/40 bg-transparent text-cream-text hover:border-gold hover:text-gold',
  }[variant];

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
      {icon && (
        <span
          aria-hidden="true"
          className="transition-transform duration-(--dur-quick) ease-smooth group-hover/btn:translate-x-0.5"
        >
          {icon}
        </span>
      )}
      {children}
    </Tag>
  );
}
