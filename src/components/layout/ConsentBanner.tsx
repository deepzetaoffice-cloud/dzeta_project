import { consentContent } from '@/content/en/legal/consent';
import { isLive, routePath } from '@/lib/routes';

// The consent banner, the first layer (docs/ai/09 §2.7, conflict C52; P3 plan, D;
// docs/design/conversion-path.md). Server-rendered on every page and shown only while <html> carries
// data-consent="ask", which the consent init script sets before the first paint for visitors from the
// EEA, the UK and Switzerland who haven't chosen yet. So it's in the first frame, never popping in later
// (13 §2.1), and everyone else never sees it. Without JavaScript nothing runs, so it isn't shown.
// - An <aside> landmark, placed after the skip link: first in the reading and Tab order, but it never
//   takes focus by itself. Its title is a <p>, so no page's outline changes.
// - Accept all and Reject all are the same size and weight (consent-copy.md principle 2): Secondary
//   buttons, neither violet. Choose settings opens the second layer. TrackingRuntime handles the three
//   buttons (data-consent-action).
// - The privacy policy link appears once /privacy (R006) is live (04 §1.4), in the actions row after
//   Choose settings: on its own line it made the banner cover seven H1s at 360 × 640 (the owner moved
//   it there, 2026-10-12, the privacy page plan). Accept all stays the banner's first Tab stop.
// - Its content sits in a data-nosnippet <div>: the banner is in every page's HTML (hidden by CSS for
//   most visitors), so its text must never become a search snippet or an AI answer. Google honours the
//   attribute on div, span and section, not on aside.
// - v3 (decision 0033): a white panel at Elevation 3 with a hairline edge (globals.css), solid in
//   forced colours.

export function ConsentBanner() {
  const { banner } = consentContent;
  return (
    <aside
      aria-labelledby="dz-consent-title"

      className="dz-consent"
      data-consent-banner=""
    >
      <div data-nosnippet="">
        <p id="dz-consent-title" className="font-bold text-ink">
          {banner.title}
        </p>
        <p className="mt-2 text-small">{banner.body}</p>
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
            className="underline underline-offset-4 ms-1 min-h-11 text-small font-medium text-link"
          >
            {banner.choose}
          </button>
          {isLive('R006') ? (
            <a
              href={routePath('R006')}
              className="underline underline-offset-4 ms-1 inline-flex min-h-11 items-center text-small font-medium text-link"
            >
              {banner.policyLink}
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
