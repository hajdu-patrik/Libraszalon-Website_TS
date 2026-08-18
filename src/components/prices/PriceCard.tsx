import { Reveal } from '@/components/ui/Reveal';
import type { PriceItem } from '@/content/prices';

type PriceCardProps = {
  item: PriceItem;
  index: number;
  /** The first-session card gets the gold treatment and a wide layout. */
  featured?: boolean;
};

export function PriceCard({ item, index, featured = false }: PriceCardProps) {
  if (featured) {
    return (
      <Reveal
        as="article"
        className="relative overflow-hidden rounded-3xl bg-ink-deep p-7 text-cream-text shadow-[var(--shadow-lift)] sm:p-10"
      >
        {/* Gold signature line across the top of the card. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 block h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent"
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="min-w-0">
            <p className="eyebrow-dark">{item.duration}</p>
            <h3 className="mt-3 text-[length:var(--text-h3)] text-cream-text">
              {item.title}
            </h3>
            {item.note && (
              <p className="mt-3 max-w-md text-[0.9375rem] whitespace-pre-line text-cream-muted">
                {item.note}
              </p>
            )}
          </div>
          <p className="shrink-0 font-heading text-[length:var(--text-price)] font-semibold text-gold">
            {item.price}
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal
      as="article"
      index={index % 3}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-(--dur-base) ease-smooth hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow-lift)] sm:p-7"
    >
      <p className="eyebrow">{item.duration}</p>

      <h3 className="mt-3 text-[length:var(--text-h3)] text-ink">{item.title}</h3>

      {item.note && (
        <p className="mt-3 text-[0.9375rem] whitespace-pre-line text-muted">
          {item.note}
        </p>
      )}

      {/* Pushed to the bottom so prices line up across a row of cards; the
          hairline warms to gold with the card's hover lift. */}
      <div className="mt-auto pt-6">
        <span
          aria-hidden="true"
          className="block h-px w-full bg-line transition-colors duration-(--dur-base) ease-smooth group-hover:bg-gold/40"
        />
        <p className="mt-5 font-heading text-[length:var(--text-price)] font-semibold text-ink">
          {item.price}
        </p>
      </div>
    </Reveal>
  );
}
