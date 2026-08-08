import type { MetadataRoute } from 'next';
import { allPageSeo } from '@/content/seo';
import { site } from '@/content/site';

/**
 * Static export writes this to /sitemap.xml at build time.
 * lastModified tracks the build, which is accurate for a site whose content
 * only changes when the repository does.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return allPageSeo.map((page) => ({
    url: `${site.url}${page.path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: page.priority,
  }));
}
