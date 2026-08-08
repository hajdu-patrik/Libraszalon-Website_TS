/**
 * Downloads every original image from the legacy WordPress install into
 * assets/raw/. Run once (or whenever an original changes upstream):
 *
 *   npm run assets:fetch
 *
 * assets/raw/ is gitignored — it is only an input to optimize-images.ts,
 * whose output (public/images/) is what actually ships.
 */

import { mkdir, writeFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { RAW_ASSETS, RAW_DIR, WP_UPLOADS } from './assets.ts';

async function exists(path: string) {
  try {
    const s = await stat(path);
    return s.size > 0;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;

  for (const asset of RAW_ASSETS) {
    const dest = join(RAW_DIR, asset.slug + extname(asset.src));

    if (await exists(dest)) {
      skipped++;
      continue;
    }

    const url = `${WP_UPLOADS}/${asset.src}`;
    const res = await fetch(url, {
      headers: { 'user-agent': 'libraszalon-asset-migration/1.0' },
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText} for ${url}`);
    }

    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.byteLength === 0) {
      throw new Error(`Empty response for ${url}`);
    }

    await writeFile(dest, bytes);
    downloaded++;
    console.log(`  ${asset.slug.padEnd(22)} ${(bytes.byteLength / 1024).toFixed(0).padStart(6)} KB`);
  }

  console.log(`\nDownloaded ${downloaded}, already present ${skipped}, total ${RAW_ASSETS.length}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
