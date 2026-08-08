import { GoldRule } from '@/components/ui/GoldRule';
import { Reveal } from '@/components/ui/Reveal';
import type { PriceItem } from '@/content/prices';

type PriceCardProps = {
  item: PriceItem;
  index: number;
};

export function PriceCard({ item, index }: PriceCardProps) {
  return (
    <Reveal
      as="article"
      index={index % 3}
      className="flex h-full flex-col rounded border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <p className="eyebrow">{item.duration}</p>

      <h3 className="mt-2 text-[length:var(--text-h3)] text-ink">{item.title}</h3>

      {item.note && (
        <p className="mt-2 text-[0.9375rem] whitespace-pre-line text-muted">
          {item.note}
        </p>
      )}

      <GoldRule className="mt-5" />

      {/* Pushed to the bottom so prices line up across a row of cards. */}
      <p className="mt-auto pt-5 font-heading text-[length:var(--text-price)] font-semibold text-ink">
        {item.price}
      </p>
    </Reveal>
  );
}
