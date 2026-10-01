// The one IntersectionObserver (docs/ai/13 §3.4 and §7; P2 plan, G). One-shot effects, marked
// data-fx-once, get `.is-in` the first time they enter the viewport and are then left alone. Watchers
// hear every change: the CTA hand-off and the header's scroll sentinel. Without JavaScript nothing
// adds `.is-in`, so a one-shot effect's resting state is always its final state (13 §3.3).

export type Watcher = (visible: boolean) => void;

const watchers = new Map<Element, Watcher>();
let observer: IntersectionObserver | undefined;

function shared() {
  observer ??= new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      const watcher = watchers.get(target);
      if (watcher) watcher(isIntersecting);
      else if (isIntersecting) {
        target.classList.add('is-in');
        observer?.unobserve(target);
      }
    }
  });
  return observer;
}

// Returns the function that stops watching.
export function watch(element: Element, watcher: Watcher) {
  watchers.set(element, watcher);
  shared().observe(element);
  return () => {
    watchers.delete(element);
    observer?.unobserve(element);
  };
}

// Observing an element twice is harmless, so this runs again after each client navigation.
export function revealOnce(scope: ParentNode = document) {
  for (const element of scope.querySelectorAll('[data-fx-once]:not(.is-in)')) shared().observe(element);
}
