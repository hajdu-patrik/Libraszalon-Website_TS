

export const contact = {
  eyebrow: 'Kérdésed van? Időpontot foglalnál?',
  title: 'Lépj velem kapcsolatba',

  booking: {
    eyebrow: 'Időpontfoglalás',
    heading: 'Így tudsz időpontot foglalni',
    lead: 'Az időpont foglalással automatikusan elfogadod a Libra Masszázs Szalon aktuális ',
    rulesLabel: 'házirendjét',
    rulesHref: '/hazirend/',
    body:
      ', ezért kérlek ezt foglalás előtt mindenképpen olvasd el. Előzzük meg az esetleges kellemetlenségeket és félreértéseket. Köszönöm!',
    callBody:
      'Időpontfoglaláshoz telefonszámomon várom hívásod. Kérlek légy türelemmel! Ha dolgozok, nem tudom felvenni a telefont, de vissza foglak hívni.',
    callLabel: 'Telefonhívás',
    emailLabel: 'E-mail küldése',
  },

  promise: {
    heading: 'A figyelmem csak rád irányul',
    body:
      'Téged is meg foglak tisztelni azzal, hogy amíg nálam vagy csak rád irányul a figyelmem és nem fogok mással beszélgetni.',
  },

  directions: {
    eyebrow: 'Budapest II. kerület, a Kultúrkúria szomszédságában',
    heading: 'Megközelítés',

    items: [
      {
        icon: 'parking',
        title: 'Ingyenes parkolás',
        body:
          'az épület saját parkolójában vagy a szomszédos Klebelsberg Kultúrkúria parkolójában.',
      },
      {
        icon: 'transit',
        title: 'Tömegközlekedéssel',
        body:
          'A Hűvösvölgyből illetve Solymárról induló 57, 257, 64, 64A, 164A, 264 járatszámű BKV buszok „Templom utca (Kultúrkúria)” nevű buszmegállójában kell leszállni, s az épület pontosan a megállónál található. Szalonom a SIAM Beauty Club épületének legfelső szintjén található, melynek bejárata a parkolóból nyílik.',
      },
    ],
  },

  detailsHeading: 'Elérhetőségek',
  socialHeading: 'Social',

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
