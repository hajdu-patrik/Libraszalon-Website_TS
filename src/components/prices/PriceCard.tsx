import { GoldSignature } from '@/components/ui/GoldSignature';
import { Reveal } from '@/components/ui/Reveal';
import type { PriceItem } from '@/content/prices';

export function FeaturedPriceCard({ item }: { item: PriceItem }) {
  return (
    <Reveal
      as="article"
      className="relative overflow-hidden rounded-3xl bg-ink-deep p-7 text-cream-text shadow-[var(--shadow-lift)] sm:p-10"
    >
      <GoldSignature className="absolute inset-x-0 top-0" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="min-w-0">
          <p className="eyebrow-dark">{item.duration}</p>
          <h3 className="mt-3 text-[length:var(--text-h3)] text-cream-text">
            {item.title}
          </h3>
          {item.note && (
            <p className="mt-3 max-w-md text-[length:var(--text-ui)] whitespace-pre-line text-cream-muted">
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

type PriceCardProps = {
  item: PriceItem;

  index: number;
};

export function PriceCard({ item, index }: PriceCardProps) {
  return (
    <Reveal
      as="article"
      index={index % 3}
      className="card-interactive group flex h-full flex-col rounded-2xl bg-surface p-6 sm:p-7"
    >
      <p className="eyebrow">{item.duration}</p>

      <h3 className="mt-3 text-[length:var(--text-h3)] text-ink">{item.title}</h3>

      {item.note && (
        <p className="mt-3 text-[length:var(--text-ui)] whitespace-pre-line text-muted">
          {item.note}
        </p>
      )}

      {
}
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
