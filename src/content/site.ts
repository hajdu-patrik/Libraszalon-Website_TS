

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

  phoneHref: '+36308532729',

  address: {
    street: 'Hidegkúti út 174',
    city: 'Budapest',
    postalCode: '1028',
    country: 'HU',

    formatted: 'Budapest, Hidegkúti út 174, 1028',
  },

  geo: {
    latitude: 47.5645843,
    longitude: 18.9604828,
  },

openingHoursDisplay: 'Hétfő – Vasárnap: 09:00 – 17:00',

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
  encodeURIComponent(site.address.formatted) +
  '&t=m&z=15&output=embed&iwloc=near';
