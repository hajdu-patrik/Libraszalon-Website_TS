export const notice = {
  version: 3,
  title: 'Kedves Látogató!',
  body: [
    'Szeretném tájékoztatni, hogy jelenleg sajnos nem tudok új vendéget fogadni, valamint az ajándékutalványok értékesítését is határozatlan időre megszüntettem.',
    'Ennek oka, hogy igyekszem kiszolgálni a meglévő vendégeim igényeit, s pillanatnyilag a kapacitásom határán vagyok.',
    'Elnézést kérek mindenkitől, aki szeretett volna, de mégsem jutott be hozzám.',
    'Kérem és előre is köszönöm mindenki szíves megértését!',
  ],
  signature: 'Libraszalon.hu',
  dismissLabel: 'Közlemény bezárása',
  confirmLabel: 'Megértettem',
} as const;

/** Kept in sessionStorage: dismissing hides the notice for this visit only, so every new visit shows it again. */
export const noticeStorageKey = `libraszalon.notice.v${notice.version}`;
