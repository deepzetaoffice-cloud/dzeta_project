# Header, mega menu and mobile menu

Status: CONFIRMED (Figma approved 2026-10-18) · All pages · Decision 0033 · Effects: [13](../ai/13-experience-design.md) · Figma: page Header and footer (`1:4`): Header set `36:285`, Mega menu `37:862` (open composition `37:863`), Mobile menu `38:583`

## Idea

An outstanding, calm header: a floating pill that sits on the stage on hero pages and condenses as you scroll. It carries the four pillars in a mega menu with live previews, a live "Agent online" status, and one clear button, "Book a free AI audit".

## The header set (five variants)

| Variant | Size | When |
|---|---|---|
| Desktop · on stage | 1376 × 64 | Over a hero stage (Home, the hub, the service pages, the flagship): the "On colour" look, white text on glass |
| Desktop · light page | 1376 × 64 | Over the canvas (Privacy, 404): the `bg/glass-header` pill with ink text |
| Desktop · scrolled | 1120 × 56 | Past 80 px: the pill narrows and shortens (`header-condense`); the status island hides; `reading-progress` runs along its lower edge |
| Mobile · top | 358 × 56 | Below 1,280 px at the top: the logo, the status island, the Menu button |
| Mobile · scrolled | 358 × 52 | Below 1,280 px past 80 px: the logo, a WhatsApp icon button, the Menu button (C83) |

- **The desktop header shows from `xl` (1,280 px, 05 §4).** If the bar doesn't fit on one line there, the status island collapses to its dot first.
- **The header's space is reserved** (`--dz-layout-header-height`), so nothing shifts when it condenses. Condensing is a transform and a clip only.

## Desktop order (inline-start → inline-end)

1. **The logo:** the owner's white-background wordmark (05 §6, C78), linking to Home.
2. **The nav** (Nav item `34:126`, `text-nav`):

   | Item | Type | Clickable |
   |---|---|---|
   | Services ▾ | Menu | Opens the mega menu (click or Enter, never hover-intent alone) |
   | Automation | Link | Once its page ships |
   | Designer Studio | Link | Once its page ships |
   | Deepzeta Sync (`/tools`) | Link | Once its page ships |
   | Work | Link | Once a real case study exists |
   | Pricing | Link | Once prices are confirmed |

   Every item renders, but an item is a link only while its registry row is live (`src/lib/routes.ts`): unshipped items show as plain text, never a dead link (04 §1.4). The current section is the Active state: violet with its Zeta pixel (13 §8).
3. **The status island** (`34:105`, KokonutUI NV-09): "Agent online" with a pulsing dot (`status-pulse`); hover or focus expands it to its second line (`status-expand`).
   - **Honesty:** it renders only while the WhatsApp agent is really live (a config flag the agent's go-live sets). Otherwise it is absent from the HTML, never a fake "online".
4. **The button:** "Book a free AI audit" (Button, Primary, M), `data-cta="header"`.
   - Its click contract is kept: `cta_click` with `book_audit` / `header`, then `contact_click` `whatsapp` while it falls back to WhatsApp until the audit page ships ([conversion-path.md](conversion-path.md)).

## Mega menu (Services ▾)

Figma `37:862` (the open composition over Home, `37:863`): a white panel at Elevation 3, `radius/xl`, dropping from the pill (`mega-menu-open`).

- **Top row:** "Services · four pillars" (mono label) and the "All services" link to the hub (`/services`, R010), the panel's first link.
- **Four pillar columns**, in the catalogue order. Each has:
  - its Pillar pixels mark, the pillar's name and its promise
  - its menu services, each with a one-line outcome (`navigation.ts`, byte for byte)
  - "All {pillar} services"

  The columns are AI Automation (WhatsApp AI Agent, AI Voice Receptionist, Speed-to-Lead System, Automated Quotation & Quote Tracking System, Booking Automation System), Websites (4), Software (4), Growth & Ranking (3). Services left out of the menu stay on the hub and their pillar pages.
- **The preview rail** at the inline end: "▶ Live preview · {pillar}", the hovered or focused service and its outcome, over the pillar's door loop (`mega-preview-swap`).
  - Its poster is the pillar's door photo (P01–P04). No autoplay under reduced motion. The no-video fallback is the media plan's U25.
- **The strip:** Solutions (the six bundle names, catalogue §5), then Deepzeta Sync, Designer Studio, About, Contact, Resources, and the "Try a live demo" chip. Each is a link only while live.
- **Behaviour:** Radix Navigation Menu.
  - It opens on click or Enter only. Esc closes it at once and returns focus to Services; so do light dismiss and following a link. Never `role="menu"` (06 §3).
  - **The full panel loads on intent** (a pointer or focus over Services). A server-rendered lite panel holds the hub and the live pillar pages, so no-JS visitors and crawlers reach every service through the hub (0026's rule, kept).

## Mobile menu (below 1,280 px)

Figma `38:583` (390 × 844): a full-screen sheet with a soft violet glow, opened by the **Menu** button. The menu icon becomes Close.

- **It is a native modal `<dialog class="dz-sheet">`** (C83): `tracking.spec.ts` opens it with the button named "Menu" and clicks its `[data-cta]`. It is not a Radix Dialog. Opening it plays `mobile-menu-sheet`.
- **Its contents, top to bottom:**
  1. the logo, the status island (live only) and Close
  2. **Services:** an `accordion` of the four pillars (Pillar pixels, the chevron); each opens to its menu services and "All {pillar} services"
  3. "All services"
  4. the live nav items: Automation, Designer Studio, Deepzeta Sync, Work, Pricing
  5. Solutions (the six bundles)
  6. About, Contact, Resources
  7. the opening-hours line from the site config (byte for byte)
- **The pinned CTA bar** at the bottom: "Book a free AI audit" (Primary, `data-cta` with `cta_location` `sheet`), "Chat on WhatsApp" and "Call".
  - The WhatsApp and Call buttons are absent while their facts are unconfirmed. The bar keeps the safe-area inset.
- **Focus** is trapped in the open sheet, the page behind is inert and doesn't scroll, and Esc, Close, a followed link or a window that grows past 1,280 px close it.

## What moved out of the header in v3

- The speed chip, the AI View toggle and the display controls are gone from the shell (decision 0033). "How AI reads this page" lives in Home's proof section (`exploded-layers`). Reduce effects lives in the footer's legal line. There is no theme switch (C77).
- The "Deepzeta AI" agent button became "Book a free AI audit" (C82); the agent opens from the Home hero's AI input.

## States

- On stage · light page · scrolled (condensed, with reading progress)
- Mega menu open, with a preview playing or its poster
- Mobile top · mobile scrolled · mobile menu open (a pillar open)
- The status island compact · expanded · absent (the agent not live)
- Reduce effects on: no condense animation (an instant swap), no pulse, no preview autoplay; forced colours: a solid system surface

## Icons

UI glyphs (05 §6): chevron down, menu, close, arrow up-right, WhatsApp, phone. The Pillar pixels marks in the mega menu and the mobile menu.

## Checks

At 390, 834, 1280 and 1440 px against the Figma variants; keyboard through the nav, the mega menu (Tab, Esc) and the sheet; axe with the menu and the sheet open; no CSP violation with the sheet open (`tracking.spec.ts`).
