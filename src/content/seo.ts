export type PageSeo = {
  path: string;
  /** Short page name; also the breadcrumb label. */
  title: string;
  /** Replaces the default "<title> - <legal name>" document title when set. */
  documentTitle?: string;
  description: string;
  priority: number;
  /** ISO date of the last editorial change to the page's content, for the sitemap. Bump it
   *  when the copy, prices or hours change: Google trusts lastmod only if it stays truthful. */
  lastModified: string;
};

export const pageSeo = {
  home: {
    path: '/',
    title: 'Főoldal',
    documentTitle: 'Libra Masszázs Szalon Budapest II. kerületében',
    description:
      'Libra Masszázs Szalon Budapest II. kerületében. Klasszikus svédmasszázs, köpölyös fascia mobilizáció, nyirokdrenázs és reflexzóna talpmasszázs okleveles gyógymasszőrtől.',
    priority: 1,
    lastModified: '2026-11-09',
  },
  about: {
    path: '/bemutatkozas/',
    title: 'Bemutatkozás',
    description:
      'Dévényi Krisztina vagyok, okleveles gyógymasszőr, a Libra Masszázs Szalon megálmodója. Svéd-, gyógy- és nyirokmasszőri képesítés, köpöly, kinesio-tape, triggerpont terápia és talpreflexológia.',
    priority: 0.8,
    lastModified: '2026-10-27',
  },
  prices: {
    path: '/arak/',
    title: 'Árak',
    description:
      'A Libra Masszázs Szalon árai: az első masszázs alkalom állapotfelméréssel 19.000 Ft, a további 60 perces kezelések 14.000 Ft, a 90 percesek 19.000 Ft.',
    priority: 0.9,
    lastModified: '2026-11-09',
  },
  firstMassage: {
    path: '/arak/elso-masszazs/',
    title: 'Az első masszázs alkalom',
    description:
      'Az első alkalom mindig 90 perces: szóbeli állapotfelméréssel indul, majd diagnosztikai célú masszázzsal térképezzük fel a problémás területeket. Gyakorlati tanácsok a felkészüléshez.',
    priority: 0.8,
    lastModified: '2026-11-06',
  },
  houseRules: {
    path: '/hazirend/',
    title: 'Házirend',
    description:
      'A Libra Masszázs Szalon házirendje: érkezés, lemondás, fizetési lehetőségek, bérletek és utalványok érvényessége, higiéniai előírások. Foglalás előtt kérlek olvasd el.',
    priority: 0.7,
    lastModified: '2026-10-27',
  },
  contact: {
    path: '/kapcsolat/',
    title: 'Kapcsolat',
    description:
      'Libra Masszázs Szalon, 1028 Budapest, Hidegkúti út 174. Időpontfoglalás telefonon: +36 30 853 2729. Ingyenes parkolás, a Templom utca (Kultúrkúria) buszmegállónál.',
    priority: 0.9,
    lastModified: '2026-11-09',
  },
} as const satisfies Record<string, PageSeo>;

export type PageKey = keyof typeof pageSeo;

export const allPageSeo: PageSeo[] = Object.values(pageSeo);
