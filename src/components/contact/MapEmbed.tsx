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
 * A frame inside the page's card, so it carries a hairline and no shadow of its
 * own: a shadow here would be a card drawn on top of a card.
 *
 * Height is fixed on small screens and only becomes elastic at the breakpoint
 * where the layout turns into two columns (md). A map has no intrinsic height, so
 * `h-full` in a single-column stack resolves against nothing and collapses;
 * beside the details it is exactly what keeps the two columns level.
 */
export function MapEmbed() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-line bg-cream sm:h-72 md:h-full md:min-h-[22rem]">
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
