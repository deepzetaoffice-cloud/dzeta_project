// The FAQ enhancement (P5, docs/design/faq.md): the topic-chip filter, copy-link buttons, hash
// deep links and the faq_expand event. Loaded lazily — never on Home's first load (07 §2; the
// P5 plan's budget rule) — by the shared lazy loader (fx/lazy.ts) on the first pointer or focus
// inside a [data-faq-region] section. No React: it decorates the server-rendered <details>.
import { trackEvent } from '@/lib/analytics';

// faq_expand fires once per question per page view (faq.md): a question opened again (or one
// opened through a deep link) doesn't fire twice.
export function enhanceFaq(scope: ParentNode): void {
  const items = [...scope.querySelectorAll<HTMLElement>('[data-faq-item]')];
  if (items.length === 0) return;
  const expanded = new Set<string>();

  const count = scope.querySelector<HTMLElement>('[data-faq-count]');
  const chips = [...scope.querySelectorAll<HTMLButtonElement>('[data-faq-topic]')];
  const chipBar = scope.querySelector<HTMLElement>('[data-faq-chips]');

  // The copy-link button (faq.md): a Tier 1 link icon, aria-label, copies #faq-<id>
  for (const item of items) {
    const id = item.id;
    const summary = item.querySelector('summary');
    if (!summary) continue;
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'dz-faq-copy';
    copy.setAttribute('aria-label', 'Copy a link to this question');
    copy.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10.25 13.75a3.75 3.75 0 0 1 0-5.25l2.5-2.5a3.75 3.75 0 0 1 5.25 5.25l-1.25 1.25M13.75 10.25a3.75 3.75 0 0 1 0 5.25l-2.5 2.5a3.75 3.75 0 0 1-5.25-5.25l1.25-1.25"/></svg>';
    copy.addEventListener('click', () => {
      void navigator.clipboard?.writeText(`${location.origin}${location.pathname}#${id}`);
      copy.setAttribute('data-copied', '');
      window.setTimeout(() => copy.removeAttribute('data-copied'), 1200);
    });
    item.querySelector('.dz-faq-a')?.append(copy);
  }

  // faq_expand: once per question per page view, on open (not close)
  const announce = (message: string) => {
    if (count) count.textContent = message;
  };
  const onToggle = (event: Event) => {
    const item = event.target as HTMLDetailsElement;
    if (!item.open || !item.id) return;
    const id = item.id.replace(/^faq-/, '');
    if (expanded.has(id)) return;
    expanded.add(id);
    trackEvent('faq_expand', { faq_id: id });
  };
  for (const item of items) item.addEventListener('toggle', onToggle);

  // The chip filter: a toggle button group with aria-pressed; filtering hides questions visually
  // only while JS runs (the HTML always holds every question — faq.md)
  const applyFilter = () => {
    const active = chips
      .filter((chip) => chip.getAttribute('aria-pressed') === 'true')
      .map((chip) => chip.dataset.faqTopic);
    const show = active.length === 0;
    let visible = 0;
    for (const item of items) {
      const match = show || active.includes(item.dataset.faqTopic);
      item.toggleAttribute('hidden', !match);
      if (match) visible++;
    }
    announce(show ? `Showing all ${items.length} questions.` : `Showing ${visible} of ${items.length} questions.`);
  };
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      applyFilter();
    });
  }

  // A deep link opens and focuses its question (faq.md): #faq-<id>
  const deepLink = () => {
    const id = location.hash.slice(1);
    if (!id.startsWith('faq-')) return;
    const target = (scope as Element).querySelector?.(`#${id}`) as HTMLDetailsElement | null;
    if (!target) return;
    target.open = true;
    target.scrollIntoView({ block: 'start' });
    target.querySelector('summary')?.focus();
  };
  deepLink();
  window.addEventListener('hashchange', deepLink);

  // The chips are on screen from the first paint (CSS: scripting). The mark shows them in a browser
  // without that query, and tells the tests the filter is armed.
  chipBar?.setAttribute('data-shown', '');
}
