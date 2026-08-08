/**
 * Inline SVG icons.
 *
 * Hand-drawn rather than pulled from an icon package: the site needs eight
 * glyphs, and inlining them costs nothing while keeping the bundle free of a
 * dependency. All are 24x24 on a 1.6 stroke to match the light weight of the
 * typography.
 */

type IconProps = { className?: string; style?: React.CSSProperties };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 6.5L21 6" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.2 3.5h3l1.5 3.8-2 1.4a12 12 0 0 0 5.6 5.6l1.4-2 3.8 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14.5 8.5h2.2V5.6h-2.4c-2.2 0-3.6 1.4-3.6 3.7v1.9H8.4v2.9h2.3V21h3v-6.9h2.3l.4-2.9h-2.7V9.7c0-.8.3-1.2.8-1.2Z" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M15 5.5 8.5 12l6.5 6.5" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 5.5 15.5 12 9 18.5" />
    </svg>
  );
}

export function ArrowUpIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 19V5.5M5.5 12 12 5.5 18.5 12" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function MapIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 4.5 3.5 6.8v12.7L9 17.2l6 2.3 5.5-2.3V4.5L15 6.8Z" />
      <path d="M9 4.5v12.7M15 6.8v12.7" />
    </svg>
  );
}

/** Solid star used by the review ratings. */
export function StarIcon({ className, style }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      style={style}
    >
      <path d="m12 2.6 2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.44l-5.8 3.06 1.1-6.47-4.7-4.58 6.5-.95Z" />
    </svg>
  );
}
