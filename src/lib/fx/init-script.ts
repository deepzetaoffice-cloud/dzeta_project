import {
  EFFECTS_KEY,
  FULL,
  FX_MEDIA,
  LIGHT,
  LOW_MEMORY_GB,
  REDUCED,
  REDUCED_TRANSPARENCY,
  THEME_KEY,
} from './preferences';

// The no-flash script (conflict C40; P2 plan, C2): SiteDocument mounts it once per document, in
// <head>, so the visitor's theme and Reduce effects are on <html> before the first paint (the Next.js
// 16.3.7 guide "Preventing flash before hydration"). It's a static string built only from our own
// constants, never from request or visitor data, so P3's CSP can allow it by its hash and every page
// stays static. It repeats resolveEffects() (preferences.ts); init-script.test.ts runs both over
// every combination of choice, hint and setting.
//
// The color-scheme meta: Next.js 16.3.7 writes its metadata before this script (checked in the built
// head), so a light visitor's script sets that meta. If it were ever missing, the script adds one.
const js = JSON.stringify;

export const initScript =
  `(function(){var d=document.documentElement,t,e,s=false,l=false;` +
  `try{t=localStorage.getItem(${js(THEME_KEY)});e=localStorage.getItem(${js(EFFECTS_KEY)})}catch(x){}` +
  `if(t===${js(LIGHT)}){d.setAttribute("data-theme",${js(LIGHT)});` +
  `var m=document.querySelector('meta[name="color-scheme"]');` +
  `if(!m){m=document.createElement("meta");m.name="color-scheme";document.head.appendChild(m)}` +
  `m.content=${js(LIGHT)}}` +
  `try{s=!matchMedia(${js(FX_MEDIA)}).matches||matchMedia(${js(REDUCED_TRANSPARENCY)}).matches;` +
  `var n=navigator,c=n.connection;l=!!(c&&c.saveData)||n.deviceMemory<=${LOW_MEMORY_GB}}catch(x){}` +
  `if(s||e===${js(REDUCED)}||(e!==${js(FULL)}&&l))d.setAttribute("data-effects",${js(REDUCED)})})()`;
