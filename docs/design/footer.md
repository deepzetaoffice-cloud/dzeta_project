# Footer: the audit panel and the sectioned footer

Status: CONFIRMED (Figma approved 2026-10-18); the newsletter OPEN (C84) · As built in Phase D1 (2026-10-19; the owner approved this sync the same day) · All pages · Decision 0033 · Effects: [13](../ai/13-experience-design.md) · Figma: Footer set `39:1070` (Desktop 1440 × 1556, Mobile 390 × 2056), Footer column `36:287`

## Idea

Every page ends on the one goal. First an audit panel that points to the free AI audit, then a footer split into clear sections, and finally a giant wordmark that lights under the pointer.

## 1. The audit panel (the finale)

- **A stage-gradient panel** with `beams` falling toward its edge (they point to the CTA), drawn in CSS (not Aceternity or Motion). In view only (`src/lib/fx/footer.ts`); static under Reduce effects.
- **The content:**
  - the mono label "Free AI Automation Audit"
  - the `<h2>` "Find out what to automate first." (`shellContent.finaleHeading`), pinned at the size the Figma component draws (32 px desktop, 34 px mobile)
  - its line (`finaleLine`)
  - the "In one session we map" strip: 01 Sales · 02 Operations · 03 Admin, then "…and show which automations pay back first. No obligation, no jargon."
- **The actions:**
  - "Book a free AI audit" (Primary, L): `footer [data-cta="primary"]`, `cta_location` `finale` (`tracking.spec.ts`)
  - "Chat on WhatsApp" and "Call +971 54 547 6335" (On colour), each present only while its fact is CONFIRMED (facts §2)

## 2. The sections (a `<nav>` named "Footer")

| Section | Contents |
|---|---|
| Brand | The wordmark (05 §6), the brand line from the site config ("Deepzeta AI builds online growth for every business."), and the newsletter field **only once it works** (C84) |
| Services | AI Automation · Websites · Software · Growth & Ranking · All services |
| Solutions | AI Front Desk · Quote-to-Cash System · Get Found by AI · E-Commerce Growth Engine · Launch Pack · E-Invoicing Ready |
| Company | About · Contact · Deepzeta Sync · Editorial policy |
| Resources | Resources · Glossary |
| Contact | An `<address>` from the site config: the office address, `hello@deepzeta.ai` (a `mailto:` link, `contact_click` `email`), the phone and WhatsApp (each only once CONFIRMED), and the opening hours line byte for byte (facts §2; "Monday to Friday, 08:00–17:00 GST (UTC+4); closed Saturday and Sunday" today) |

- **The section titles** are mono labels: ink/secondary with a signal-orange pixel (C80; Figma draws them in orange, 2.84:1 on white).
- **Live links only.** A link renders only while its registry row is live, so the columns fill in as pages ship (the P2 rule, kept). A section with no live link yet is left out.
- **Every footer href equals its target's canonical path** (`check:links`).

## 3. Social

- One link per profile in facts §2.1: LinkedIn, Instagram, Facebook, YouTube, TikTok, X, Threads, Snapchat, Pinterest. Each shows the platform's name and ↗.
- Each link's accessible name is "Deepzeta AI on {platform}" (`shellContent.socialLinkName`; `tracking.spec.ts` clicks "Deepzeta AI on LinkedIn").
- `outbound_click` fires with its domain.

## 4. The legal line

- "© 2026 Deepzeta Digital Solutions L.L.C." (the legal name from the site config).
- Privacy and Terms (each a link once live).
- **The Reduce effects switch** (13 §2.11): a switch button, remembered; turned on and labelled "Your device settings turn this on" when a device preference forces it.
- **Cookie settings** (C83): a button that opens the consent settings dialog, for every visitor, hidden in place until it works (09 §2.7; `consent.spec.ts`).
- "Back to top ↑", a link to `#top` (`foundation.spec.ts` allows one link to `#main`, the skip link's).

## 5. The giant wordmark

- "Deepzeta" across the full width as an outline. Under the pointer, a radial mask of the logo gradient follows the cursor (`wordmark-spotlight`).
- It is `aria-hidden` and drawn from `data-word` as CSS generated content with empty alt text, so it adds no duplicate text node: the brand's name is already in the legal line and the logo.

## Mobile (390)

The same order, stacked:
1. the audit panel (without the "In one session" strip)
2. the brand block
3. the columns in pairs
4. contact
5. social
6. the legal line
7. the wordmark

## States

- Default · the beams playing or static · the spotlight following or static
- Reduce effects on: no beams, no spotlight, everything else the same
- No JavaScript: every link and the address work; Cookie settings hidden; Reduce effects follows the device preference only

## Icons

UI glyphs: arrow up-right, WhatsApp, phone, mail, globe, calendar.
