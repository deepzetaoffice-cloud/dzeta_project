'use client';

import { usePathname } from 'next/navigation';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { contentGroup, linkEvent, trackEvent } from '@/lib/analytics';
import { applyChoice, currentConsent, HAS_ATTRIBUTION } from '@/lib/tracking/consent';
import { CTA_LOCATIONS, type CTA_IDS } from '@/lib/tracking/taxonomy';

// The tracking runtime (docs/ai/09; P3 plan, G): one client island, mounted once by SiteDocument,
// rendering nothing until Cookie settings is opened. Like the effect runtime (FxRuntime), it works
// through one delegated listener, with no tracking code in the components it reacts to.
// - Page views (09 §2.9): one page_view on each page load and each client navigation, a frame after
//   the route changes so the new page's title is in place; a repeat of the same address is skipped.
// - Tracked clicks: a CTA (data-cta) reports cta_click with its data-cta-id and where it sits; a link
//   reports what linkEvent() says (contact_click or outbound_click). The audit CTA is an email link
//   until R002 ships, so its click reports both: two events, each once.
// - Click IDs and campaign tags (09 §2.8): when the address carries one, the capture code is imported
//   and stores them with Marketing consent, or once a choice grants it (attribution.ts).
// - The consent banner's buttons (data-consent-action): Accept all and Reject all apply the choice
//   at once; Choose settings, like the footer's Cookie settings (data-consent-settings), opens the
//   settings panel, whose code is imported only then.
// - While the banner shows, its height is kept in --dz-consent-height, so the page's end and a focused
//   control scroll clear of it (WCAG 2.4.11; effects.css).
// - It marks <html data-tracking="ready">, so the footer's Cookie settings button shows only once it
//   works.
// From the banner nothing is ever withdrawn (nothing was granted before the banner asked), so it
// passes no cookies to delete; the settings panel does. The consent copy loads with the panel too: its
// "Saved" line comes back from it, for the status message.

const ConsentSettings = lazy(() => import('@/components/layout/ConsentSettings'));

type CtaLocation = (typeof CTA_LOCATIONS)[number];

export type TrackingRuntimeProps = {
  // Whether the site loads GTM (NEXT_PUBLIC_GTM_ID): the settings panel lists the vendors in use
  gtm: boolean;
};

// When the banner goes, focus that was on it moves to the page's <main>, so it's never lost. A choice
// saved in the settings panel opened from the banner counts too: the closing dialog can't hand focus
// back to the banner's Choose settings, which is already leaving.
function focusMain() {
  document.getElementById('main')?.focus();
}

// Where a CTA sits: a section may name it (data-cta-location, e.g. P5's hero); otherwise the shell's
// part that holds it. The sheet sits inside the header, so it's asked first.
function ctaLocation(cta: Element): CtaLocation {
  const named = cta.closest<HTMLElement>('[data-cta-location]')?.dataset.ctaLocation;
  if (named && (CTA_LOCATIONS as readonly string[]).includes(named)) return named as CtaLocation;
  if (cta.closest('[data-fx-sticky]')) return 'sticky';
  if (cta.closest('dialog.dz-sheet')) return 'sheet';
  if (cta.closest('footer')) return 'finale';
  if (cta.closest('header')) return 'header';
  return 'page';
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
    const root = document.documentElement;
    banner.current = document.querySelector('[data-consent-banner]');
    const sizing = new ResizeObserver(([entry]) => {
      const height = entry?.borderBoxSize[0]?.blockSize ?? 0;
      root.style.setProperty('--dz-consent-height', `${Math.ceil(height)}px`);
    });
    if (banner.current) sizing.observe(banner.current);

    if (HAS_ATTRIBUTION.test(location.search)) {
      const { marketing } = currentConsent().choice;
      void import('@/lib/tracking/attribution').then(({ captureAttribution }) => captureAttribution(marketing));
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const control = target?.closest<HTMLElement>('[data-consent-action], [data-consent-settings]');
      if (control) {
        const action = control.dataset.consentAction;
        if (action === 'accept' || action === 'reject') {
          const on = action === 'accept';
          applyChoice({ analytics: on, marketing: on });
          if (banner.current?.contains(document.activeElement)) focusMain();
          return;
        }
        opener.current = control;
        setStatus('');
        setSettingsOpen(true);
        return;
      }
      const cta = target?.closest<HTMLElement>('[data-cta]');
      if (cta) {
        // The attribute is CtaButton's typed ctaId; trackEvent drops any value the taxonomy doesn't hold.
        const ctaId = (cta.dataset.ctaId ?? '') as (typeof CTA_IDS)[number];
        trackEvent('cta_click', { cta_id: ctaId, cta_location: ctaLocation(cta) });
      }
      const link = target?.closest<HTMLAnchorElement>('a[href]');
      const reported = link ? linkEvent(link.href, location.host) : null;
      if (reported?.event === 'contact_click') trackEvent('contact_click', reported.params);
      if (reported?.event === 'outbound_click') trackEvent('outbound_click', reported.params);
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
            gtm={gtm}
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
