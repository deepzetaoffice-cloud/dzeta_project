// The sticky CTA bar's hand-off (docs/design/conversion-path.md; C82): below 1,280 px the bar shows
// while no in-page audit CTA (a hero's, the footer finale's) is on screen, and slides away when one is.
// Until every in-page CTA has been seen once nothing changes, so a hero CTA on screen at load never
// shares the view with the bar for a frame. The first state appears without a slide: the transition
// applies only under data-cta-armed (globals.css), set once that state has been laid out. Without
// JavaScript the bar never shows.

const ARMED = 'data-cta-armed';

// Returns the function that stops watching, for the next client navigation.
export function startCta(): () => void {
  const sticky = document.querySelector<HTMLElement>('[data-fx-sticky]');
  if (!sticky) return () => {};
  const root = document.documentElement;
  // The bar's own CTA and the mobile menu's are never in-page ones.
  const primaries = [...document.querySelectorAll('[data-cta="primary"]')].filter(
    (cta) => !sticky.contains(cta) && !cta.closest('dialog'),
  );
  const unseen = new Set(primaries);
  const onScreen = new Set<Element>();
  const update = () => {
    sticky.toggleAttribute('data-shown', onScreen.size === 0);
    if (!root.hasAttribute(ARMED)) {
      document.body.getBoundingClientRect();
      root.setAttribute(ARMED, '');
    }
  };
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      unseen.delete(target);
      if (isIntersecting) onScreen.add(target);
      else onScreen.delete(target);
    }
    if (unseen.size === 0) update();
  });
  for (const cta of primaries) observer.observe(cta);
  if (primaries.length === 0) update();
  return () => {
    observer.disconnect();
    root.removeAttribute(ARMED);
  };
}
