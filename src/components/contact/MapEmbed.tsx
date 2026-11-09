import { contact } from '@/content/pages/contact';
import { mapsEmbedSrc } from '@/content/site';

export function MapEmbed() {
  return (
    /* Ratio-sized on its own; stretched to the directions column once they sit side by side. */
    <div className="panel relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-96">
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
