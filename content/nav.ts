/**
 * Primary navigation. The hrefs mirror the WordPress permalinks exactly —
 * changing one here silently breaks an indexed URL.
 */

export type NavItem = {
  href: string;
  label: string;
};

export const navItems: NavItem[] = [
  { href: '/bemutatkozas/', label: 'Bemutatkozás' },
  { href: '/arak/', label: 'Árak' },
  { href: '/arak/elso-masszazs/', label: 'Az első masszázs' },
  { href: '/hazirend/', label: 'Házirend' },
  { href: '/kapcsolat/', label: 'Kapcsolat' },
];

export const homeItem: NavItem = { href: '/', label: 'Főoldal' };
