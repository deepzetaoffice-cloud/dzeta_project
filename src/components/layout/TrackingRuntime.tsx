'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { applyChoice } from '@/lib/tracking/consent';

// The tracking runtime (docs/ai/09; P3 plan, G): one client island, mounted once by SiteDocument,
// rendering nothing until Cookie settings is opened. Like the effect runtime (FxRuntime), it works
// through one delegated listener, with no code in the components it reacts to.
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

export function TrackingRuntime({ gtm }: TrackingRuntimeProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const banner = useRef<Element | null>(null);
  // The button that opened the settings panel: the banner's Choose settings or the footer's button
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    banner.current = document.querySelector('[data-consent-banner]');
    const sizing = new ResizeObserver(([entry]) => {
      const height = entry?.borderBoxSize[0]?.blockSize ?? 0;
      root.style.setProperty('--dz-consent-height', `${Math.ceil(height)}px`);
    });
    if (banner.current) sizing.observe(banner.current);

    const onClick = (event: MouseEvent) => {
      const control = (event.target as Element | null)?.closest<HTMLElement>(
        '[data-consent-action], [data-consent-settings]',
      );
      if (!control) return;
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
