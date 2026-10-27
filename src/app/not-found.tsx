import { Button } from '@/components/ui/Button';
import { GoldRule } from '@/components/ui/GoldRule';
import { notFound } from '@/content/pages/not-found';
import { pageSeo } from '@/content/seo';
import { site } from '@/content/site';
import { notFoundMetadata } from '@/lib/seo';

export const metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">{notFound.eyebrow}</p>
      <h1 className="mt-3 text-h1">{notFound.title}</h1>
      <GoldRule centered className="mt-6" />

      <p className="mt-6 max-w-md text-subtle">{notFound.body}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href={pageSeo.home.path}>{pageSeo.home.title}</Button>
        <Button href={pageSeo.contact.path} variant="outline">
          {pageSeo.contact.title}
        </Button>
      </div>

      <p className="mt-10 font-script text-script leading-snug">{site.tagline}</p>
    </div>
  );
}
