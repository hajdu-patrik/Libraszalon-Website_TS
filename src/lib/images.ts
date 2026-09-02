

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

export function srcSet(slug: ImageSlug, format: 'avif' | 'webp'): string {
  return getImage(slug)
    .widths.map((w) => `/images/${slug}-${w}.${format} ${w}w`)
    .join(', ');
}

export function fallbackSrc(slug: ImageSlug): string {
  const { widths } = getImage(slug);
  return `/images/${slug}-${widths[widths.length - 1]}.webp`;
}
