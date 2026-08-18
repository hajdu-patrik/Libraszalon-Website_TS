import { contact } from '@/content/pages/contact';
import { mapsEmbedSrc } from '@/content/site';

/**
 * Google Maps embed.
 *
 * Rendered straight into the page so visitors see the location immediately,
 * but kept below the fold with loading="lazy" so the roughly 300 KB it pulls
 * only loads once the visitor scrolls the map into view — the page still paints
 * and becomes interactive without waiting on Google.
 *
 * Height is fixed on small screens and only becomes elastic at the breakpoint
 * where the layout turns into two columns (md). A map has no intrinsic height, so
 * `h-full` in a single-column stack resolves against nothing and collapses;
 * beside the details card it is exactly what keeps the two panels level.
 */
export function MapEmbed() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-line bg-cream shadow-[var(--shadow-card)] sm:h-80 md:h-full md:min-h-[24rem] lg:min-h-[26rem]">
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
