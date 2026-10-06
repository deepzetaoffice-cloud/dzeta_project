// The shared lazy-enhancer loader (P5 plan): a region marked data-fx-lazy="<module>" imports its
// enhancer the first time a pointer or focus reaches it — never on first load, so Home's
// first-party JS budget is untouched (07 §2; the consent-panel and attribution precedents). The
// first-load cost is this module plus one IntersectionObserver-backed watch; each enhancer module
// is measured separately against its cap (13 §7).
//
// The module map is static, so the bundler can code-split each entry; the loader itself stays
// tiny (target ≤ 0.2 KB gzipped wiring — measured at the S7 gate).
const MODULES: Record<string, () => Promise<{ enhance: (scope: ParentNode) => void }>> = {
  faq: () => import('@/components/sections/faq-enhance').then((m) => ({ enhance: m.enhanceFaq })),
  home: () => import('@/components/sections/home/home-enhance').then((m) => ({ enhance: m.enhanceHome })),
};

// One shared observer: a region enters the viewport → arm its trigger; the first pointerover or
// focusin inside it → import and run the enhancer once.
const armed = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | undefined;

function shared(): IntersectionObserver {
  observer ??= new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer?.unobserve(target);
      const run = armed.get(target);
      if (!run) continue;
      // The trigger: the first pointer or focus inside the region. Both are passive captures;
      // they remove themselves after the first hit.
      const trigger = () => {
        target.removeEventListener('pointerover', trigger);
        target.removeEventListener('focusin', trigger);
        armed.delete(target);
        run();
      };
      target.addEventListener('pointerover', trigger, { once: false, passive: true });
      target.addEventListener('focusin', trigger, { once: false, passive: true });
    }
  });
  return observer;
}

// Runs again after each client navigation (like revealOnce), so a new page's regions arm too.
export function armLazyEnhancers(scope: ParentNode = document) {
  for (const region of scope.querySelectorAll<HTMLElement>('[data-fx-lazy]')) {
    const name = region.dataset.fxLazy ?? '';
    const load = MODULES[name];
    if (!load) continue;
    if (armed.has(region)) continue;
    armed.set(region, () => {
      void load().then((module) => module.enhance(region));
    });
    shared().observe(region);
  }
}
