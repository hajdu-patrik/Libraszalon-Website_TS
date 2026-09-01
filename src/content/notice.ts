/**
 * The standing capacity notice. On the legacy site this was a blocking modal;
 * here it is a dismissible corner card (WelcomeModal), which carries the same
 * message without the mobile interstitial penalty Google applies to
 * full-screen overlays.
 *
 * Bump `version` to re-show the card to visitors who already dismissed it.
 */

export const notice = {
  version: 2,
  title: 'Kedves Látogató!',
  /**
   * One entry per paragraph. The notice is dictated to us as written text with
   * its own breaks, and a single run-on string loses them — so the card renders
   * this list rather than a paragraph it has to guess the shape of.
   */
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
