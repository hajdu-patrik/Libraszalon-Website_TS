/**
 * /kapcsolat/ — copy verbatim from the legacy page.
 *
 * Both intro paragraphs carry inline emphasis on the original site; the
 * segments below reproduce that without embedding markup in the copy. The
 * booking notice is split around one more seam than emphasis alone needs:
 * a sentence that tells a visitor to read the house rules before booking
 * should be able to take them there.
 */

export const contact = {
  eyebrow: 'Kérdésed van? Időpontot foglalnál?',
  title: 'Lépj velem kapcsolatba',

  booking: {
    lead: 'Az időpont foglalással automatikusan elfogadod a Libra Masszázs Szalon aktuális ',
    rulesLabel: 'házirendjét',
    rulesHref: '/hazirend/',
    body:
      ', ezért kérlek ezt foglalás előtt mindenképpen olvasd el. Előzzük meg az esetleges kellemetlenségeket és félreértéseket. Köszönöm! Időpontfoglaláshoz telefonszámomon várom hívásod. Kérlek légy türelemmel! Ha dolgozok, nem tudom felvenni a telefont, de vissza foglak hívni. Téged is meg foglak tisztelni azzal, hogy amíg nálam vagy csak rád irányul a figyelmem és nem fogok mással beszélgetni.',
  },

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

  /**
   * Accessible names for the contact links.
   *
   * Each one is composed as "<visible text> — <label>" (or the reverse where
   * the verb leads), never as the label alone: WCAG 2.5.3 Label in Name asks
   * that the accessible name contain the visible text, so a speech-input user
   * can say what they can see. "Hívás" on its own would break that; "Hívás:
   * +36 30 853 2729" does not.
   */
  labels: {
    call: 'Telefonhívás',
    email: 'E-mail írása',
    maps: 'megnyitás a Google Térképen (új lapon nyílik)',
    facebook: 'Facebook-oldal (új lapon nyílik)',
  },

  map: {
    frameTitle: 'A Libra Masszázs Szalon helye a térképen',
  },
} as const;
