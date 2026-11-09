import type { ImageSlug } from '@/lib/images';

export type Service = {
  title: string;
  body: string;
  image: ImageSlug;
  alt: string;
};

export const services: Service[] = [
  {
    title: 'Klasszikus svédmasszázs',
    body: 'Mélyen relaxáló és szelíd, de hatékony masszázstechnika, mely a feszültség oldására és az izmok lazítására összpontosít. Különféle simító, dörzsölő és gyúró mozdulatokat alkalmazva segít javítani az általános közérzetet és csökkenteni a stresszt.',
    image: 'service-swedish',
    alt: 'Klasszikus svédmasszázs simító mozdulata a háton',
  },
  {
    title: 'Köpölyös fascia mobilizáció',
    body: 'A mélyebb rétegekbe hatoló, feszültséget oldó masszázstechika, amely serkenti a vérkeringést és javítja a fasciák rugalmasságát, így elősegítve a testi és lelki egyensúly helyreállítását.',
    image: 'service-cupping',
    alt: 'Köpölyözés a háton a fascia mobilizálása közben',
  },
  {
    title: 'Nyirokdrenázs',
    body: 'Lágy, ritmikus, pumpáló mozdulatokkal végzett speciális kezelés, amely serkenti a nyirokkeringést, segíti a szövetek közötti folyadék elvezetését, csökkenti a duzzanatot és a nehézláb-érzést. Nyiroködéma esetén I-es stádiumig alkalmazható, vivőanyag nélkül.',
    // TODO: dedikált nyirokdrenázs fotó, ha a szalon küld egyet.
    image: 'hero',
    alt: 'Lágy, simító kézmozdulat a háton nyirokdrenázs közben',
  },
  {
    title: 'Reflexzónák ismeretén alapuló talpmasszázs',
    body: 'A talp reflexzónáinak célzott kezelése, amely a test egészére jótékonyan hat: oldja a feszültséget, javítja a keringést, segíti a szervezet egyensúlyának helyreállítását, és mély ellazulást ad.',
    // TODO: dedikált talpmasszázs fotó, ha a szalon küld egyet.
    image: 'service-aromatherapy',
    alt: 'Masszázsolaj adagolása talpmasszázs előtt',
  },
];
