export type PriceItem = {
  duration: string;
  title: string;
  note?: string;
  price: string;
  amounts: number[];
};

export const prices: PriceItem[] = [
  {
    duration: '90 perc',
    title: 'Az első masszázs alkalom',
    note: 'Szóbeli állapotfelméréssel egybekötött diagnosztikai célú masszázs',
    price: '19.000 Ft',
    amounts: [19000],
  },
  {
    duration: '60 / 90 perc',
    title: 'Klasszikus svédmasszázs',
    note: 'Testrészek kiválasztása panaszok és állapot függvényében',
    price: '14.000 Ft / 19.000 Ft',
    amounts: [14000, 19000],
  },
  {
    duration: '60 / 90 perc',
    title: 'Köpölyös fascia mobilizáló masszázs',
    price: '14.000 Ft / 19.000 Ft',
    amounts: [14000, 19000],
  },
  {
    duration: '60 / 90 perc',
    title: 'Nyirokdrenázs',
    note: '(Nyiroködéma esetén I-es stádiumig)',
    price: '14.000 Ft / 19.000 Ft',
    amounts: [14000, 19000],
  },
  {
    duration: '60 perc',
    title: 'Reflexzónák ismeretén alapuló talpmasszázs',
    price: '14.000 Ft',
    amounts: [14000],
  },
];

export const priceRange = (() => {
  const all = prices.flatMap((p) => p.amounts);
  return { min: Math.min(...all), max: Math.max(...all) };
})();
