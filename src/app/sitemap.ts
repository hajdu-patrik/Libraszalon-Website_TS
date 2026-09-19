import type { MetadataRoute } from 'next';
import { allPageSeo } from '@/content/seo';
import { site } from '@/content/site';

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
