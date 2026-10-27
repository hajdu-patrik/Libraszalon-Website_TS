import type { ReactNode } from 'react';
import { SmartLink } from '@/components/ui/SmartLink';

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  icon?: ReactNode;
  className?: string;
};

const BASE =
  'group/btn inline-flex items-center justify-center rounded-full font-body font-semibold tracking-wide transition-[background-color,color,border-color,box-shadow,translate] duration-(--dur-base) ease-smooth hover:-translate-y-0.5 active:translate-y-0';

const SIZES = {
  md: 'min-h-12 gap-2.5 px-7 py-3 text-ui',
  sm: 'min-h-11 gap-2 px-5 text-sm',
} as const;

/** `outline` takes its colour from the surrounding text, so the same variant works on the
 *  light sections and on the dark hero. */
const VARIANTS = {
  gold: 'bg-gold text-ink-deep shadow-card hover:bg-gold-ink hover:text-surface hover:shadow-lift',
  outline: 'border border-current/35 hover:border-accent hover:text-accent',
} as const;

export function Button({
  href,
  children,
  variant = 'gold',
  size = 'md',
  icon,
  className = '',
}: ButtonProps) {
  return (
    <SmartLink href={href} className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}>
      {icon && (
        <span
          aria-hidden="true"
          className="transition-transform duration-(--dur-quick) ease-smooth group-hover/btn:translate-x-0.5"
        >
          {icon}
        </span>
      )}
      {children}
    </SmartLink>
  );
}
