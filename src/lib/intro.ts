/**
 * First-load intro curtain — shared constants.
 *
 * The animation itself is pure CSS (see the "Intro curtain" block in
 * globals.css); the only job of the script below is to decide whether it should
 * play at all, and it has to make that decision before the first paint. That is
 * why it ships as a blocking inline script in <head> rather than as a component
 * effect: an effect runs after hydration, by which time the page has already
 * been on screen and the curtain would read as a glitch rather than an opener.
 */

/** Marks the visit as having seen the curtain. */
export const INTRO_STORAGE_KEY = 'libra-intro-played';

/** Attribute set on <html> while the curtain is on screen. */
export const INTRO_ATTRIBUTE = 'data-intro';

/** Total run time of the sequence: mark in, rule draws, curtain lifts. */
export const INTRO_TOTAL_MS = 1300;

/** Small tail so the attribute is only dropped after the lift has finished. */
const INTRO_CLEANUP_MS = INTRO_TOTAL_MS + 150;

/**
 * sessionStorage, not localStorage: the curtain belongs to the arrival, so it
 * plays on the first load of a visit and never again while that visit lasts —
 * including across every in-site navigation. Switch this to localStorage to
 * make it a genuine once-ever event.
 *
 * Any failure — private browsing, storage disabled, quota — falls through to
 * *not* playing. A missed animation is invisible; a curtain that cannot be
 * dismissed is a broken site.
 */
export const INTRO_BOOTSTRAP = `(function(){try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}'))return;sessionStorage.setItem('${INTRO_STORAGE_KEY}','1');var r=document.documentElement;r.setAttribute('${INTRO_ATTRIBUTE}','');setTimeout(function(){r.removeAttribute('${INTRO_ATTRIBUTE}')},${INTRO_CLEANUP_MS})}catch(e){}})()`;
