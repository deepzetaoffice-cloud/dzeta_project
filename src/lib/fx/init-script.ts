import { EFFECTS_KEY, FULL, FX_MEDIA, LOW_MEMORY_GB, REDUCED, REDUCED_TRANSPARENCY } from './preferences';

// The no-flash script (conflict C40): SiteDocument mounts it once per document, in <head>, so Reduce
// effects is on <html> before the first paint. It's a static string built only from our own
// constants, never from request or visitor data, so a hash-based CSP stays possible and every page
// stays static. It repeats resolveEffects() (preferences.ts); init-script.test.ts runs both over
// every combination of choice, hint and setting. Light only in V1 (C77), so there is no theme here.
const js = JSON.stringify;

export const initScript =
  `(function(){var d=document.documentElement,e,s=false,l=false;` +
  `try{e=localStorage.getItem(${js(EFFECTS_KEY)})}catch(x){}` +
  `try{s=!matchMedia(${js(FX_MEDIA)}).matches||matchMedia(${js(REDUCED_TRANSPARENCY)}).matches;` +
  `var n=navigator,c=n.connection;l=!!(c&&c.saveData)||n.deviceMemory<=${LOW_MEMORY_GB}}catch(x){}` +
  `if(s||e===${js(REDUCED)}||(e!==${js(FULL)}&&l))d.setAttribute("data-effects",${js(REDUCED)})})()`;
