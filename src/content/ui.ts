export const ui = {
  skipLink: 'Ugrás a tartalomhoz',
  newTab: '(új lapon nyílik)',
  mainNav: 'Főmenü',
  mobileNav: 'Mobil főmenü',
  menuOpen: 'Menü megnyitása',
  menuClose: 'Menü bezárása',
  footerNav: 'Lábléc menü',
  contactHeading: 'Elérhetőségek',
  bookingCta: 'Időpontfoglalás',
  mapsHint: 'megnyitás a Google Térképen',
  facebookHint: 'Facebook-oldal',
  backToTop: 'Vissza az oldal tetejére',
  starRating: (value: string) => `${value} csillag az 5-ből`,
  reviews: {
    region: 'Vélemények',
    previous: 'Előző vélemény',
    next: 'Következő vélemény',
    pause: 'Automatikus lapozás szüneteltetése',
    play: 'Automatikus lapozás indítása',
    expand: 'Tovább',
    collapse: 'Kevesebb',
  },
} as const;

/** The call-to-action pair and its note appear on the home page and on the contact page. */
export const booking = {
  callLabel: 'Telefonhívás',
  emailLabel: 'E-mail küldése',
  callBody:
    'Időpontfoglaláshoz telefonszámomon várom hívásod. Kérlek légy türelemmel! Ha dolgozok, nem tudom felvenni a telefont, de vissza foglak hívni.',
} as const;
