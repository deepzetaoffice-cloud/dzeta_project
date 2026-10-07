import { consentContent } from '@/content/en/legal/consent';
import { isLive, routePath } from '@/lib/routes';

// The consent banner, the first layer (docs/ai/09 §2.7, conflict C52; P3 plan, D;
// docs/design/conversion-path.md). Server-rendered on every page and shown only while <html> carries
// data-consent="ask", which the consent init script sets before the first paint for visitors from the
// EEA, the UK and Switzerland who haven't chosen yet. So it's in the first frame, never popping in later
// (13 §2.1), and everyone else never sees it. Without JavaScript nothing runs, so it isn't shown.
// - An <aside> landmark, placed after the skip link: first in the reading and Tab order, but it never
//   takes focus by itself. Its title is a <p>, so no page's outline changes.
// - Accept all and Reject all are the same size and weight (consent-copy.md principle 2); neither is
//   on the action gradient, so the one-gradient-CTA rule holds (C42). Choose settings opens the second
//   layer. TrackingRuntime handles the three buttons (data-consent-action).
// - The privacy policy link appears once /privacy (R006) is live (04 §1.4).
// - Its content sits in a data-nosnippet <div>: the banner is in every page's HTML (hidden by CSS for
//   most visitors), so its text must never become a search snippet or an AI answer. Google honours the
//   attribute on div, span and section, not on aside.
// - glass-frost on the navy chrome: it sits over the whole scrolling page, and on a phone the header
//   pill is already the one live blur (effects.css). The muted tint: more opaque behind a paragraph,
//   and the tint check:contrast gates the link colour on.

export function ConsentBanner() {
  const { banner } = consentContent;
  return (
    <aside
      aria-labelledby="dz-consent-title"
      data-theme="dark"
      className="dz-consent dz-glass dz-glass--muted"
      data-consent-banner=""
    >
      <div data-nosnippet="">
        <p id="dz-consent-title" className="font-bold text-fg-strong">
          {banner.title}
        </p>
        <p className="mt-2 text-small">{banner.body}</p>
        {isLive('R006') ? (
          <p className="mt-1 text-small">
            <a href={routePath('R006')} className="dz-underline dz-target text-link">
              {banner.policyLink}
            </a>
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <button type="button" data-consent-action="accept" className="dz-consent-button dz-press font-bold">
            {banner.acceptAll}
          </button>
          <button type="button" data-consent-action="reject" className="dz-consent-button dz-press font-bold">
            {banner.rejectAll}
          </button>
          <button
            type="button"
            data-consent-action="choose"
            className="dz-underline dz-target ms-1 min-h-11 text-small font-medium text-link"
          >
            {banner.choose}
          </button>
        </div>
      </div>
    </aside>
  );
}
