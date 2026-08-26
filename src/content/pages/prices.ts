/** /arak/ — headings verbatim from the legacy page. */

import type { ImageSlug } from '@/lib/images';

export type PassImage = {
  slug: ImageSlug;
  /** Alternative text, written to stand on its own for a screen reader. */
  alt: string;
  /** Printed under the frame, where the heading already supplies the context. */
  label: string;
};

/**
 * One entry per photograph, rather than the two parallel objects keyed by
 * front/back/card this used to be. The page had to pair those back up against
 * a list of slugs it held inline, so the image, its alternative text and its
 * caption were spread across two files and could be mismatched in either.
 */
const passImages: PassImage[] = [
  {
    slug: 'pass-front',
    alt: 'A Libra Masszázs Szalon 10 alkalmas bérlete, előlap',
    label: 'Bérlet, előlap',
  },
  {
    slug: 'pass-back',
    alt: 'A Libra Masszázs Szalon 10 alkalmas bérlete, hátlap',
    label: 'Bérlet, hátlap',
  },
  {
    slug: 'business-card',
    alt: 'A Libra Masszázs Szalon névjegykártyája',
    label: 'Névjegy',
  },
];

export const pricesPage = {
  eyebrow: 'Válaszd ki a neked megfelelőt!',
  title: 'Árak',
  heading: 'Ismerd meg az áraimat',
  lead: 'Az alábbiakban részletesen megismerheted masszázsszolgáltatásaimat',
  firstMassageLinkLabel: 'Az első masszázs alkalom',

  /**
   * The 10-session pass, shown at the foot of the price list.
   *
   * This copy used to sit in house-rules.ts, where the photographs opened
   * /hazirend/ beside the introduction. The pass is a thing you buy, so the
   * price list is where a visitor is actually looking for it; the rules that
   * govern it — validity, what happens to an unused one — stay on /hazirend/.
   *
   */
  pass: {
    // Broadened from '10 alkalmas bérlet' when the névjegy joined the row: a
    // business card is not a pass, and a heading that says it is would be the
    // one piece of copy on the page that is simply untrue.
    heading: 'Bérlet és névjegy',
    images: passImages,
  },
} as const;
