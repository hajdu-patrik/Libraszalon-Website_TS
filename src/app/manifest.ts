import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { THEME_COLOR } from '@/lib/seo';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: `${site.legalName} - ${site.name}`,
    short_name: site.name,
    description: site.tagline,
    lang: site.lang,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: THEME_COLOR,
    icons: [
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192', purpose: 'any' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512', purpose: 'any' },
    ],
  };
}
