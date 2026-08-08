'use client';

import { useState } from 'react';
import { MapIcon } from '@/components/ui/Icons';
import { contact } from '@/content/pages/contact';
import { mapsEmbedSrc } from '@/content/site';

/**
 * Google Maps, loaded on demand.
 *
 * The legacy page embedded the iframe on load, which pulled roughly 300 KB and
 * a set of Google cookies onto every visit to the contact page. Deferring it
 * behind a click keeps the page fast and means no third-party contact happens
 * until the visitor asks for it.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded border border-line bg-subtle sm:aspect-[16/10]">
      {loaded ? (
        <iframe
          src={mapsEmbedSrc}
          title={contact.map.frameTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <MapIcon className="size-8 text-gold" />
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="inline-flex min-h-11 items-center rounded border border-line bg-surface px-5 font-heading text-base font-semibold text-ink shadow-[var(--shadow-card)] transition-all duration-300 hover:border-gold hover:text-gold-ink"
          >
            {contact.map.loadLabel}
          </button>
          <p className="max-w-xs text-sm text-muted">{contact.map.consentNote}</p>
        </div>
      )}
    </div>
  );
}
