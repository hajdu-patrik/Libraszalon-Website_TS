import { contact } from '@/content/pages/contact';
import { mapsEmbedSrc } from '@/content/site';

export function MapEmbed() {
  return (
    /* Sized by ratio like every other media block on the site, then stretched to
       match the directions column once the two sit side by side. */
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-cream shadow-[var(--shadow-card)] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-96">
      <iframe
        src={mapsEmbedSrc}
        title={contact.map.frameTitle}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
}
