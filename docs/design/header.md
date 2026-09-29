# Header: "Proof Bar"

Status: CONFIRMED (column grouping OPEN: C6) · Page tier: all pages · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

## Idea

The header is a dashboard of proof. Besides navigation and the CTA, it carries two live instruments that prove what we sell: **speed** and **AI readability**.

## Desktop (≥ 1024 px)

- **Shape:** a floating pill, inset from the viewport edges, using `glass-live`. On scroll it condenses through a transform only: no height change, no hide-on-scroll jump.
- **Order**, from inline-start to inline-end:
  - the logo (the locked logo component)
  - nav
  - speed chip
  - AI View toggle
  - CTA
- **Nav** (proposed; the final list is set with C6):

  | Item | Shown |
  |---|---|
  | Services ▾ | Always |
  | Automation | Always |
  | Studio | Always |
  | Tools | Always |
  | Work | Only once a real case study exists |
  | Pricing | Only once prices are confirmed |

  Never link to a page that doesn't exist (04 §1.4). About, Contact and Resources live in the mega-menu rail and the footer.
- **Current page:** the pixel marks it. `hover-pixel-hop` moves the pixel to the hovered item.
- **CTA handoff** (keeps one gradient CTA per view, 05 §2):
  - While the hero's primary CTA is on screen, "Book a free AI audit" is an outline button (`hover-outline`).
  - Once the hero CTA leaves the viewport, the header CTA switches to the action gradient (`hover-charge`, `pointer-magnet`, `touch-press`).

## Speed chip

- Shows this visit's real LCP (for example "⚡ 0.9 s") once measured.
- Its space is reserved, so nothing shifts when the number appears.
- Opens the Page Nutrition Label (footer.md).
- If the browser can't measure LCP, the chip reads "Speed report" and still opens the label.

## AI View (X-ray)

- **The control:** a toggle button with `aria-pressed`.
- **When on, the page shows "machine view":**
  - Glass becomes blueprint wireframe.
  - Each section shows its heading level and schema entity (for example "H2 · Service · WhatsApp AI Agent").
  - A side panel (a sheet on mobile) shows this page's real JSON-LD, read from the page's own script, and `llms.txt`, fetched when the panel opens.
- **The panel is built on open**, never server-rendered, so it adds no duplicate indexable text (08).
- **Turning it off:** Esc or the toggle. Focus returns to the toggle.

## Mega menu (Services ▾)

- **Surface:** a `glass-live` sheet that drops from the pill (Drop motion).
- **Four columns**, one per pixel colour:
  - The grouping (pillars or stages) is OPEN until C6.
  - Column heads use Tier 3 icons.
  - Items use Tier 2 icons plus a one-line outcome.
- **The 6 Systems** (catalogue §5) in one row.
- **A side rail:** a `glass-liquid` "Try a live demo" card, plus Tools, Studio, About, Contact and Resources.
- **Behaviour:**
  - It opens on click; hover-intent opening is allowed on desktop.
  - It is a disclosure button with `aria-expanded`, and Esc closes it.
  - Never `role="menu"` (06 §3).

## Mobile (< 1024 px)

- **A compact bar:** logo · CTA · menu button. The menu icon morphs into close.
- **A full-screen sheet**, containing:
  - statement-size items with `type-word-stagger`
  - stage-colour bars
  - the speed chip, AI View, and the Reduce effects switch
  - a thumb zone with the CTA and WhatsApp
- **Focus** is trapped in the open sheet. Esc and the close button both close it.

## States

- Default
- Scrolled (condensed)
- Mega menu open
- Mobile sheet open
- AI View on
- Reduce effects on (a solid surface, no blur)

## Icons

- **Tier 1:** menu, close, chevron, globe (language; hidden until Arabic), eye (AI View), gauge (speed).
- **Tier 3** (column heads) and **Tier 2** (items), following the Icon Master Rules.

## Breakpoints

360, 390, 768, 1024, 1280 and 1536 px (05 §7).
