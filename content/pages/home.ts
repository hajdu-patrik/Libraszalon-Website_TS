/**
 * Home page copy.
 *
 * Every sentence here already exists on the legacy site — nothing is newly
 * written. The service grid deliberately has no section heading because the
 * original does not have one either. The closing call-to-action reuses the
 * booking sentence from /kapcsolat/ verbatim; only the button labels are new,
 * and those are interface chrome rather than content.
 */

export const home = {
  heroQuote: ['„A masszázs nem luxus.', 'Az egészség és a boldogság alapfeltétele.”'],
  heroImageAlt:
    'Ellazult vendég masszázs közben a Libra Masszázs Szalon kezelőágyán',

  reviews: {
    eyebrow: 'Érdekel mások véleménye? Kíváncsi vagy mások mit gondolnak?',
    title: 'Vélemények',
  },

  cta: {
    /** Verbatim from /kapcsolat/. */
    body: 'Időpontfoglaláshoz telefonszámomon várom hívásod. Kérlek légy türelemmel! Ha dolgozok, nem tudom felvenni a telefont, de vissza foglak hívni.',
    callLabel: 'Telefonhívás',
    emailLabel: 'E-mail küldése',
    rulesLabel: 'Házirend',
  },
} as const;
