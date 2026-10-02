import type { Gtm } from '@/lib/env';

// Google Tag Manager's loader (docs/ai/09 §2.1, conflict C56; the owner, 2026-10-02): what Google's own
// container snippet does, in a few lines. @next/third-parties' component brought Next.js's script loader
// with it, which put Home's lab LCP over 2.5 s; this costs a few hundred bytes. The tracking runtime
// calls it once, after hydration, so GTM loads at normal priority without competing with the first
// paint, and never idle-deferred (09 §2.2, lesson L6). By then the consent init script has set the
// Consent Mode defaults as dataLayer[0].

export const GTM_ORIGIN = 'https://www.googletagmanager.com';

// The container's address, with a GTM environment when one is set (previews; Google's snippet adds
// gtm_cookies_win=x with it, so the environment's cookie wins over a stale one).
export function gtmScriptSrc({ id, auth, preview }: Gtm): string {
  const query = new URLSearchParams({ id });
  if (auth && preview) {
    query.set('gtm_auth', auth);
    query.set('gtm_preview', preview);
    query.set('gtm_cookies_win', 'x');
  }
  return `${GTM_ORIGIN}/gtm.js?${query}`;
}

// Starts GTM: the gtm.js event Google's snippet pushes, then the script, async. Once per document.
export function loadGtm(gtm: Gtm): void {
  if (document.querySelector(`script[src^="${GTM_ORIGIN}/gtm.js"]`)) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = gtmScriptSrc(gtm);
  document.head.appendChild(script);
}
