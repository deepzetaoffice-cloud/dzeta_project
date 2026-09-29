# Footer: "The Landing"

Status: CONFIRMED · Page tier: all pages · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

## Idea

Every page ends with a landing. The journey line that followed the visitor down the page arrives, and the logo's four pixels assemble into the cluster.

## Finale (pre-footer)

- `scroll-journey-line` lands, then The Landing plays: `scroll-assemble` of the cluster (13 §5).
- A statement headline follows (optionally with `type-outline-fill`).
- Then the primary CTA, "Book a free AI audit", with WhatsApp as the secondary action.

## Page Nutrition Label

- **A `glass-frost` panel**, styled like a food label, showing this visit's real measurements:
  - page weight
  - number of requests
  - JS / CSS / font KB
  - LCP, CLS, and INP (INP appears after the first interaction)
  - third-party scripts loaded before consent
- **How it measures:** `web-vitals` and the Resource Timing API. The method is stated under the table: "Measured on your device just now. Cross-origin and cached files may show 0 KB."
- **When a browser can't measure a metric**, the label says "not measured in this browser". It never shows a substitute number.
- **The header speed chip** opens this label expanded.

## Body

- **Links:**
  - link columns in the four pixel colours, one per pillar (C6)
  - Company, Resources, Legal. Company includes Deepzeta Sync (`/tools`) once the page ships.
- **Social links:** official monochrome marks from facts §2.1 (never redrawn), linked per the rules in the facts file.
- **Controls:** a language switch placeholder (hidden until Arabic) and the Reduce effects switch.
- **Business name, address and phone:** shown only once CONFIRMED in `docs/facts/company-facts.md`. Until then the block is omitted, never filled with placeholders.
- **On mobile,** "See how AI reads this page" also appears here. It shares the same AI View state as the header.

## Light mode

The finale band and the footer stay navy in both themes, because the logo's white "Deep" needs navy.

## Icons

Tier 1 arrows and external-link; official platform marks.
