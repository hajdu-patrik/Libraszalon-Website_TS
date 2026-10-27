import { Caveat, Cormorant_Garamond, Source_Sans_3 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { IntroVeil } from '@/components/layout/IntroVeil';
import { WelcomeModal } from '@/components/layout/WelcomeModal';
import { BackToTop } from '@/components/ui/BackToTop';
import { JsonLd } from '@/components/ui/JsonLd';
import { site } from '@/content/site';
import { ui } from '@/content/ui';
import { INTRO_BOOTSTRAP } from '@/lib/intro';
import { businessJsonLd, websiteJsonLd } from '@/lib/jsonld';
import { rootMetadata, rootViewport } from '@/lib/seo';
import './globals.css';

/* Weights are limited to the ones the stylesheet uses (headings 500/600, body 400/600,
   script 400) so nothing else can be requested and faux-bolded by accident. */
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

/* Not preloaded: the script face only appears below the fold (footer tagline, home
   call-to-action, the about page's closing line, the 404 page). */
const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  display: 'swap',
  preload: false,
});

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    /* INTRO_BOOTSTRAP sets data-intro on <html> before hydration, an attribute the server
       HTML cannot have; suppressHydrationWarning covers only this element's attributes. */
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded focus:bg-ink focus:px-4 focus:text-surface"
        >
          {ui.skipLink}
        </a>

        <Header />

        <main id="tartalom" tabIndex={-1} className="flex-1">
          {children}
        </main>

        <Footer />
        <BackToTop />
        <WelcomeModal />

        <JsonLd data={businessJsonLd()} />
        <JsonLd data={websiteJsonLd()} />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
