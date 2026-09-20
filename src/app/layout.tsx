import type { Metadata, Viewport } from 'next';
import { Caveat, Cormorant_Garamond, Source_Sans_3 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { IntroVeil } from '@/components/layout/IntroVeil';
import { WelcomeModal } from '@/components/layout/WelcomeModal';
import { BackToTop } from '@/components/ui/BackToTop';
import { JsonLd } from '@/components/ui/JsonLd';
import { businessJsonLd } from '@/lib/jsonld';
import { INTRO_BOOTSTRAP } from '@/lib/intro';
import { site } from '@/content/site';
import './globals.css';

/** Weight lists are pruned to exactly what the site renders (verified by grepping every
 *  font-weight utility in src/): headings and their few font-semibold/font-medium overrides
 *  use 500/600, body text and its font-semibold overrides use 400/600, and the handwritten
 *  script accent (font-script) is always rendered at its inherited default (400) — nothing
 *  ever requests 700 or a 600 script weight. Keep in sync if a new weight is used. */
const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  display: 'swap',
});

/** Not preloaded: the script accent only ever appears below the fold (the footer
 *  tagline on every page, the home call-to-action, the bemutatkozás closing line
 *  and the 404 page), so preloading both of its subsets on every navigation buys
 *  nothing and the browser reports them as unused. display: swap still paints the
 *  line in the size-adjusted fallback and swaps it in when the fetch lands. */
const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} - ${site.name}`,
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
    /* INTRO_BOOTSTRAP stamps data-intro on this element before React hydrates, so
       the client tree legitimately carries an attribute the server HTML cannot.
       suppressHydrationWarning covers this element's own attributes only. */
    <html
      lang={site.lang}
      suppressHydrationWarning
      className={`${cormorant.variable} ${sourceSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <noscript
          dangerouslySetInnerHTML={{
            __html: '<style>[data-reveal]{opacity:1;transform:none}</style>',
          }}
        />

        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
      </head>
      <body className="flex min-h-full flex-col">
        <IntroVeil />

        <a
          href="#tartalom"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded focus:bg-ink focus:px-4 focus:text-surface"
        >
          Ugrás a tartalomhoz
        </a>

        <Header />

        <main id="tartalom" tabIndex={-1} className="flex-1">
          {children}
        </main>

        <Footer />
        <BackToTop />
        <WelcomeModal />

        <JsonLd data={businessJsonLd()} />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
