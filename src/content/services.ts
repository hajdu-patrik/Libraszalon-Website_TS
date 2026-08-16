/**
 * The four service blurbs from the home page. Copy is verbatim from the
 * legacy site — no rewriting.
 */

import type { ImageSlug } from '@/lib/images';

export type Service = {
  title: string;
  body: string;
  image: ImageSlug;
  alt: string;
};

export const services: Service[] = [
  {
    title: 'Aromaterápiás masszázs minőségi illóolajokkal',
    body: 'Az aromaterápiás masszázs kiváló lehetőség a test és lélek teljes kikapcsolódására minőségi illóolajok segítségével. Az illóolajok finom aromája harmonizál és relaxál, miközben a masszázs segíti az izmok ellazulását és a stressz oldását.',
    image: 'service-aromatherapy',
    alt: 'Illóolaj adagolása masszázs előtt a Libra Masszázs Szalonban',
  },
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
    title: 'Ajándékutalványok',
    body: 'Az ajándékutalványok kiváló lehetőséget nyújtanak masszázsélményre szeretteinknek vagy barátainknak. Testi-lelki feltöltődés és harmónia várja azokat, akik ilyen egyedülálló ajándékot kapnak. Ajándékozzunk időt és kényeztetést azoknak, akiknek különleges élményt szeretnénk nyújtani.',
    image: 'service-voucher',
    alt: 'A Libra Masszázs Szalon ajándékutalványa piros szalaggal átkötve',
  },
];
