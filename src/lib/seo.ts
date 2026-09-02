import type { Metadata } from 'next';
import { site } from '@/content/site';
import type { PageSeo } from '@/content/seo';

const OG_IMAGE = {
  url: `${site.url}/og/default.jpg`,
  width: 1200,
  height: 630,
  alt: 'Libra Masszázs Szalon',
};

export function buildMetadata(page: PageSeo): Metadata {
  const url = `${site.url}${page.path}`;
  const title = `${page.title} - ${site.name}`;

  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: site.locale,
      url,
      siteName: site.name,
      title,
      description: page.description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.description,
      images: [OG_IMAGE.url],
    },
  };
}

export { OG_IMAGE };
