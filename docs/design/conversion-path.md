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
- **Sticky mobile CTA bar:**
  - It appears after the hero's primary CTA leaves the screen, the same trigger as the header CTA handoff.
  - It hides while the mobile menu sheet or a modal is open.

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
