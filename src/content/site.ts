/**
 * Business facts. Every phone number, address and URL on the site resolves
 * from here, so there is exactly one place to change when something moves.
 */

export const site = {
  name: 'Libraszalon',
  legalName: 'Libra Masszázs Szalon',
  owner: 'Dévényi Krisztina',
  ownerTitle: 'okleveles gyógymasszőr',
  url: 'https://libraszalon.hu',
  locale: 'hu_HU',
  lang: 'hu',

  tagline: '„A masszázs nem luxus. Az egészség és a boldogság alapfeltétele.”',

  email: 'libraszalon@gmail.com',
  phone: '+36 30 853 2729',
  /** E.164 form for tel: links. */
  phoneHref: '+36308532729',

  address: {
    street: 'Hidegkúti út 174',
    city: 'Budapest',
    postalCode: '1028',
    country: 'HU',
    /** As displayed on the legacy site. */
    formatted: 'Budapest, Hidegkúti út 174, 1028',
  },

  geo: {
    latitude: 47.5645843,
    longitude: 18.9604828,
  },

  /** Human-readable form of openingHours for the UI. */
  openingHoursDisplay: 'Hétfő – Vasárnap: 09:00 – 17:00',

  /** Mo–Su 09:00–17:00, matching the legacy structured data. */
  openingHours: {
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '09:00',
    closes: '17:00',
  },

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100091632343854',
    facebookLabel: 'Libra Masszázs Szalon',
    googleMaps: 'https://maps.app.goo.gl/z6Qgy2wq58V3UsrK7',
  },

  copyright: 'Minden jog fenntartva',
} as const;

/** Credit block for the footer: who built the site and where to find them. */
export const developer = {
  heading: 'Oldalkészítő',
  github: {
    label: 'GitHub profil',
    href: 'https://github.com/hajdu-patrik',
  },
  linkedin: {
    label: 'LinkedIn profil',
    href: 'https://www.linkedin.com/in/hajdu-patrik/',
  },
} as const;

export const mapsEmbedSrc =
  'https://maps.google.com/maps?q=' +
  encodeURIComponent('Budapest, Hidegkúti út 174, 1028') +
  '&t=m&z=15&output=embed&iwloc=near';
