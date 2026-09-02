import { contact } from '@/content/pages/contact';
import { mapsEmbedSrc } from '@/content/site';

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
