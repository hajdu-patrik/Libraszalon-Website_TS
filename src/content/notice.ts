

export const notice = {
  version: 2,
  title: 'Kedves Látogató!',

body: [
    'Szeretném tájékoztatni, hogy jelenleg sajnos nincs kapacitásom új vendéget fogadni, valamint az ajándékutalványok értékesítését is határozatlan időre megszüntettem.',
    'Ennek oka, hogy igyekszem kiszolgálni a meglévő vendégeim igényeit, s pillanatnyilag a kapacitásom határán vagyok.',
    'Elnézést kérek mindenkitől, aki szeretett volna, de mégsem jutott be hozzám.',
    'Kérem és előre is köszönöm mindenki szíves megértését!',
  ],
  dismissLabel: 'Közlemény bezárása',
  confirmLabel: 'Megértettem',
  expandLabel: 'Részletek',
  collapseLabel: 'Kevesebb',
} as const;

export const noticeStorageKey = `libraszalon.notice.v${notice.version}`;
