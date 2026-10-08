// The shared lazy-enhancer loader (P5 plan): a region marked data-fx-lazy="<module>" imports its
// enhancer the first time a pointer or focus reaches it — never on first load, so Home's
// first-party JS budget is untouched (07 §2; the consent-panel and attribution precedents). The
// first-load cost is this module plus one IntersectionObserver-backed watch; each enhancer module
// is measured separately against its cap (13 §7).
//
// The trigger resolves the two races a first-interaction loader has:
// - The observer arms a region when it intersects; if the pointer is ALREADY inside at that
//   moment (the visitor scrolled first, the observer fired after), no pointerover will ever come
//   while the pointer rests inside — so :hover at arm time runs at once.
// - A click on a demo trigger can arrive before the module does. The click marks the trigger
//   (data-demo-pending); once the module wires its handlers, it opens the panel for the marked
//   trigger — the click itself can't be replayed without double-firing the tracking events.
const MODULES: Record<string, () => Promise<{ enhance: (scope: ParentNode) => void }>> = {
  faq: () => import('@/components/sections/faq-enhance').then((m) => ({ enhance: m.enhanceFaq })),
  home: () => import('@/components/sections/home/home-enhance').then((m) => ({ enhance: m.enhanceHome })),
  // Each demo trigger is its own region (P6 part A2, S8): only reaching for a demo loads it
  demo: () => import('@/components/demos/demo-enhance').then((m) => ({ enhance: m.enhanceDemos })),
  // The mega menu's full panel, fetched when a visitor reaches for the Services button (L8, decision 0026)
  mega: () => import('@/components/layout/mega-enhance').then((m) => ({ enhance: m.enhanceMega })),
};

// One shared observer: a region enters the viewport → arm its trigger; the first pointerover,
// focusin or click inside it → import and run the enhancer once.
const armed = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | undefined;

function shared(): IntersectionObserver {
  observer ??= new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer?.unobserve(target);
      const run = armed.get(target);
      if (!run) continue;
      const region = target as Element;
      if (region.matches(':hover')) {
        // The pointer is already inside: no pointerover will come. Run now.
        armed.delete(region);
        run();
        continue;
      }
      const trigger = (event: Event) => {
        region.removeEventListener('pointerover', trigger);
        region.removeEventListener('focusin', trigger);
        region.removeEventListener('click', trigger, true);
        armed.delete(region);
        if (event.type === 'click') {
          const demo = (event.target as Element | null)?.closest?.('[data-demo]');
          demo?.setAttribute('data-demo-pending', 'true');
        }
        run();
      };
      region.addEventListener('pointerover', trigger, { passive: true });
      region.addEventListener('focusin', trigger);
      region.addEventListener('click', trigger, { capture: true, passive: true });
    }
  });
  return observer;
}

// A click on a demo trigger its module has not wired yet: the document-level catch marks the
// trigger pending, so the module opens the panel for that click once it arrives. Two cases: the
// region has not armed (it sits below the fold, and the click scrolled it into view for the first
// time), so the catch runs it too; or the pointer that came just before the click already asked for
// the module, which is still loading (a trigger is its own region, so the two are milliseconds
// apart). `armed` is read live, so it stays current after each navigation.
let clickCatchInstalled = false;
function installClickCatch() {
  if (clickCatchInstalled) return;
  clickCatchInstalled = true;
  document.addEventListener(
    'click',
    (event) => {
      const demo = (event.target as Element | null)?.closest?.('[data-demo]');
      if (!demo || demo.getAttribute('data-demo-wired') === 'true') return;
      demo.setAttribute('data-demo-pending', 'true');
      const region = demo.closest('[data-fx-lazy]');
      const run = region ? armed.get(region) : undefined;
      if (!region || !run) return;
      armed.delete(region);
      run();
    },
    { capture: true, passive: true },
  );
}

// Runs again after each client navigation (like revealOnce), so a new page's regions arm too.
export function armLazyEnhancers(scope: ParentNode = document) {
  installClickCatch();
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
