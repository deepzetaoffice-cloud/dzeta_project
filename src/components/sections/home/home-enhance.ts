// The Home lazy enhancement (P5 S6): the story-chat replay and the LCP stamp. Loaded by the shared
// lazy loader (fx/lazy.ts) on the first pointer, focus or click near a marked region, never at
// first load (07 §2; the P5 plan's budget rule). No React: it decorates the server-rendered markup.
// The demo panels moved to src/components/demos/demo-enhance.ts (P6 part A2, S8), each trigger its
// own region, so a touch on the hero no longer loads them.

// The loader's entry point: Home's enhancers in one pass
export function enhanceHome(scope: ParentNode): void {
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
