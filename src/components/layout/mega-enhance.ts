// The mega menu's full panel, loaded on intent (L8, decision 0026; header.md). The shared lazy loader
// (fx/lazy.ts) imports this module on the first pointer, focus or click on the Services button; it
// fetches the panel's static fragment page (R179), parses it inertly (DOMParser runs no script) and
// moves the panel's nodes into the popover's mount. The lite panel (the hub, the live pillar pages)
// is already in the popover, so a slow or failed fetch never strands a visitor: every service is
// reachable through the hub. A failed fetch is tried again on the next use.
const FRAGMENT = '/shell/mega-menu'; // URL registry R179

export function enhanceMega(): void {
  const mount = document.querySelector<HTMLElement>('[data-mega-full]');
  if (!mount || mount.dataset.megaLoaded) return;
  mount.dataset.megaLoaded = 'loading';
  fetch(FRAGMENT, { credentials: 'same-origin' })
    .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
    .then((html) => {
      const panel = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-mega-panel]');
      if (!panel) throw new Error('no panel in the fragment');
      mount.replaceChildren(...panel.childNodes);
      mount.dataset.megaLoaded = 'true';
    })
    .catch(() => {
      delete mount.dataset.megaLoaded;
    });
}
