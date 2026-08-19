/** /arak/ — headings verbatim from the legacy page. */

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
   * Two layers of text per image: the caption is the alternative text, written
   * to stand on its own for a screen reader, and the short label is what is
   * printed under the frame, where the surrounding heading already supplies
   * the context.
   */
  pass: {
    // Broadened from '10 alkalmas bérlet' when the névjegy joined the row: a
    // business card is not a pass, and a heading that says it is would be the
    // one piece of copy on the page that is simply untrue.
    heading: 'Bérlet és névjegy',
    captions: {
      front: 'A Libra Masszázs Szalon 10 alkalmas bérlete, előlap',
      back: 'A Libra Masszázs Szalon 10 alkalmas bérlete, hátlap',
      card: 'A Libra Masszázs Szalon névjegykártyája',
    },
    labels: {
      front: 'Bérlet, előlap',
      back: 'Bérlet, hátlap',
      card: 'Névjegy',
    },
  },
} as const;
