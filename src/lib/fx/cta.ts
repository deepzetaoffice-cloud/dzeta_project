// The gradient on one CTA at a time (conflict C42; P2 plan, G, H3 and M). While an in-page primary CTA
// is on screen (a hero's, P5; the footer finale's; the sheet's while it's open), it alone carries the
// gradient. Otherwise the header CTA takes it on desktop, and the sticky bar shows on mobile; the
// header CTA stays outline there (effects.css). Until every in-page CTA has been seen once, nothing
// changes, so a hero CTA on screen at load never shares the view with a charged header or the bar for
// a frame. Without JavaScript the header stays outline and the bar never shows.
// The first state appears without a slide or fade (13 §2.1: nothing moves without the visitor): the
// transitions apply only under data-cta-armed (effects.css), set once that state has been laid out.
import { watch } from './observer';

const ARMED = 'data-cta-armed';

// Returns the function that stops watching, for the next client navigation.
export function startCta(): () => void {
  const header = document.querySelector<HTMLElement>('[data-cta="header"]');
  const sticky = document.querySelector<HTMLElement>('[data-fx-sticky]');
  if (!header && !sticky) return () => {};
  const root = document.documentElement;
  // The bar's own CTA is never an in-page one, or it would hide itself as it showed.
  const primaries = [...document.querySelectorAll('[data-cta="primary"]')].filter((cta) => !sticky?.contains(cta));
  const unseen = new Set(primaries);
  const onScreen = new Set<Element>();
  const update = () => {
    const none = onScreen.size === 0;
    header?.toggleAttribute('data-charged', none);
    sticky?.toggleAttribute('data-shown', none);
    if (!root.hasAttribute(ARMED)) {
      document.body.getBoundingClientRect();
      root.setAttribute(ARMED, '');
    }
  };
  const stops = primaries.map((cta) =>
    watch(cta, (visible) => {
      unseen.delete(cta);
      if (visible) onScreen.add(cta);
      else onScreen.delete(cta);
      if (unseen.size === 0) update();
    }),
  );
  if (primaries.length === 0) update();
  return () => {
    stops.forEach((stop) => stop());
    root.removeAttribute(ARMED);
  };
}
