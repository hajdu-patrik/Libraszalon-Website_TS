import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

/**
 * Builds public/images (AVIF + WebP at every width), src/lib/images.manifest.json, the
 * favicons and the Open Graph image from the originals in assets/raw. The originals were
 * migrated from the former WordPress site and stay out of git; each is named <slug>.<ext>.
 *
 * public/images and public/og are served with a one-year immutable cache, so a changed
 * picture needs a new slug, not just a re-run.
 */

type RawAsset = {
  slug: string;
  /** Emit this single width only (logo mark, avatars). */
  fixedWidth?: number;
  /** Stop the responsive set here when the slot is never wider. */
  maxWidth?: number;
  /** Section textures shown at 7% opacity, so they take far harder compression. */
  decorative?: boolean;
};

const RAW_ASSETS: RawAsset[] = [
  { slug: 'logo', maxWidth: 320 },
  { slug: 'mark', fixedWidth: 512 },
  { slug: 'hero' },
  { slug: 'service-aromatherapy', maxWidth: 960 },
  { slug: 'service-swedish', maxWidth: 960 },
  { slug: 'service-cupping', maxWidth: 960 },
  { slug: 'service-voucher', maxWidth: 960 },
  { slug: 'service-lymphatic', maxWidth: 960 },
  { slug: 'service-reflexology', maxWidth: 960 },
  { slug: 'avatar-male', fixedWidth: 128 },
  { slug: 'avatar-female', fixedWidth: 128 },
  { slug: 'about-portrait', maxWidth: 1280 },
  { slug: 'about-room', maxWidth: 1280 },
  { slug: 'about-detail', maxWidth: 1280 },
  { slug: 'bg-home', decorative: true },
  { slug: 'bg-about', decorative: true },
  { slug: 'bg-prices', decorative: true },
  { slug: 'bg-prices-alt', decorative: true },
  { slug: 'bg-first-massage', decorative: true },
];

const RESPONSIVE_WIDTHS = [320, 640, 960, 1280, 1920];

const RAW_DIR = 'assets/raw';
const OUT_DIR = 'public/images';
const MANIFEST_PATH = 'src/lib/images.manifest.json';

const QUALITY = {
  photo: { avif: { quality: 55, effort: 6 }, webp: { quality: 78, effort: 5 } },
  decorative: { avif: { quality: 32, effort: 6 }, webp: { quality: 55, effort: 5 } },
} as const;

type ManifestEntry = { width: number; height: number; widths: number[] };

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const files = await readdir(RAW_DIR);
  const bySlug = new Map(files.map((file) => [basename(file, extname(file)), file]));
  const manifest: Record<string, ManifestEntry> = {};
  let bytes = 0;

  for (const asset of RAW_ASSETS) {
    const file = bySlug.get(asset.slug);
    if (!file) throw new Error(`Missing original for "${asset.slug}" in ${RAW_DIR}`);

    const input = join(RAW_DIR, file);
    const meta = await sharp(input).metadata();
    if (!meta.width || !meta.height) throw new Error(`Unreadable dimensions for ${input}`);

    const ceiling = Math.min(asset.maxWidth ?? Infinity, meta.width);
    const widths = asset.fixedWidth
      ? [Math.min(asset.fixedWidth, meta.width)]
      : RESPONSIVE_WIDTHS.filter((width) => width <= ceiling);
    if (widths.length === 0) widths.push(ceiling);

    const quality = QUALITY[asset.decorative ? 'decorative' : 'photo'];

    for (const width of widths) {
      const pipeline = sharp(input).resize({ width, withoutEnlargement: true });
      for (const format of ['avif', 'webp'] as const) {
        const out = join(OUT_DIR, `${asset.slug}-${width}.${format}`);
        const info = await pipeline.clone().toFormat(format, quality[format]).toFile(out);
        bytes += info.size;
      }
    }

    const largest = widths[widths.length - 1];
    manifest[asset.slug] = {
      width: largest,
      height: Math.round((meta.height / meta.width) * largest),
      widths,
    };
    console.log(`  ${asset.slug.padEnd(22)} ${meta.width}x${meta.height}  ->  ${widths.join(', ')}`);
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  await buildIcons();
  await buildOgImage();

  console.log(`\n${Object.keys(manifest).length} assets, ${(bytes / 1024 / 1024).toFixed(2)} MB emitted.`);
}

async function buildIcons() {
  const base = sharp(join(RAW_DIR, 'mark.png')).flatten({ background: '#ffffff' });
  const targets: [number, string][] = [
    [32, 'src/app/icon.png'],
    [180, 'src/app/apple-icon.png'],
    [192, 'public/icon-192.png'],
    [512, 'public/icon-512.png'],
  ];

  for (const [size, out] of targets) {
    await base.clone().resize(size, size, { fit: 'contain', background: '#ffffff' }).png().toFile(out);
  }
  console.log(`  icons                  ${targets.map(([, out]) => out).join(', ')}`);
}

async function buildOgImage() {
  await mkdir('public/og', { recursive: true });
  await sharp(join(RAW_DIR, 'hero.webp'))
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile('public/og/default.jpg');
  console.log('  og                     public/og/default.jpg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
