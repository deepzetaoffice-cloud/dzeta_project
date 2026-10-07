// The demo stub enhancement (P5 S6, moved out of home-enhance.ts in P6 part A2, S8). Loaded by the
// shared lazy loader (fx/lazy.ts) on the first pointer, focus or click on a demo trigger — each
// trigger is its own region — never at first load. No React: it clones the page's server-rendered
// panel (DemoPanelTemplate). demo_open fires when a panel actually opens (the enhancement owns the
// event; the click path in clicks.ts only arms the pending trigger).
import { trackEvent } from '@/lib/analytics';

// One panel per trigger; a second click toggles it away. (A real modal's inert/focus work arrives
// with the P7 demos' own plans; the stub panel is non-modal and labelled as such.) A trigger the
// loader marked pending (its click arrived before this module did) opens at once: one open, one event.
export function enhanceDemos(scope: ParentNode): void {
  const template = document.querySelector<HTMLElement>('[data-demo-template]')?.firstElementChild;
  if (!template) return;
  const own = scope instanceof Element && scope.matches('[data-demo]') ? [scope as HTMLElement] : [];
  for (const trigger of [...own, ...scope.querySelectorAll<HTMLElement>('[data-demo]')]) {
    if (trigger.dataset.demoWired === 'true') continue;
    trigger.dataset.demoWired = 'true';
    const openPanel = () => {
      const demoId = trigger.dataset.demo ?? '';
      let panel = trigger.parentElement?.querySelector<HTMLElement>(`[data-demo-panel="${demoId}"]`);
      if (panel) {
        panel.remove();
        return;
      }
      panel = document.createElement('div');
      panel.dataset.demoPanel = demoId;
      panel.className = 'dz-demo-mount';
      panel.append(template.cloneNode(true));
      trigger.after(panel);
      trackEvent('demo_open', { demo_id: demoId });
      (panel.querySelector<HTMLAnchorElement>('a') ?? panel).focus({ preventScroll: true });
    };
    trigger.addEventListener('click', openPanel);
    if (trigger.dataset.demoPending === 'true') {
      trigger.removeAttribute('data-demo-pending');
      openPanel();
    }
  }
}
