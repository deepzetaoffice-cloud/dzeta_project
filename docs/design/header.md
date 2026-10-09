# Header: "Proof Bar"

Status: CONFIRMED · Page tier: all pages · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

## Idea

The header is a dashboard of proof. Besides navigation and the CTA, it carries two live instruments that prove what we sell: **speed** and **AI readability**.

## Desktop (≥ 1024 px)

- **Shape:** a floating pill, inset from the viewport edges, using `glass-live`. On scroll it condenses through a transform only: no height change, no hide-on-scroll jump.
- **Order**, from inline-start to inline-end:
  - the logo: `Logo variant="inline"`, two crops of the locked file, the mark set where the D was (its height the D's cap height plus a tenth) followed by "eepzeta" (P2 step 11). Below 640 px, the mark alone
  - nav
  - speed chip
  - AI View toggle
  - CTA
- **Nav** (C6 resolved: the four pillars):

  | Item | Rendered | Clickable |
  |---|---|---|
  | Services ▾ | Always | Opens the mega menu once a pillar's pages ship; the button is always present |
  | Automation | Always | Once its page ships |
  | Designer Studio | Always | Once its page ships |
  | Deepzeta Sync (the tools hub, `/tools`) | Always | Once the page ships |
  | Work | Always | Once a real case study exists |
  | Pricing | Always | Once prices are confirmed |

  Never link to a page that doesn't exist (04 §1.4): every item renders, but an item is a link only while its registry row is live (`src/lib/routes.ts`), so unshipped items show as non-clickable text and become links as their pages ship. In the bar they take the same text colour as the links (`text-fg`), with no hover: mist on the bar's glass over a light page is 3.73:1, under 4.5:1 (the owner, 2026-10-09) (plan `docs/plans/2026-10-08-header-full-menu.md`). About, Contact and Resources live in the mega menu's strip and the footer.
- **No display controls in the bar.** The theme switch and Reduce effects live in the mobile sheet, the mega menu's strip and the footer (05 §1).
- **Current page:** a miniature of the logo's four-pixel cluster marks it (decision 0009). `hover-pixel-hop` moves the cluster to the hovered item, and its small pixels settle a beat after the main one.
- **CTA handoff** (C42: at most one gradient CTA in view, 05 §2):
  - The header button is **"Deepzeta AI"** (decision 0024): it launches the Deepzeta Agent bot in P7, and until then falls back to WhatsApp honestly. While any in-page primary CTA is on screen (the hero's, the footer finale's), it is an outline button (`hover-outline`).
  - Once none is on screen, the header button switches to the action gradient (`hover-charge`, `pointer-magnet`, `touch-press`) on desktop. On mobile it stays outline, and the sticky CTA bar takes the gradient instead (conversion-path.md).
  - "Book a free AI audit" stays the deliberate in-page and sticky CTA (conversion-path.md); until `/free-ai-audit` ships, those are emails to hello@deepzeta.ai with the subject "Free AI audit".

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
- **The hub first** (P6 part A2, [services-hub.md](services-hub.md)): the services hub (`/services`, R010) is the mega menu's first link.
- **Four columns**, one per pixel colour, across the full width (each a subgrid, so heads, rows and "All … services" line up):
  - One column per pillar (C6): AI Automation · Websites · Software · Growth & Ranking, in the catalogue order.
  - Column heads use Tier 3 icons beside the pillar's name and promise.
  - Items use Tier 2 icons plus a one-line outcome (the 19 outcomes approved at P2 step 11). A service without a Tier 2 icon yet shows its pillar pixel.
  - **Left out of the menu** (the owner, P2 step 11), still on the services hub and their pillar pages (the footer lists only the hub and the pillar pages since L9): Review & Reputation Automation, UAE E-Invoicing Readiness & Integration, AI Shopping Visibility.
  - Hover: the row lights, grows a guide line in its pillar's colour (`hover-guide-line`) and plays its icon's story, or pops its pillar pixel. "All … services" draws its underline and nudges its arrow.
- **A strip below the columns** (P2 step 11): the 6 Systems (catalogue §5) on their own line, then the `glass-liquid` "Try a live demo" card, the links (Deepzeta Sync once it ships, Designer Studio, About, Contact, Resources) and the display controls at the inline end.
- **Behaviour:**
  - It opens on click only. Hover-intent opening was left out (`interestfor` is experimental).
  - It's a `popover="auto"` panel opened by a `popovertarget` button. The platform supplies Esc, light dismiss, focus return and the button's expanded state, so no `aria-expanded` is written. It also closes when focus leaves it or a link is followed.
  - Never `role="menu"` (06 §3).
  - **Loaded on intent** (L8, Q2 (b), decision 0026): the full panel loads on intent (a pointer or focus over the Services button). A server-rendered lite panel holds the hub and the live pillar pages, so no-JS visitors and crawlers always reach every service through the hub.

## Mobile (< 1024 px)

- **A compact bar:** logo · CTA · menu button. The menu icon morphs into close.
- **A full-screen sheet** (a modal `<dialog>`, opened by invoker commands where supported), containing:
  - heading-size items (`text-h2`, P2 step 11) with `type-word-stagger`: "Services" (the services hub, R010) first, then the live nav items above, including Deepzeta Sync once it ships
  - pillar-colour bars
  - the speed chip and AI View (P7), and the display controls (Reduce effects and the theme switch)
  - a thumb zone with the audit CTA (WhatsApp floats site-wide instead, decision 0024)
- **Focus** is trapped in the open sheet and the page behind is inert and doesn't scroll. Esc, the close button, a followed link and a window that grows to desktop width all close it.

## States

- Default
- Scrolled (condensed)
- Mega menu open
- Mobile sheet open
- AI View on
- Reduce effects on: `glass-frost`, no live blur (13 §2.11); forced colours: a solid system surface

## Icons

- **Tier 1:** menu, close, chevron, globe (language; hidden until Arabic), eye (AI View), gauge (speed).
- **Tier 3** (column heads) and **Tier 2** (items), following the Icon Master Rules.

## Breakpoints

360, 390, 768, 1024, 1280 and 1536 px (05 §7).
