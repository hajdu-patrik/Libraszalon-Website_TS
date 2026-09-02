

export const WP_UPLOADS = 'https://libraszalon.hu/wp-content/uploads';

export type RawAsset = {

  src: string;

  slug: string;

fixedWidth?: number;

  maxWidth?: number;

decorative?: boolean;
};

export const RAW_ASSETS: RawAsset[] = [

  { src: '2024/02/cropped-Libraszalon-logo-1.webp', slug: 'logo', maxWidth: 320 },
  { src: '2024/03/cropped-Logo.png', slug: 'mark', fixedWidth: 512 },

{ src: '2024/02/Devenyi-Krisztina-masszazs-17.webp', slug: 'hero' },

{ src: '2024/02/Devenyi-Krisztina-masszazs-23.webp', slug: 'service-aromatherapy', maxWidth: 960 },
  { src: '2024/02/Devenyi-Krisztina-masszazs-43.webp', slug: 'service-swedish', maxWidth: 960 },
  { src: '2024/02/Devenyi-Krisztina-masszazs-47.webp', slug: 'service-cupping', maxWidth: 960 },
  { src: '2024/02/Ajandek-utalvany.webp', slug: 'service-voucher', maxWidth: 960 },

{ src: '2024/02/Ferfi.webp', slug: 'avatar-male', fixedWidth: 128 },
  { src: '2024/02/No.webp', slug: 'avatar-female', fixedWidth: 128 },

{ src: '2024/02/Devenyi-Krisztina-masszazs-2.webp', slug: 'about-portrait', maxWidth: 1280 },
  { src: '2024/02/Devenyi-Krisztina-masszazs-3.webp', slug: 'about-room', maxWidth: 1280 },
  { src: '2024/02/Devenyi-Krisztina-masszazs-84.webp', slug: 'about-detail', maxWidth: 1280 },
  { src: '2024/02/Muanyag-kopoly-scaled.webp', slug: 'cupping-plastic', maxWidth: 960 },
  { src: '2024/02/Szilikon-kopoly-scaled.webp', slug: 'cupping-silicone', maxWidth: 960 },
  { src: '2024/02/quotes-01.png', slug: 'quote-mark', fixedWidth: 160 },

{ src: '2024/02/Devenyi-Krisztina-masszazs-54-scaled.webp', slug: 'bg-home', decorative: true },
  { src: '2024/02/Devenyi-Krisztina-masszazs-69-scaled.webp', slug: 'bg-about', decorative: true },
  { src: '2024/02/Devenyi-Krisztina-masszazs-46.webp', slug: 'bg-prices', decorative: true },
  { src: '2024/02/Devenyi-Krisztina-masszazs-75.jpg', slug: 'bg-prices-alt', decorative: true },
  { src: '2024/02/Devenyi-Krisztina-masszazs-3-scaled.webp', slug: 'bg-first-massage', decorative: true },
];

export const RESPONSIVE_WIDTHS = [320, 640, 960, 1280, 1920] as const;

export const RAW_DIR = 'assets/raw';
export const OUT_DIR = 'public/images';
export const MANIFEST_PATH = 'src/lib/images.manifest.json';
