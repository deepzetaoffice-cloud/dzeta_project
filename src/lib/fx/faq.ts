import { trackEvent } from '@/lib/analytics';

// The FAQ module's enhancement (docs/design/faq.md), loaded on use by the lazy loader (lazy.ts). The
// base module is native <details>, so every answer is in the server HTML (08 §3) and works without
// JavaScript. This adds:
// - faq_expand with faq_id (09 §3), once per question per page view
// - deep links: a URL with #faq-<id> opens and focuses that question
export function enhanceFaq(scope: ParentNode): void {
  const items = [...scope.querySelectorAll<HTMLDetailsElement>('[data-faq-item]')];
  if (items.length === 0) return;
  const expanded = new Set<string>();

  const onToggle = (event: Event) => {
    const item = event.target as HTMLDetailsElement;
    if (!item.open || !item.id) return;
    const id = item.id.replace(/^faq-/, '');
    if (expanded.has(id)) return;
    expanded.add(id);
    trackEvent('faq_expand', { faq_id: id });
  };
  for (const item of items) item.addEventListener('toggle', onToggle);

  const deepLink = () => {
    const id = location.hash.slice(1);
    if (!id.startsWith('faq-')) return;
    const target = items.find((item) => item.id === id);
    if (!target) return;
    target.open = true;
    target.scrollIntoView({ block: 'start' });
    target.querySelector('summary')?.focus();
  };
  deepLink();
  addEventListener('hashchange', deepLink);
}
