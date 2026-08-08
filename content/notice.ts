/**
 * The standing capacity notice. On the legacy site this was a blocking modal;
 * here it is a dismissible bar, which carries the same message without the
 * mobile interstitial penalty Google applies to full-screen overlays.
 *
 * Bump `version` to re-show the bar to visitors who already dismissed it.
 */

export const notice = {
  version: 1,
  title: 'Kedves Látogató!',
  body: 'Felhívom rá szíves figyelmét, hogy új vendéget csak korlátozott számban tudok fogadni, illetve számolni kell a megnövekedett várakozási idővel. Időpontot előre láthatólag 3-4 hétre tudok adni. Az ajándékutalványok beváltására ugyanez a várakozási idő érvényes, kérem vásárlás előtt ezt vegye figyelembe. Köszönöm szíves megértését!',
  dismissLabel: 'Közlemény bezárása',
} as const;

export const noticeStorageKey = `libraszalon.notice.v${notice.version}`;
