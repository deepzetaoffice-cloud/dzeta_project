# Conversion path

Status: CONFIRMED · All pages · Decisions 0024 and 0033 · Effects: [13](../ai/13-experience-design.md) · Conflicts C81–C84

## The one goal

Every surface leads to **Book a free AI audit** (facts §3). Every showcase ends with an audit offer: Studio, Deepzeta Sync (the tools hub), the Automation builder, the App demo.

## The CTA set (v3)

| Surface | CTA | Look | Hook (kept for `tracking.spec.ts`) |
|---|---|---|---|
| Header | "Book a free AI audit" | Button, Primary, M | `header [data-cta="header"]`: `cta_click` `book_audit` / `header`, then `contact_click` `whatsapp` while it falls back to WhatsApp |
| In-page heroes and sections | "Book a free AI audit" | Button, Primary, L | `data-cta` with its location |
| Footer audit panel (the finale) | "Book a free AI audit" | Button, Primary, L | `footer [data-cta="primary"]`: `cta_location` `finale` |
| Sticky mobile bar | "Book a free AI audit" | Button, Primary, M, in a white pill | `[data-fx-sticky] [data-cta]`: `cta_location` `sticky` |
| Mobile menu | "Book a free AI audit", "Chat on WhatsApp", "Call" | The pinned CTA bar | `dialog.dz-sheet [data-cta]`: `cta_location` `sheet` |
| Floating WhatsApp | The WhatsApp glyph | Icon button, Primary, 48 px | `contact_click` `whatsapp`; from 1,280 px only (C83) |
| Mobile scrolled header | The WhatsApp glyph | Icon button | `contact_click` `whatsapp` |
| Footer contact | Email, Call, WhatsApp | Links in the `<address>` | `contact_click` `email` / `phone` / `whatsapp` |

- **Primary buttons are solid violet wherever the Figma file puts them.** The old one-gradient hand-off (C42) is retired (C82), so the header button and a hero's button may share a view.
- **Until the audit page (R002) ships:**
  - the header button falls back to WhatsApp honestly, as today (0024)
  - the other audit CTAs open an email to hello@deepzeta.ai with the subject "Free AI audit" (`shellContent.ctaEmailSubject`)
- **WhatsApp and Call are absent from the HTML while their facts are unconfirmed** (facts §2), never CSS-hidden. Both are CONFIRMED today: `+971 54 547 6335`.

## The sticky mobile CTA bar (below 1,280 px, wherever the mobile header shows)

- **A white pill at Elevation 2** with the violet audit button, inset by the gutter and the safe area (`viewportFit: 'cover'`).
- **It shows only while no in-page audit CTA is on screen** (the hero's, the finale's), and slides out when one is. It slides with a transform only.
- **It hides** while the mobile menu or a modal is open, and while the consent banner asks (`consent.spec.ts`). It never shows without JavaScript.
- **`scroll-padding-block-end`** keeps focused content clear of it (WCAG 2.4.11).

## The floating WhatsApp button

- **The round violet Icon button** with the WhatsApp glyph, at the bottom inline-end corner, from 1,280 px (the desktop header). Below that, the scrolled mobile header carries the same button (C83).
- **The contact page** (R005) excludes it.
- **It gives way** while the consent banner asks, and the page's scroll padding clears it.

## The consent banner (P3; docs/ai/09 §2.7, C52)

The logic is kept verbatim. Only the markup and styling are new, in the v3 language.

- **Shown only to visitors from the EEA, the UK and Switzerland** who haven't chosen yet. It's in the first frame (`<html data-consent="ask">` before the first paint), never popping in later.
- **Placement:**
  - Full width at the bottom on a phone, with the safe-area inset; from 640 px, a corner panel at the inline end.
  - It never covers the H1 at 360 × 640 (`consent.spec.ts`).
  - It scrolls inside itself at 320 × 256.
  - `--dz-layer-consent`.
- **Look:** a white panel at Elevation 3 with a 1 px `border/default` top edge (solid in forced colours, as `consent.spec.ts` asserts). Accept all and Reject all are the same size and weight (Secondary buttons); "Choose settings" is a Link button.
- **Order:** right after the skip link "Skip to content", first in the reading and Tab order; it never takes focus by itself. After a choice it fades out (at once under Reduce effects), and focus that was on it moves to `<main id="main">`.
- **The page's end and `scroll-padding-block-end`** take the banner's height, so a focused control never ends under it (WCAG 2.4.11, measured with `--dz-focus-width` + `--dz-focus-offset`).
- **Cookie settings** (the second layer) is a modal dialog named "Privacy settings", with the Analytics and Marketing switches: full height on a phone, a centred panel over `bg/scrim` from 640 px.

## Floating elements at 360 px

Priority, highest first:
1. The consent banner, until answered.
2. The sticky mobile CTA bar.
3. Dialogs and sheets (the mobile menu, Cookie settings), full height.

Stacking uses the `--dz-layer-*` scale (05 §4).

## The tracking contract (kept verbatim; `tracking.spec.ts` and `consent.spec.ts` pass unchanged)

The v3 shell must provide:
- **`/shell-review`:** the noindex review page (R165, content group `shell-review`), with the full shell, a hero CTA and the finale (C81).
- **The hooks above:** `header [data-cta="header"]`, `[data-fx-sticky] [data-cta]`, `footer [data-cta="primary"]`, and a button named "Menu" opening `dialog.dz-sheet` with its `[data-cta]`.
- **The footer's hooks:** the social link "Deepzeta AI on LinkedIn" and `footer address a[href^="mailto:"]`.
- **The consent hooks:** `[data-consent-banner]` as a complementary landmark named by the banner's title (`#dz-consent-title`); the buttons Accept all, Reject all and Choose settings; the "Privacy settings" dialog with its switches; the footer's Cookie settings button; the skip link; `#main`.
- **The tokens** `--dz-focus-width` and `--dz-focus-offset` on `:root`.
- **The click attributes `clicks.ts` reads,** unchanged, so the GTM container, GA4, Meta and LinkedIn need no change.
- **No CSP violation** on Home or the review page, with the consent dialog opened, the menu opened and the page scrolled to its end.

## Showcase exits

| Surface | Exit |
|---|---|
| Designer Studio | "Want a site built like this? Book a free AI audit" |
| Deepzeta Sync tools | After "Get the full report": an audit offer, with the tool's findings as context |
| Automation builder | "Send this to our team": an audit request prefilled with the chosen trigger and actions |
| App demo | The end of the tour: the audit CTA |

## Tracking

Use existing taxonomy events only (09 §3): `cta_click`, `audit_start`, `generate_lead`, `contact_click`, `outbound_click`, `faq_expand`. New events (for example a newsletter sign-up, C84) are registered in the taxonomy before anything is built.
