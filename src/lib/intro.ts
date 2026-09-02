

export const INTRO_STORAGE_KEY = 'libra-intro-played';

export const INTRO_ATTRIBUTE = 'data-intro';

export const INTRO_TOTAL_MS = 1300;

const INTRO_CLEANUP_MS = INTRO_TOTAL_MS + 150;

export const INTRO_BOOTSTRAP = `(function(){try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}'))return;sessionStorage.setItem('${INTRO_STORAGE_KEY}','1');var r=document.documentElement;r.setAttribute('${INTRO_ATTRIBUTE}','');setTimeout(function(){r.removeAttribute('${INTRO_ATTRIBUTE}')},${INTRO_CLEANUP_MS})}catch(e){}})()`;
