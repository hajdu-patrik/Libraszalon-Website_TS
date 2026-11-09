import type { MetadataRoute } from 'next';
import { allPageSeo } from '@/content/seo';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

/** lastModified comes from the content layer, not the build time: a lastmod that changes on
 *  every deploy is ignored by search engines, a truthful one is used to schedule crawls. */
export default function sitemap(): MetadataRoute.Sitemap {
  return allPageSeo.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: page.lastModified,
    changeFrequency: 'monthly',
    priority: page.priority,
  }));
}
