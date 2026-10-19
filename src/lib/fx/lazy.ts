// The lazy enhancements (07 §3): a region marked data-fx-lazy="<name>" loads its module on the first
// pointer, focus or click inside it once it has come into view, never at first load. A click on a
// demo trigger that arrives before its module is marked pending, so the module opens it at once.

const MODULES: Record<string, () => Promise<{ enhance: (scope: ParentNode) => void }>> = {
  faq: () => import('./faq').then((m) => ({ enhance: m.enhanceFaq })),
  demo: () => import('./demo').then((m) => ({ enhance: m.enhanceDemos })),
};

const armed = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | undefined;

function shared(): IntersectionObserver {
  observer ??= new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer?.unobserve(target);
      const run = armed.get(target);
      if (!run) continue;
      if (target.matches(':hover')) {
        armed.delete(target);
        run();
        continue;
      }
      const trigger = (event: Event) => {
        target.removeEventListener('pointerover', trigger);
        target.removeEventListener('focusin', trigger);
        target.removeEventListener('click', trigger, true);
        armed.delete(target);
        if (event.type === 'click') {
          const demo = (event.target as Element | null)?.closest?.('[data-demo]');
          demo?.setAttribute('data-demo-pending', 'true');
        }
        run();
      };
      target.addEventListener('pointerover', trigger, { passive: true });
      target.addEventListener('focusin', trigger);
      target.addEventListener('click', trigger, { capture: true, passive: true });
    }
  });
  return observer;
}

// A demo trigger clicked before its region came into view still opens: the click arms its module.
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

export function armLazyEnhancers(scope: ParentNode = document) {
  installClickCatch();
  for (const region of scope.querySelectorAll<HTMLElement>('[data-fx-lazy]')) {
    const load = MODULES[region.dataset.fxLazy ?? ''];
    if (!load || armed.has(region)) continue;
    armed.set(region, () => {
      void load().then((module) => module.enhance(region));
    });
    shared().observe(region);
  }
}
