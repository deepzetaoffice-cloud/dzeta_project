// The Home lazy enhancement (P5 S6): the demo stub panels, the story-chat replay and the LCP
// stamp. Loaded by the shared lazy loader (fx/lazy.ts) — on the first pointer, focus or click
// near a marked region — never at first load (07 §2; the P5 plan's budget rule). No React: it
// decorates the server-rendered markup. demo_open fires when a panel actually opens (the
// enhancement owns the event; the click path in clicks.ts only arms the pending trigger).
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DemoStubPanel } from '@/components/demos/DemoStub';
import { trackEvent } from '@/lib/analytics';

// The demo panel: mounts after the first trigger click. The trigger button becomes the panel's
// opener; a second click toggles it away. (A real modal's inert/focus work arrives with the P7
// demos' own plans; the stub panel is non-modal and labelled as such.) A trigger the loader
// marked pending (its click arrived before this module did) opens at once — one open, one event.
export function enhanceDemos(scope: ParentNode): void {
  for (const trigger of [...scope.querySelectorAll<HTMLButtonElement>('[data-demo]')]) {
    if (trigger.dataset.demoWired === 'true') continue;
    trigger.dataset.demoWired = 'true';
    const openPanel = () => {
      const demoId = trigger.dataset.demo ?? '';
      // One panel per trigger; a second click toggles it
      let panel = trigger.parentElement?.querySelector<HTMLElement>(`[data-demo-panel="${demoId}"]`);
      if (panel) {
        panel.remove();
        return;
      }
      panel = document.createElement('div');
      panel.dataset.demoPanel = demoId;
      panel.className = 'dz-demo-mount';
      panel.innerHTML = renderToStaticMarkup(createElement(DemoStubPanel));
      trigger.after(panel);
      trackEvent('demo_open', { demo_id: demoId });
      (panel.querySelector<HTMLAnchorElement>('a') ?? panel).focus({ preventScroll: true });
    };
    trigger.addEventListener('click', openPanel);
    // The click that loaded this module (fx/lazy.ts marked it pending): open now, once
    if (trigger.dataset.demoPending === 'true') {
      trigger.removeAttribute('data-demo-pending');
      openPanel();
    }
  }
}

// The loader's entry point: the three Home enhancers in one pass
export function enhanceHome(scope: ParentNode): void {
  enhanceDemos(scope);
  enhanceStoryReplay(scope);
  enhanceLcpStamp(scope);
}

// The story-chat replay (13 §2.1: stories play once, and a replay control is offered): resets the
// chat's play state by removing and re-adding the play class inside a reflow.
export function enhanceStoryReplay(scope: ParentNode): void {
  const chat = scope.querySelector<HTMLElement>('.dz-story-chat');
  if (!chat) return;
  const replay = document.createElement('button');
  replay.type = 'button';
  replay.className = 'dz-chat-replay';
  replay.textContent = 'Replay';
  replay.setAttribute('aria-label', 'Replay the example conversation');
  replay.addEventListener('click', () => {
    chat.classList.remove('dz-chat--played');
    void chat.offsetWidth; // reflow, so the play state restarts
    chat.classList.add('dz-chat--played');
  });
  chat.append(replay);
  // Mark it played once the one-shot finishes (the CSS delays run ~2.5 s)
  window.setTimeout(() => chat.classList.add('dz-chat--played'), 2600);
}

// The LCP stamp (§06): this visit's real LCP, read from the platform's PerformanceObserver —
// buffered, so the entry exists even though the observation starts late (after the first
// interaction with the region). No web-vitals dependency in P5 (that arrives with the P7 label).
export function enhanceLcpStamp(scope: ParentNode): void {
  const target = scope.querySelector<HTMLElement>('[data-lcp-value]');
  if (!target) return;
  const paint = performance.getEntriesByType('paint').find((entry) => entry.name === 'largest-contentful-paint');
  if (paint) {
    target.textContent = `${(paint.startTime / 1000).toFixed(2)} s`;
    return;
  }
  // The buffered LCP entry (Chromium); the fallback label stays if the browser doesn't report one
  try {
    const observer = new PerformanceObserver((list) => {
      const entry = list.getEntries().at(-1);
      if (entry) target.textContent = `${(entry.startTime / 1000).toFixed(2)} s`;
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // Not supported: the honest "not measured in this browser" stays (footer.md's rule)
  }
}
