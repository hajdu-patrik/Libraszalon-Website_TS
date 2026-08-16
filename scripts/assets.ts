/**
 * Shared asset manifest.
 *
 * Every image on the site originates from the legacy WordPress install at
 * libraszalon.hu. This map is the single source of truth for the mapping
 * between the WordPress upload path and the friendly slug the site uses.
 *
 * `slug` becomes the filename stem under assets/raw/ and public/images/.
 */

export const WP_UPLOADS = 'https://libraszalon.hu/wp-content/uploads';

export type RawAsset = {
  /** Path relative to WP_UPLOADS. */
  src: string;
  /** Friendly filename stem used everywhere downstream. */
  slug: string;
  /**
   * Render at a single width instead of the full responsive ladder.
   * For icons and avatars that are always drawn at a small, fixed size —
   * the originals are wildly oversized (the male avatar ships at 1920px
   * for a 40px slot).
   */
  fixedWidth?: number;
  /** Cap the responsive ladder. The logo never renders above ~220px. */
  maxWidth?: number;
  /**
   * Decorative page background, drawn at very low opacity behind content.
   * Compressed harder because detail is invisible at 8% opacity.
   */
  decorative?: boolean;
};

export const RAW_ASSETS: RawAsset[] = [
  // Brand
  { src: '2024/02/cropped-Libraszalon-logo-1.webp', slug: 'logo', maxWidth: 320 },
  { src: '2024/03/cropped-Logo.png', slug: 'mark', fixedWidth: 512 },

  // Hero / social preview
  { src: '2024/02/Devenyi-Krisztina-masszazs-17.webp', slug: 'hero' },

  // Home service cards.
  // The photographs match the order the legacy page used them in:
  // 23 is the essential-oil bottle, 43 the Swedish stroke, 47 the cupping glass.
  { src: '2024/02/Devenyi-Krisztina-masszazs-23.webp', slug: 'service-aromatherapy', maxWidth: 960 },
  { src: '2024/02/Devenyi-Krisztina-masszazs-43.webp', slug: 'service-swedish', maxWidth: 960 },
  { src: '2024/02/Devenyi-Krisztina-masszazs-47.webp', slug: 'service-cupping', maxWidth: 960 },
  { src: '2024/02/Ajandek-utalvany.webp', slug: 'service-voucher', maxWidth: 960 },

  // Review avatars — line art, always drawn at ~40px
  { src: '2024/02/Ferfi.webp', slug: 'avatar-male', fixedWidth: 128 },
  { src: '2024/02/No.webp', slug: 'avatar-female', fixedWidth: 128 },

  // About page
  { src: '2024/02/Devenyi-Krisztina-masszazs-2.webp', slug: 'about-portrait', maxWidth: 1280 },
  { src: '2024/02/Devenyi-Krisztina-masszazs-3.webp', slug: 'about-room', maxWidth: 1280 },
  { src: '2024/02/Devenyi-Krisztina-masszazs-84.webp', slug: 'about-detail', maxWidth: 1280 },
  { src: '2024/02/Muanyag-kopoly-scaled.webp', slug: 'cupping-plastic', maxWidth: 960 },
  { src: '2024/02/Szilikon-kopoly-scaled.webp', slug: 'cupping-silicone', maxWidth: 960 },
  { src: '2024/02/quotes-01.png', slug: 'quote-mark', fixedWidth: 160 },

  // House rules
  { src: '2024/02/Berlet-10-alkalom-1.webp', slug: 'pass-front', maxWidth: 960 },
  { src: '2024/02/Berlet-10-alkalom-2.webp', slug: 'pass-back', maxWidth: 960 },

  // Contact
  { src: '2024/02/Nevjegy.webp', slug: 'business-card', maxWidth: 960 },

  // Decorative page backgrounds — drawn at ~8% opacity behind content
  { src: '2024/02/Devenyi-Krisztina-masszazs-54-scaled.webp', slug: 'bg-home', decorative: true },
  { src: '2024/02/Devenyi-Krisztina-masszazs-69-scaled.webp', slug: 'bg-about', decorative: true },
  { src: '2024/02/Devenyi-Krisztina-masszazs-46.webp', slug: 'bg-prices', decorative: true },
  { src: '2024/02/Devenyi-Krisztina-masszazs-75.jpg', slug: 'bg-prices-alt', decorative: true },
  { src: '2024/02/Devenyi-Krisztina-masszazs-3-scaled.webp', slug: 'bg-first-massage', decorative: true },
];

/** Widths generated for each responsive asset. Never upscales past the original. */
export const RESPONSIVE_WIDTHS = [320, 640, 960, 1280, 1920] as const;

export const RAW_DIR = 'assets/raw';
export const OUT_DIR = 'public/images';
export const MANIFEST_PATH = 'src/lib/images.manifest.json';
