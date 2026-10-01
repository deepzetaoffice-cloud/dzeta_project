# Footer: "The Landing"

Status: CONFIRMED · Page tier: all pages · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

## Idea

Every page ends with a landing. The journey line that followed the visitor down the page arrives, and the logo's four pixels assemble into the cluster.

## Finale (pre-footer)

- `scroll-journey-line` lands, then The Landing plays: `scroll-assemble` of the cluster (13 §5). The four pixels fly in on 35° paths once, when the finale enters (the shared observer); otherwise, and under Reduce effects, the cluster is shown assembled.
- A headline follows, an `<h2>` at the **display size** (`--dz-text-display`, C41): each page's one statement headline is its own (13 §2.6).
- Then the primary CTA, "Book a free AI audit", with WhatsApp as the secondary action once the number is confirmed. The finale's CTA joins the hand-off (C42, conversion-path.md).

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

- **Links** (in a `<nav>` named "Footer"; only live registry rows render, so the columns appear as pages ship, P2 Q1):
  - link columns in the four pixel colours, one per pillar (C6): every service in the pillar, including the three left out of the mega menu (header.md), then "All … services"
  - Company, Resources, Legal. Company includes Deepzeta Sync (`/tools`) once the page ships.
- **Social links:** Deepzeta's own letter tiles (C49), one per profile in facts §2.1: in · Ig · f · YT · T · X · @ · S · P, each filled with its platform's colour inside the signal-gradient edge, linked per the rules in the facts file. Hover: `hover-glow` (13 §4.3); touch: `touch-press`.
- **Controls:** the display controls (Reduce effects beside the theme switch, 05 §1) and a language switch placeholder (hidden until Arabic).
- **Business name, address and phone:** an `<address>` from the site config, each line shown only once CONFIRMED in `docs/facts/company-facts.md`. A PENDING value (the phone, WhatsApp) is left out, never filled with a placeholder.
- **Opening hours** (the owner, 2026-10-02; P3 plan, A): their own line after the `<address>`, "Opening hours: " and the fact from the site config, byte for byte (facts §2).
- **The legal line:** "© 2026 Deepzeta Digital Solutions L.L.C.".
- **On mobile,** "See how AI reads this page" also appears here. It shares the same AI View state as the header.

## Light mode

The finale band and the footer stay navy in both themes, because the logo's white "Deep" needs navy.

## Icons

Tier 1 arrows and external-link; the social letter tiles (C49).
