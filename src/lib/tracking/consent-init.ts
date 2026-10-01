import { ASK, ASK_ATTRIBUTE, CONSENT_CLOCK_SKEW_MS, CONSENT_KEY, CONSENT_MAX_AGE_MS, CONSENT_VERSION } from './consent';
import { REGION_TIMING } from './region';

// The consent init script (docs/ai/09 §2.2 and §2.7, conflict C52; P3 plan, C): SiteDocument mounts
// it once per document, in <head>, after the no-flash script and before anything else can push to
// the data layer. It creates window.dataLayer and gtag(), then sets the Consent Mode defaults, so
// they're dataLayer[0], before GTM loads (GTM starts after hydration).
// - It reads the region hint (region.ts) and the stored choice, and applies resolveConsent()'s rule
//   (consent.ts); consent-init.test.ts runs both over every case.
// - When the banner is due it sets data-consent="ask" on <html>, so CSS shows the banner in the first
//   frame (nothing pops in later, 13 §2.1).
// It's a static string built only from our own constants, never from request or visitor data (C40),
// so every page stays static, and a hash-based CSP stays possible (C53).
const js = JSON.stringify;

export const consentInitScript =
  `(function(){var w=window,l=w.dataLayer=w.dataLayer||[],r=null,c=null,a=0,m=0,k=false,n=Date.now();` +
  `w.gtag=function(){l.push(arguments)};` +
  `try{var e=performance.getEntriesByType("navigation")[0],s=(e&&e.serverTiming)||[];` +
  `for(var i=0;i<s.length;i++)if(s[i].name===${js(REGION_TIMING)})r=s[i].description}catch(x){}` +
  `try{var o=JSON.parse(localStorage.getItem(${js(CONSENT_KEY)}));` +
  `if(o&&o.v===${CONSENT_VERSION}&&(o.a===0||o.a===1)&&(o.m===0||o.m===1)&&typeof o.t==="number"` +
  `&&n-o.t<=${CONSENT_MAX_AGE_MS}&&o.t<=n+${CONSENT_CLOCK_SKEW_MS})c=o}catch(x){}` +
  `if(c){a=c.a;m=c.m}else if(r==="row"){a=1;m=1}else{k=true}` +
  `var g="granted",d="denied";` +
  `w.gtag("consent","default",{analytics_storage:a?g:d,ad_storage:m?g:d,ad_user_data:m?g:d,` +
  `ad_personalization:m?g:d,functionality_storage:g,security_storage:g,personalization_storage:d});` +
  `if(k)document.documentElement.setAttribute(${js(ASK_ATTRIBUTE)},${js(ASK)})})()`;
