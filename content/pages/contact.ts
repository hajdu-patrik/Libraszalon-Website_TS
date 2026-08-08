/**
 * /kapcsolat/ — copy verbatim from the legacy page.
 *
 * The intro and directions carry inline emphasis on the original site; the
 * `strong` segments below reproduce that without embedding markup in the copy.
 */

/** One run of the intro paragraph, optionally emphasised and/or linked. */
export type IntroPart = {
  text: string;
  strong?: boolean;
  href?: string;
};

export const contact = {
  eyebrow: 'Kérdésed van? Időpontot foglalnál?',
  title: 'Lépj velem kapcsolatba',

  intro: [
    { text: 'Az ' },
    {
      text: 'időpont foglalással automatikusan elfogadod a Libra Masszázs Szalon aktuális házirendjét,',
      strong: true,
      href: '/hazirend/',
    },
    {
      text: ' ezért kérlek ezt foglalás előtt mindenképpen olvasd el. Előzzük meg az esetleges kellemetlenségeket és félreértéseket. Köszönöm! ',
    },
    {
      text: 'Időpontfoglaláshoz telefonszámomon várom hívásod.',
      strong: true,
    },
    {
      text: ' Kérlek légy türelemmel! Ha dolgozok, nem tudom felvenni a telefont, de vissza foglak hívni. Téged is meg foglak tisztelni azzal, hogy amíg nálam vagy csak rád irányul a figyelmem és nem fogok mással beszélgetni.',
    },
  ] satisfies IntroPart[] as IntroPart[],

  directions: {
    parking: 'Ingyenes parkolás',
    parkingBody:
      ' az épület saját parkolójában vagy a szomszédos Klebelsberg Kultúrkúria parkolójában. ',
    transitLabel: 'Megközelítés tömegközlekedéssel:',
    transitBody:
      ' A Hűvösvölgyből illetve Solymárról induló 57, 257, 64, 64A, 164A, 264 járatszámű BKV buszok „Templom utca (Kultúrkúria)” nevű buszmegállójában kell leszállni, s az épület pontosan a megállónál található. Szalonom a SIAM Beauty Club épületének legfelső szintjén található, melynek bejárata a parkolóból nyílik.',
  },

  detailsHeading: 'Elérhetőségek',
  socialHeading: 'Social',

  map: {
    heading: 'Térkép',
    loadLabel: 'Térkép betöltése',
    /** Shown under the button so the privacy trade-off is explicit. */
    consentNote:
      'A térkép betöltésével kapcsolatba lépsz a Google szervereivel.',
    frameTitle: 'A Libra Masszázs Szalon helye a térképen',
  },

  businessCardAlt: 'A Libra Masszázs Szalon névjegykártyája',
} as const;
