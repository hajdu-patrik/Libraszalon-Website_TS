import type { ReactNode } from 'react';

/**
 * The shell the brand glyphs share.
 *
 * Lucide dropped its brand icons, so Facebook, GitHub and LinkedIn are drawn
 * here by hand. They were three files holding the same nine SVG attributes and
 * one different path each — which is three chances for a stroke width or a
 * linecap to drift, and three edits every time the set has to change. The
 * geometry that makes a glyph sit correctly next to a Lucide icon (24x24 box,
 * 1.8 stroke, round joins) is stated once, here; a new brand is a path.
 */
export function BrandIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
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
      {children}
    </svg>
  );
}
