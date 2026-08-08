/**
 * Typed access to the generated image manifest.
 *
 * scripts/optimize-images.ts writes images.manifest.json alongside the AVIF and
 * WebP renditions in public/images. Everything the UI needs to render a correct
 * <picture> — intrinsic size and which widths exist — comes from here, which is
 * what lets every image ship with width/height and keep layout shift at zero.
 */

import manifest from './images.manifest.json';

export type ImageSlug = keyof typeof manifest;

export type ImageMeta = {
  width: number;
  height: number;
  widths: number[];
};

export function getImage(slug: ImageSlug): ImageMeta {
  const entry = manifest[slug] as ImageMeta | undefined;
  if (!entry) {
    throw new Error(
      `Unknown image "${slug}". Add it to scripts/assets.ts and re-run npm run assets.`,
    );
  }
  return entry;
}

/** srcset string for one format, e.g. "/images/hero-320.avif 320w, ..." */
export function srcSet(slug: ImageSlug, format: 'avif' | 'webp'): string {
  return getImage(slug)
    .widths.map((w) => `/images/${slug}-${w}.${format} ${w}w`)
    .join(', ');
}

/** Largest rendition, used as the <img src> fallback. */
export function fallbackSrc(slug: ImageSlug): string {
  const { widths } = getImage(slug);
  return `/images/${slug}-${widths[widths.length - 1]}.webp`;
}
