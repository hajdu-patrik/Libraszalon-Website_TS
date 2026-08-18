import type { Metadata, Viewport } from 'next';
import { Caveat, Cormorant_Garamond, Source_Sans_3 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { IntroVeil } from '@/components/layout/IntroVeil';
import { WelcomeModal } from '@/components/layout/WelcomeModal';
import { BackToTop } from '@/components/ui/BackToTop';
import { businessJsonLd } from '@/lib/jsonld';
import { INTRO_BOOTSTRAP } from '@/lib/intro';
import { site } from '@/content/site';
import './globals.css';

/**
 * latin-ext is required, not optional: without it "ő" and "ű" fall back to a
 * different face mid-word, which is visible in almost every Hungarian heading.
 */
const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
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
  themeColor: '#211d1c',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={site.lang}
      className={`${cormorant.variable} ${sourceSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        {/*
          [data-reveal] hides content from the stylesheet, but the attribute
          that releases it is set by an observer after hydration — so without
          JavaScript most of the page would stay invisible for good.

          A <noscript> override rather than a js class on <html>: the export is
          fully rendered HTML, so nothing has to run at all, and there is no
          window in which elements could flash visible and then disappear.
          dangerouslySetInnerHTML because React cannot hydrate parsed children
          inside <noscript> — the browser hands it back as text.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: '<style>[data-reveal]{opacity:1;transform:none}</style>',
          }}
        />

        {/*
          Decides whether the intro curtain plays, and must do so before the
          first paint — hence a blocking inline script rather than an effect.
          Static, built from our own constants; see src/lib/intro.ts.
        */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
      </head>
      <body className="flex min-h-full flex-col">
        <IntroVeil />

        <a
          href="#tartalom"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
        >
          Ugrás a tartalomhoz
        </a>

        <Header />

        <main id="tartalom" className="flex-1">
          {children}
        </main>

        <Footer />
        <BackToTop />
        <WelcomeModal />

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
