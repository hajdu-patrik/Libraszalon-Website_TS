import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

/** Required so `output: export` emits this as a static file rather than a route. */
export const dynamic = 'force-static';

/**
 * Web app manifest.
 *
 * Next emits this to /manifest.webmanifest and links it from every page, which
 * lets the site be installed to a home screen and gives Android/Chrome a proper
 * name, colours and icon instead of guessing from the favicon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.legalName} - ${site.name}`,
    short_name: site.name,
    description: site.tagline,
    lang: site.lang,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192', purpose: 'any' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512', purpose: 'any' },
    ],
  };
}
