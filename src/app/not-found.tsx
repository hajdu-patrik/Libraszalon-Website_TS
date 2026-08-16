import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { GoldRule } from '@/components/ui/GoldRule';
import { pageSeo } from '@/content/seo';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'A keresett oldal nem található',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-[length:var(--text-h1)] text-ink">
        A keresett oldal nem található
      </h1>
      <GoldRule centered className="mt-6" />

      <p className="mt-6 max-w-md text-muted">
        Elképzelhető, hogy az oldal megszűnt vagy megváltozott a címe.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/">Főoldal</Button>
        <Button href={pageSeo.contact.path} variant="outline">
          Kapcsolat
        </Button>
      </div>

      <p className="mt-10 font-script text-[1.5rem] leading-snug text-ink">
        {site.tagline}
      </p>
    </div>
  );
}
