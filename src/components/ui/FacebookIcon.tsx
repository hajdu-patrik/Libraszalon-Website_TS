/**
 * Lucide dropped its brand icons, so the Facebook glyph lives here as a small
 * inline SVG drawn to match the Lucide grid (24x24, 1.8 stroke).
 */

type FacebookIconProps = { className?: string };

export function FacebookIcon({ className }: FacebookIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
