

import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';
import { MANIFEST_PATH, OUT_DIR, RAW_ASSETS, RAW_DIR, RESPONSIVE_WIDTHS } from './assets.ts';

const AVIF = { quality: 55, effort: 6 } as const;
const WEBP = { quality: 78, effort: 5 } as const;

const AVIF_DECORATIVE = { quality: 32, effort: 6 } as const;
const WEBP_DECORATIVE = { quality: 55, effort: 5 } as const;

export type ImageEntry = {

  width: number;

  height: number;

  widths: number[];
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir('lib', { recursive: true });

  const files = await readdir(RAW_DIR);
  const bySlug = new Map(files.map((f) => [basename(f, extname(f)), f]));
  const manifest: Record<string, ImageEntry> = {};
  let bytes = 0;

  for (const asset of RAW_ASSETS) {
    const file = bySlug.get(asset.slug);
    if (!file) throw new Error(`Missing raw asset for "${asset.slug}" — run npm run assets:fetch`);

    const input = join(RAW_DIR, file);
    const meta = await sharp(input).metadata();
    if (!meta.width || !meta.height) throw new Error(`Unreadable dimensions for ${input}`);

    const ceiling = Math.min(asset.maxWidth ?? Infinity, meta.width);

    const widths = asset.fixedWidth
      ? [Math.min(asset.fixedWidth, meta.width)]
      : RESPONSIVE_WIDTHS.filter((w) => w <= ceiling);

    if (widths.length === 0) widths.push(ceiling);

    const [avifOpts, webpOpts] = asset.decorative
      ? [AVIF_DECORATIVE, WEBP_DECORATIVE]
      : [AVIF, WEBP];

    for (const width of widths) {
      const pipeline = sharp(input).resize({ width, withoutEnlargement: true });

      for (const [ext, options] of [
        ['avif', avifOpts],
        ['webp', webpOpts],
      ] as const) {
        const out = join(OUT_DIR, `${asset.slug}-${width}.${ext}`);
        const info = await pipeline.clone().toFormat(ext, options).toFile(out);
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
  const mark = join(RAW_DIR, 'mark.png');

  const base = sharp(mark).flatten({ background: '#ffffff' });

  await base.clone().resize(180, 180, { fit: 'contain', background: '#ffffff' })
    .png().toFile('src/app/apple-icon.png');

  await base.clone().resize(32, 32, { fit: 'contain', background: '#ffffff' })
    .png().toFile('src/app/icon.png');

  await base.clone().resize(192, 192, { fit: 'contain', background: '#ffffff' })
    .png().toFile('public/icon-192.png');

  await base.clone().resize(512, 512, { fit: 'contain', background: '#ffffff' })
    .png().toFile('public/icon-512.png');

  console.log('  icons                  src/app/icon.png, src/app/apple-icon.png, public/icon-{192,512}.png');
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
