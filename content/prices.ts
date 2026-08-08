/**
 * Price list, verbatim from /arak/.
 *
 * `amounts` mirrors `price` numerically so the Service/Offer JSON-LD can quote
 * real figures. Keep the two in sync when a price changes.
 *
 * Note: the legacy page's meta description still claimed "15.000 FT" for the
 * first session while the page itself said 18.000 Ft. The page body is
 * authoritative and is what is reproduced here.
 */

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

/** Lowest and highest figures across the list, for LocalBusiness priceRange. */
export const priceRange = (() => {
  const all = prices.flatMap((p) => p.amounts);
  return { min: Math.min(...all), max: Math.max(...all) };
})();
