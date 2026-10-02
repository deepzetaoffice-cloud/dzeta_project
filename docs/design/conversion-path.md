# Conversion path

Status: CONFIRMED · Page tier: all pages · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

## The one goal

Every surface leads to **Book a free AI audit** (facts §3). Every showcase ends with an audit offer: Studio, Deepzeta Sync (the tools hub), the Automation builder, the App demo.

## Book-audit flow

This is the book-audit page from the blueprint's core pages. Its URL is set in its page plan.

- **The form:** fields are set in the page plan. Consent wording follows 09 and the UAE PDPL.
- **Form states:**
  - idle
  - validating (inline, on blur)
  - sending
  - success: `touch-stamp`, plus a "what happens next" message
  - error: `touch-nudge`, a message and a retry
- **Booking:** the Cal.com slot picker opens on demand in a sheet (0004), never on page load.

## Always-available contact

- **Floating WhatsApp button** (D5), at the bottom inline-end corner.
- **Sticky mobile CTA bar** (below 1024 px, `glass-frost`, so a phone runs no second live blur):
  - **The hand-off (C42):** at most one gradient CTA is in view. The bar shows while no in-page primary CTA (the hero's, the footer finale's) is on screen, and slides out when one is; on mobile the header CTA stays outline. On desktop the header CTA takes the gradient instead.
  - It hides while the mobile menu sheet or a modal is open, and never shows without JavaScript.
  - It slides with a transform only. Safe-area padding keeps it clear of an iPhone's home indicator (`viewportFit: 'cover'`; checked on an iPhone before launch, 0019), and `scroll-padding-block-end` keeps focused content clear of it.

## The consent banner (P3; docs/ai/09 §2.7, C52)

- **Shown only to visitors from the EEA, the UK and Switzerland** who haven't chosen yet. It's in the first frame (the consent init script marks `<html data-consent="ask">` before the first paint), never popping in later.
- **Placement:** full width at the bottom on a phone, safe-area padding like the sticky bar; from 640 px a corner panel at the inline end. `--dz-layer-consent`.
- **Look:** `glass-frost` with the muted tint (no second live blur on a phone); solid in forced colours. Accept all and Reject all are the same outline pill, neither on the action gradient, so one gradient CTA in view still holds (C42).
- **Order:** right after the skip link, first in the reading and Tab order; it never takes focus by itself. After a choice it fades out (at once under Reduce effects) and focus that was on it moves to `<main>`.
- **The sticky CTA bar gives way** while the banner shows, and returns after the choice. The page's end and `scroll-padding-block-end` take the banner's height, so a focused control never ends under it (WCAG 2.4.11).
- **Cookie settings** (the second layer) is a modal dialog: full height on a phone, a centred panel over a dim from 640 px, `glass-live`.

## Floating elements at 360 px

Priority, highest first:
1. Consent banner, until answered.
2. Sticky mobile CTA.
3. WhatsApp float. It lifts above the sticky CTA and respects safe areas.
4. Panels (AI View, Nutrition Label, booking). These open as full-height sheets, not floating boxes.

Stacking uses the `--dz-layer-*` token scale (05 §4). It is separate from the visual depth planes Z0–Z3.

## Showcase exits

| Surface | Exit |
|---|---|
| Designer Studio | "Want a site built like this? Book a free AI audit" |
| Deepzeta Sync tools | After "Get the full report": an audit offer, with the tool's findings as context |
| Automation builder | "Send this to our team": an audit request prefilled with the chosen trigger and actions |
| App demo | The end of the tour: the audit CTA |

## Tracking

Use existing taxonomy events only (09 §3): `cta_click`, `audit_start`, `generate_lead`, `book_call_click`, `contact_click`. New events are registered in the taxonomy before anything is built.
