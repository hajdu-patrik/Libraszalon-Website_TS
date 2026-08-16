/**
 * Per-page titles and descriptions.
 *
 * Titles keep the legacy "<Page> - Libraszalon" pattern so search snippets stay
 * recognisable. Descriptions are drawn from each page's own copy, with two
 * deliberate corrections to what WordPress was serving:
 *   - /arak/ quoted a stale 15.000 Ft; the real first-session price is 18.000 Ft
 *   - /arak/elso-masszazs/ reused the house rules description; it now describes
 *     the first session, which is what the page is actually about
 */

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  /** Priority hint for sitemap.xml. */
  priority: number;
};

export const pageSeo = {
  home: {
    path: '/',
    title: 'Főoldal',
    description:
      'Libra Masszázs Szalon Budapest II. kerületében. Aromaterápiás masszázs, klasszikus svédmasszázs, köpölyös fascia mobilizáció és nyirokmasszázs okleveles gyógymasszőrtől.',
    priority: 1,
  },
  about: {
    path: '/bemutatkozas/',
    title: 'Bemutatkozás',
    description:
      'Dévényi Krisztina vagyok, okleveles gyógymasszőr, a Libra Masszázs Szalon megálmodója. Svéd-, gyógy- és nyirokmasszőri képesítés, köpöly, kinesio-tape, triggerpont terápia és talpreflexológia.',
    priority: 0.8,
  },
  prices: {
    path: '/arak/',
    title: 'Árak',
    description:
      'A Libra Masszázs Szalon árai: az első masszázs alkalom állapotfelméréssel 18.000 Ft, a további 60 és 90 perces kezelések 13.000 Ft-tól 18.000 Ft-ig.',
    priority: 0.9,
  },
  firstMassage: {
    path: '/arak/elso-masszazs/',
    title: 'Az első masszázs alkalom',
    description:
      'Az első alkalom mindig 90 perces: szóbeli állapotfelméréssel indul, majd diagnosztikai célú masszázzsal térképezzük fel a problémás területeket. Gyakorlati tanácsok a felkészüléshez.',
    priority: 0.8,
  },
  houseRules: {
    path: '/hazirend/',
    title: 'Házirend',
    description:
      'A Libra Masszázs Szalon házirendje: érkezés, lemondás, fizetési lehetőségek, bérletek és utalványok érvényessége, higiéniai előírások. Foglalás előtt kérlek olvasd el.',
    priority: 0.7,
  },
  contact: {
    path: '/kapcsolat/',
    title: 'Kapcsolat',
    description:
      'Libra Masszázs Szalon, 1028 Budapest, Hidegkúti út 174. Időpontfoglalás telefonon: +36 30 853 2729. Ingyenes parkolás, a Templom utca (Kultúrkúria) buszmegállónál.',
    priority: 0.9,
  },
} as const satisfies Record<string, PageSeo>;

export const allPageSeo: PageSeo[] = Object.values(pageSeo);
