import type { MetadataRoute } from 'next';
import { allPageSeo } from '@/content/seo';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return allPageSeo.map((page) => ({
    url: absoluteUrl(page.path),
    priority: page.priority,
  }));
}
