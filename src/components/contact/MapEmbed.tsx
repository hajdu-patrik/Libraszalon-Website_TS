import { contact } from '@/content/pages/contact';
import { mapsEmbedSrc } from '@/content/site';

/**
 * Google Maps embed.
 *
 * Rendered straight into the page so visitors see the location immediately,
 * but kept below the fold with loading="lazy" so the roughly 300 KB it pulls
 * only loads once the visitor scrolls the map into view — the page still paints
 * and becomes interactive without waiting on Google.
 */
export function MapEmbed() {
  return (
    <div className="relative h-full min-h-[20rem] w-full overflow-hidden rounded-3xl border border-line bg-cream shadow-[var(--shadow-card)] sm:min-h-[24rem]">
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
