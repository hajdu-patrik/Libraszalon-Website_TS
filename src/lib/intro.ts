export const INTRO_STORAGE_KEY = 'libra-intro-played';

export const INTRO_ATTRIBUTE = 'data-intro';

/** Length of the .intro-veil animation in globals.css (0.7s delay + 0.6s lift). */
export const INTRO_TOTAL_MS = 1300;

const INTRO_CLEANUP_MS = INTRO_TOTAL_MS + 150;

/** Inlined in <head> so the veil is decided before first paint: it plays once per
 *  browser session and the attribute is removed again once the curtain has lifted. */
export const INTRO_BOOTSTRAP = `(function(){try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}'))return;sessionStorage.setItem('${INTRO_STORAGE_KEY}','1');var r=document.documentElement;r.setAttribute('${INTRO_ATTRIBUTE}','');setTimeout(function(){r.removeAttribute('${INTRO_ATTRIBUTE}')},${INTRO_CLEANUP_MS})}catch(e){}})()`;
