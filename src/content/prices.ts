

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
    price: '18.000 Ft',
    amounts: [18000],
  },
  {
    duration: '60 / 90 perc',
    title: 'Klasszikus svédmasszázs',
    note: 'Testrészek kiválasztása panaszok és állapot függvényében',
    price: '13.000 Ft / 18.000 Ft',
    amounts: [13000, 18000],
  },
  {
    duration: '60 perc',
    title: 'Kombinált svédmasszázs',
    note: '1. opció: dekoltázs + fej + arc\n2. opció: hát + talp',
    price: '13.000 Ft',
    amounts: [13000],
  },
  {
    duration: '60 / 90 perc',
    title: 'Aromaterápiás relaxáló, stresszoldó masszázs',
    price: '13.000 Ft / 18.000 Ft',
    amounts: [13000, 18000],
  },
  {
    duration: '60 / 90 perc',
    title: 'Köpölyös fascia mobilizáló masszázs',
    price: '13.000 Ft / 18.000 Ft',
    amounts: [13000, 18000],
  },
  {
    duration: '60 / 90 perc',
    title: 'Nyirokmasszázs',
    note: '(Nyiroködéma esetén I-es stádiumig)',
    price: '13.000 Ft / 18.000 Ft',
    amounts: [13000, 18000],
  },
  {
    duration: '60 perc',
    title: 'Reflexzónák ismeretén alapuló talpmasszázs',
    price: '13.000 Ft',
    amounts: [13000],
  },
];

export const priceRange = (() => {
  const all = prices.flatMap((p) => p.amounts);
  return { min: Math.min(...all), max: Math.max(...all) };
})();
