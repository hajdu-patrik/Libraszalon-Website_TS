import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = {
  href: string;
  children: ReactNode;
  /**
   * gold — primary action on any surface;
   * dark — secondary on light surfaces;
   * outline — tertiary on light surfaces;
   * outline-light — secondary on dark surfaces.
   */
  variant?: 'gold' | 'dark' | 'outline' | 'outline-light';
  icon?: ReactNode;
  className?: string;
};

/**
 * Call-to-action link. Pill-shaped, with the icon nudging forward on hover.
 * Every variant clears a 44px hit area so it stays comfortably tappable.
 */
export function Button({
  href,
  children,
  variant = 'gold',
  icon,
  className = '',
}: ButtonProps) {
  const base =
    'group/btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 font-body text-[0.9375rem] font-semibold tracking-wide transition-[background-color,color,border-color,transform,box-shadow] duration-(--dur-base) ease-smooth hover:-translate-y-0.5 active:translate-y-0';

  const styles = {
    // Ink on gold clears 5.7:1; the hover deepens to the text-safe gold step.
    gold: 'bg-gold text-ink-deep shadow-[var(--shadow-card)] hover:bg-gold-ink hover:text-surface hover:shadow-[var(--shadow-lift)]',
    dark: 'bg-ink text-cream-text shadow-[var(--shadow-card)] hover:bg-gold-ink hover:shadow-[var(--shadow-lift)]',
    outline:
      'border border-ink/25 bg-transparent text-ink hover:border-gold-ink hover:text-gold-ink',
    'outline-light':
      'border border-cream-text/40 bg-transparent text-cream-text hover:border-gold hover:text-gold',
  }[variant];

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
