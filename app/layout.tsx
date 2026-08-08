import type { Metadata, Viewport } from 'next';
import { Caveat, Roboto, Source_Sans_3 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NoticeBar } from '@/components/layout/NoticeBar';
import { BackToTop } from '@/components/ui/BackToTop';
import { businessJsonLd } from '@/lib/jsonld';
import { site } from '@/content/site';
import './globals.css';

/**
 * latin-ext is required, not optional: without it "ő" and "ű" fall back to a
 * different face mid-word, which is visible in almost every Hungarian heading.
 */
const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} - ${site.name}`,
    // Keeps the legacy "Page - Libraszalon" pattern in search results.
    template: `%s - ${site.name}`,
  },
  description: site.tagline,
  applicationName: site.name,
  authors: [{ name: site.owner }],
  creator: site.owner,
  publisher: site.legalName,
  formatDetection: { telephone: true, address: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={site.lang}
      className={`${sourceSans.variable} ${roboto.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#tartalom"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
        >
          Ugrás a tartalomhoz
        </a>

        <NoticeBar />
        <Header />

        <main id="tartalom" className="flex-1">
          {children}
        </main>

        <Footer />
        <BackToTop />

        <script
          type="application/ld+json"
          // Static, build-time JSON built from our own content files.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd()) }}
        />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
