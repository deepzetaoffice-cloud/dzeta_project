'use client';

import { usePathname } from 'next/navigation';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { contentGroup, HAS_ATTRIBUTION, trackEvent } from '@/lib/analytics';
import type { Gtm } from '@/lib/env';
import { loadGtm } from '@/lib/tracking/gtm';

// The tracking runtime (docs/ai/09; P3 plan, G): one client island, mounted once by SiteDocument,
// rendering nothing until Cookie settings is opened. Like the effect runtime (FxRuntime), it works
// through one delegated listener, with no tracking code in the components it reacts to.
// - Page views (09 §2.9): one page_view on each page load and each client navigation, a frame after
//   the route changes so the new page's title is in place; a repeat of the same address is skipped.
// - Tracked clicks: a click on a CTA or a link is handed to clicks.ts, imported on the first one, which
//   reports cta_click, contact_click or outbound_click.
// - GTM (09 §2.1, C56): loaded once, after hydration, when its container ID is set (gtm.ts).
// - Click IDs and campaign tags (09 §2.8): when the address carries one, the capture code is imported
//   and stores them with Marketing consent, or once a choice grants it (attribution.ts).
// - The consent banner's buttons (data-consent-action): Accept all and Reject all take the banner away
//   at once and apply the choice as soon as the consent code arrives; Choose settings, like the
//   footer's Cookie settings (data-consent-settings), opens the settings panel. Neither the consent code
//   nor the panel's is in the first load: only a visitor who uses them downloads them (Home's
//   first-party JavaScript budget, 07 §2; the owner, 2026-10-02).
// - While the banner shows, its height is kept in --dz-consent-height, so the page's end and a focused
//   control scroll clear of it (WCAG 2.4.11; effects.css).
// - It marks <html data-tracking="ready">, so the footer's Cookie settings button shows only once it
//   works.
// From the banner nothing is ever withdrawn (nothing was granted before the banner asked), so it
// passes no cookies to delete; the settings panel does. The consent copy loads with the panel too: its
// "Saved" line comes back from it, for the status message.

const ConsentSettings = lazy(() => import('@/components/layout/ConsentSettings'));

export type TrackingRuntimeProps = {
  // The GTM container (NEXT_PUBLIC_GTM_ID), or null: then no GTM, and the settings panel lists no vendor
  gtm: Gtm | null;
};

// When the banner goes, focus that was on it moves to the page's <main>, so it's never lost. A choice
// saved in the settings panel opened from the banner counts too: the closing dialog can't hand focus
// back to the banner's Choose settings, which is already leaving.
function focusMain() {
  document.getElementById('main')?.focus();
}

export function TrackingRuntime({ gtm }: TrackingRuntimeProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const banner = useRef<Element | null>(null);
  // The button that opened the settings panel: the banner's Choose settings or the footer's button
  const opener = useRef<Element | null>(null);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (location.href === lastPage.current) return;
      lastPage.current = location.href;
      trackEvent('page_view', {
        page_location: location.href,
        page_title: document.title,
        content_group: contentGroup(location.pathname),
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (gtm) loadGtm(gtm);
  }, [gtm]);

  useEffect(() => {
    const root = document.documentElement;
    banner.current = document.querySelector('[data-consent-banner]');
    const sizing = new ResizeObserver(([entry]) => {
      const height = entry?.borderBoxSize[0]?.blockSize ?? 0;
      root.style.setProperty('--dz-consent-height', `${Math.ceil(height)}px`);
    });
    if (banner.current) sizing.observe(banner.current);

    if (HAS_ATTRIBUTION.test(location.search)) {
      void Promise.all([import('@/lib/tracking/consent'), import('@/lib/tracking/attribution')]).then(
        ([{ currentConsent }, { captureAttribution }]) => captureAttribution(currentConsent().choice.marketing),
      );
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const control = target?.closest<HTMLElement>('[data-consent-action], [data-consent-settings]');
      if (control) {
        const action = control.dataset.consentAction;
        if (action === 'accept' || action === 'reject') {
          const on = action === 'accept';
          if (banner.current?.contains(document.activeElement)) focusMain();
          root.removeAttribute('data-consent');
          void import('@/lib/tracking/consent').then(({ applyChoice }) =>
            applyChoice({ analytics: on, marketing: on }),
          );
          return;
        }
        opener.current = control;
        setStatus('');
        setSettingsOpen(true);
        return;
      }
      if (target?.closest('[data-cta], a[href]')) {
        void import('@/lib/tracking/clicks').then(({ reportClick }) => reportClick(target));
      }
    };
    document.addEventListener('click', onClick);
    root.setAttribute('data-tracking', 'ready');
    return () => {
      document.removeEventListener('click', onClick);
      sizing.disconnect();
    };
  }, []);

  return (
    <>
      {settingsOpen ? (
        <Suspense fallback={null}>
          <ConsentSettings
            gtm={gtm !== null}
            onClose={(savedMessage) => {
              setSettingsOpen(false);
              if (!savedMessage) return;
              setStatus(savedMessage);
              if (banner.current?.contains(opener.current)) focusMain();
            }}
          />
        </Suspense>
      ) : null}
      <p role="status" className="sr-only">
        {status}
      </p>
    </>
  );
}
