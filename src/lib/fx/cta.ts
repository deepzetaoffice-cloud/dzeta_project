// The gradient on one CTA at a time (conflict C42; P2 plan, G and H3). The header CTA takes it on
// desktop while no in-page primary CTA is on screen (the review page's hero now; P5's heroes and part
// C's finale later); on mobile it stays outline (effects.css), because the sticky bar carries it (part
// C). Until every in-page CTA has been seen once, nothing changes, so a hero CTA on screen at load
// never shares the view with a charged header for a frame. Without JavaScript the header stays outline.
import { watch } from './observer';

// Returns the function that stops watching, for the next client navigation.
export function startCta(): () => void {
  const header = document.querySelector<HTMLElement>('[data-cta="header"]');
  if (!header) return () => {};
  const primaries = [...document.querySelectorAll('[data-cta="primary"]')];
  const unseen = new Set(primaries);
  const onScreen = new Set<Element>();
  const update = () => header.toggleAttribute('data-charged', onScreen.size === 0);
  const stops = primaries.map((cta) =>
    watch(cta, (visible) => {
      unseen.delete(cta);
      if (visible) onScreen.add(cta);
      else onScreen.delete(cta);
      if (unseen.size === 0) update();
    }),
  );
  if (primaries.length === 0) update();
  return () => stops.forEach((stop) => stop());
}
