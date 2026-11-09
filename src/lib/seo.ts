import type { Metadata, Viewport } from 'next';
import { notFound } from '@/content/pages/not-found';
import { pageSeo, type PageSeo } from '@/content/seo';
import { site } from '@/content/site';

export const THEME_COLOR = '#211d1c';

export const OG_IMAGE = {
  url: `${site.url}/og/default.jpg`,
  width: 1200,
  height: 630,
  alt: site.legalName,
  type: 'image/jpeg',
} as const;

export function absoluteUrl(path: string): string {
  return `${site.url}${path}`;
}

/** "Page - Libra Masszázs Szalon": the full business name in every title, so a result
 *  reads as the salon even where the page name alone ("Árak") says nothing. */
function pageTitle(title: string): string {
  return `${title} - ${site.legalName}`;
}

export function documentTitle(page: PageSeo): string {
  return page.documentTitle ?? pageTitle(page.title);
}

export function buildMetadata(page: PageSeo): Metadata {
  const url = absoluteUrl(page.path);
  const title = documentTitle(page);

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

export const rootMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: pageSeo.home.documentTitle,
  description: pageSeo.home.description,
  applicationName: site.name,
  authors: [{ name: site.owner }],
  creator: site.owner,
  publisher: site.legalName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const rootViewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: 'light',
};

// No robots field: Next already emits noindex for the not-found boundary.
export const notFoundMetadata: Metadata = {
  title: { absolute: pageTitle(notFound.title) },
};
