'use client';

import { usePathname } from 'next/navigation';
import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import type { ConsentSettingsProps } from '@/components/layout/ConsentSettings';
import { contentGroup, HAS_ATTRIBUTION, trackEvent } from '@/lib/analytics';
import type { Gtm } from '@/lib/env';
import { loadGtm } from '@/lib/tracking/gtm';

// The tracking runtime (docs/ai/09; P3 plan, G): one client island, mounted once by SiteDocument,
// rendering nothing until Cookie settings is opened. Like the effect runtime (FxRuntime), it works
// through delegated listeners, with no tracking code in the components it reacts to.
// - Page views (09 §2.9): one page_view on each page load and each client navigation, a frame after
//   the route changes so the new page's title is in place; a repeat of the same address is skipped.
// - Tracked clicks: a click on a CTA or a link is handed to clicks.ts, imported on the first one, which
//   reports cta_click, contact_click or outbound_click.
// - GTM (09 §2.1, C56): loaded once, after hydration and past the first paint, when its container ID
//   is set (gtm.ts) — deferred to afterFirstPaint below (decision 0022, the owner, 2026-10-05), so
//   gtm.js and its tags never compete with the main thread's paint work on the TBT window.
// - Click IDs and campaign tags (09 §2.8): when the landing's address carries one, the capture code
//   (attribution.ts) is imported on the visitor's first action (a scroll, a tap, a click or a key) and
//   given that address, so a campaign landing's first load stays within Home's cap (07 §2, 0021). It
//   reads the consent from dataLayer, so it doesn't load the consent code too.
// - The consent banner's buttons (data-consent-action): Accept all and Reject all take the banner away
//   at once (inert while it fades) and apply the choice as soon as the consent code arrives; Choose
//   settings, like the footer's Cookie settings (data-consent-settings), opens the settings panel.
//   Neither the consent code nor the panel's is in the first load (Home's first-party JavaScript
//   budget, 07 §2; the owner, 2026-10-02): both start loading when a pointer or focus reaches one of
//   those buttons, so they're usually there by the click. If a download fails, the banner comes back
//   (nothing was stored), or the panel reports it in the status line; the page itself is never lost.
// - While the banner shows, --dz-consent-height holds how far it reaches up from the window's bottom
//   (its height plus the corner panel's offset), so the page's end and a focused control scroll clear
//   of it (WCAG 2.4.11; effects.css). Only while it shows.
// - A page restored from the back/forward cache is checked again: a choice made on another page since
//   takes the banner away.
// - It marks <html data-tracking="ready">, so the footer's Cookie settings button shows only once it
//   works.
// From the banner nothing is ever withdrawn (nothing was granted before the banner asked), so it
// passes no cookies to delete; the settings panel does. The consent copy loads with the panel too: its
// "Saved" line comes back from it, for the status message.

const loadSettings = () => import('@/components/layout/ConsentSettings');
const loadConsent = () => import('@/lib/tracking/consent');

// Stands in for the panel when its code didn't arrive: it closes at once, so the visitor can try again.
function PanelUnavailable({ onClose }: ConsentSettingsProps) {
  useEffect(() => onClose(null), [onClose]);
  return null;
}

const ConsentSettings = lazy<ComponentType<ConsentSettingsProps>>(() =>
  loadSettings().catch(() => ({ default: PanelUnavailable })),
);

// Past the first paint (decision 0022, the owner, 2026-10-05): GTM still loads on the page's first
// load — never idle-deferred (09 §2.2, lesson L6) — but after the browser has painted, so the
// container and its granted tags stop blocking the main thread during the TBT window. The idle wait
// carries a hard 1,500 ms timeout and ends in a double rAF (two frames ⇒ painted), so the container
// always arrives well inside GA4's session window; a hidden tab, which will never paint, loads at
// once. The consent defaults are untouched by this: dataLayer[0] was set by the inline script before
// hydration, long before any of this runs.
function afterFirstPaint(run: () => void): void {
  if (document.visibilityState === 'hidden') {
    run();
    return;
  }
  const painted = () => requestAnimationFrame(() => requestAnimationFrame(run));
  if (typeof requestIdleCallback === 'function') requestIdleCallback(painted, { timeout: 1500 });
  else setTimeout(painted, 0);
}

const ASK = 'data-consent';
const CONSENT_CONTROL = '[data-consent-action], [data-consent-settings]';

export type TrackingRuntimeProps = {
  // The GTM container (NEXT_PUBLIC_GTM_ID), or null: then no GTM, and the settings panel lists no vendor
  gtm: Gtm | null;
};

// When the banner goes, focus that was on it moves to the page's <main>, so it's never lost, without
// scrolling the page to it. A choice saved in the settings panel opened from the banner counts too: the
// closing dialog can't hand focus back to the banner's Choose settings, which is already leaving.
function focusMain() {
  document.getElementById('main')?.focus({ preventScroll: true });
}

export function TrackingRuntime({ gtm }: TrackingRuntimeProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const banner = useRef<HTMLElement | null>(null);
  // The button that opened the settings panel: the banner's Choose settings or the footer's button
  const opener = useRef<Element | null>(null);
  const lastPage = useRef<string | null>(null);
  // Stops watching the banner once it's gone (set by the effect below)
  const stopAskingRef = useRef(() => {});

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
    if (!gtm) return;
    let cancelled = false;
    afterFirstPaint(() => {
      if (!cancelled) loadGtm(gtm);
    });
    return () => {
      cancelled = true;
    };
  }, [gtm]);

  useEffect(() => {
    const root = document.documentElement;
    banner.current = document.querySelector<HTMLElement>('[data-consent-banner]');

    // How far the banner reaches up from the window's bottom, while it asks
    const reserve = () => {
      const top = banner.current?.getBoundingClientRect().top ?? innerHeight;
      root.style.setProperty('--dz-consent-height', `${Math.max(0, Math.ceil(innerHeight - top))}px`);
    };
    const sizing = new ResizeObserver(reserve);
    const asking = root.hasAttribute(ASK) && banner.current !== null;
    if (asking) {
      sizing.observe(banner.current!);
      addEventListener('resize', reserve);
    }
    const stopAsking = (stopAskingRef.current = () => {
      sizing.disconnect();
      removeEventListener('resize', reserve);
      root.style.removeProperty('--dz-consent-height');
    });

    // The landing's address, read now: a client navigation may change it before the first action
    const { search, pathname: landing } = location;
    const firstAction = ['scroll', 'pointerdown', 'keydown'];
    const capture = () => {
      for (const type of firstAction) removeEventListener(type, capture);
      import('@/lib/tracking/attribution')
        .then(({ captureAttribution }) => captureAttribution(search, landing))
        .catch(() => {
          // The capture code didn't arrive: this visit's campaign goes unrecorded, nothing else.
        });
    };
    if (HAS_ATTRIBUTION.test(search)) {
      for (const type of firstAction) addEventListener(type, capture, { passive: true });
    }

    // On intent, so the code is usually there by the click
    const onIntent = (event: Event) => {
      if (!(event.target as Element | null)?.closest?.(CONSENT_CONTROL)) return;
      loadConsent().catch(() => {});
      loadSettings().catch(() => {});
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const control = target?.closest<HTMLElement>(CONSENT_CONTROL);
      if (control) {
        const action = control.dataset.consentAction;
        if (action === 'accept' || action === 'reject') {
          const on = action === 'accept';
          if (banner.current?.contains(document.activeElement)) focusMain();
          if (banner.current) banner.current.inert = true;
          root.removeAttribute(ASK);
          stopAsking();
          loadConsent()
            .then(({ applyChoice }) => applyChoice({ analytics: on, marketing: on }))
            .catch(() => {
              // Nothing was stored, so the banner asks again.
              if (banner.current) banner.current.inert = false;
              root.setAttribute(ASK, 'ask');
            });
          return;
        }
        opener.current = control;
        setStatus('');
        setSettingsOpen(true);
        return;
      }
      if (target?.closest('[data-cta], a[href]')) {
        import('@/lib/tracking/clicks').then(({ reportClick }) => reportClick(target)).catch(() => {});
      }
    };

    // A page from the back/forward cache keeps the banner it had; a choice made since takes it away.
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || !root.hasAttribute(ASK)) return;
      loadConsent()
        .then(({ currentConsent }) => {
          if (currentConsent().ask) return;
          root.removeAttribute(ASK);
          stopAsking();
        })
        .catch(() => {});
    };

    document.addEventListener('click', onClick);
    document.addEventListener('pointerover', onIntent);
    document.addEventListener('focusin', onIntent);
    addEventListener('pageshow', onPageShow);
    root.setAttribute('data-tracking', 'ready');
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointerover', onIntent);
      document.removeEventListener('focusin', onIntent);
      removeEventListener('pageshow', onPageShow);
      for (const type of firstAction) removeEventListener(type, capture);
      stopAsking();
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
              if (banner.current?.contains(opener.current)) {
                focusMain();
                stopAskingRef.current();
              }
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
