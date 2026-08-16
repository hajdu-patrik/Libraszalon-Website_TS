import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

/** Required so the route file is emitted as a flat file under output: 'export'. */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
