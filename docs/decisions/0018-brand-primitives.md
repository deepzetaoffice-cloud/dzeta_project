# 0018 · Brand primitives: the logo, app icons and manifest, icon foundations (P1)

Status: ACCEPTED (owner, 2026-09-30: the plan with its protected edits; Q1 and Q2 (a); the app icons approved as shown; the logo served by a static route; steps 9 and 10, which accept the lab LCP cost below)

## Context

[The P1 plan](../plans/2026-09-30-p1-brand-primitives.md) builds the brand primitives from [04](../ai/04-build-sequence.md) §2: the logo component from the locked SVG, unchanged; the favicon and manifest; and the icon system's foundations per the Icon Master Rules. Its Progress block records each step, the owner's answers and every deviation.

## Decision

### 1. The logo
- **Served as it is:** `/brand/deepzeta-logo.svg` is a static route (`force-static`) that reads the locked file at build. There's no copy in the repo, so nothing can drift.
  - **Why a route:** the command guard blocks any command that writes near the locked logo, so the planned copy couldn't run. The owner chose the route at the step 4 stop.
  - **Byte-identical, by test:** the locked file's committed (LF) bytes are 23,026 B, SHA-256 `6431c29769786e752a3d2dc972b147e551fea5bc060a717c7feaf48647ee78fc`, git blob `589432ea`. `tests/unit/brand-assets.test.ts` checks that hash with line endings normalised, because the Windows working copy is CRLF (23,192 B), and checks the route's bytes.
- **Shown by crops:** `Logo` (`src/components/ui/Logo.tsx`) shows it through viewBox crops of that one file, the Design Lab's method: `mark` `372 262 552 432`, `wordmark` `214 740 832 164`, and the `lockup` in the Lab's proportions.
  - It adds no JavaScript. It's navy only, with a navy backing in forced colours, `dir="ltr"` so it never mirrors, and a required height class.
  - It's named by `siteConfig.brandName` or explicitly decorative.
  - The locked file's own `<title>` predates C29 ("Deepzeta · AI Digital Solutions"). The page hides the inner SVGs, and the schema uses the PNG.
- **First use:** the placeholder Home shows the lockup in a navy header. The real header replaces it in P2.

### 2. App icons and the manifest
- **The symbol:** every icon is the logo's own mark, the D-shaped Z ribbon with the four pixels (Q1 (a), "D+4 Pixel"), cropped from the locked file onto navy.
- **The script:** `npm run brand:icons` (`scripts/build-brand-icons.mjs`) draws each one in Playwright's Chromium at its final size and packs the ICO. A re-run gives byte-identical files. The owner approved them in the specimen (`docs/design/prototypes/brand-icons-specimen.html`).

  | File | Pixels | Bytes |
  |---|---|---|
  | `src/app/favicon.ico` | 16, 32, 48 (PNG entries) | 4,757 |
  | `src/app/icon.png` | 192 | 12,718 |
  | `src/app/apple-icon.png` | 180 (opaque) | 8,860 |
  | `public/brand/icon-512.png` | 512 | 54,899 |
  | `public/brand/icon-maskable-512.png` | 512 (opaque, safe zone) | 34,988 |
  | `public/brand/deepzeta-logo-512.png` | 512, the whole logo on navy: the schema `#logo` for P4 | 34,311 |

- **The manifest** (`src/app/manifest.ts`, R177):
  - name and short name "Deepzeta AI", with the positioning line as its description
  - `display: 'browser'`, because it's a website, not an app
  - navy colours
  - icons: 192 `any`, 512 `any`, 512 `maskable`
- **Head and colours:** `theme-color` navy and `color-scheme: dark` come from the `viewport` export in the English layout and in `global-not-found.tsx`, which honours it. Colour literals are read from `tokens.css` at build (`src/lib/tokens.ts`), so `check:tokens` is unchanged. Next traces `tokens.css` into each server bundle that reads it (the `.nft.json` files).
- **Checked on the built site and on Vercel:**
  - The 404 gets the viewport metas, the icon links and the manifest link.
  - Next writes `sizes="48x48"` for the ICO, its largest entry.
  - The icon hrefs' query hashes depend on the build path, not the build. Two Vercel builds gave identical hashes; a Windows build gives others.
  - Vercel serves the logo SVG Brotli-compressed; `next start`, which the lab uses, doesn't compress it.
- **Google's favicon rule** (checked 2026-09-30, page updated 2026-08-28): "square, at least 8x8px; we recommend … larger than 48x48px". The 192 px PNG meets the recommendation. The URL registry lists the files as R174–R178.

### 3. The icon system (Tier 1 and Tier 2)
- **The registry** (`src/components/icons/registry.ts`, the source of truth until a Figma master exists, C36) holds the 11 icons drawn in the approved prototype:
  - Tier 1: arrow, send, check, menu, close, globe
  - Tier 2: WhatsApp AI Agent, AI Voice Receptionist, Booking Automation System, Speed-to-Lead System, CRM Setup & Automation. All five are exact catalogue names in the AI Automation pillar.
- **Rendering:** `Icon` renders Tier 1 from the sprite and Tier 2 inline, with no JavaScript. `IconDefs` holds the pillar gradients (stop colours from tokens through classes, not style attributes), the glows, the knockouts and the sprite. P2 mounts it.
- **Colour:** Tier 1 takes its parent's colour. Tier 2 lines use the semantic text tokens (C37). Pixels use the new stop tokens (`--dz-pixel-{pillar}-top|mid|bottom`).
- **Stories:** each runs on one `--dz-dur-story` timeline (900 ms). They play on hover and keyboard focus (a card counts when a link inside it has focus) and never on a disabled host. They're static under reduced motion and more contrast (glow 0.45). In forced colours the pixel is solid in the text colour and has no glow.
- **Where the rule won over the prototype (C36):**
  - the Tier 2 story, 1.45 s in the prototype, retimed to 900 ms
  - pixels snapped to the 0.25 grid
  - AI Voice Receptionist's pixel moved up 0.45, out of the padding
  - one tail line from 3.8 to 3.75
  - the §3 corner radii: 2.25 on the chat bubble, 1.25 on the ear cups
- **Knockouts:** measured in the browser, three approved drawings put the pixel closer than 0.75 to a line (§4.2 rule 4): AI Voice Receptionist 0.15, Speed-to-Lead System −0.55 (it overlaps the dial) and CRM Setup & Automation 0.40. Each has a knockout: the lines are masked 0.75 around the pixel, and the pixel stays where the prototype put it.
- **Pixel contrast** is reported, not gated (C38). Disabled icon lines on the light page are gated.

### 4. The lab LCP cost: accepted by the owner
The logo adds one image before the H1's paint. In Lighthouse's simulated slow 4G it shares bandwidth with the scripts and the font, as the font did in 0015.

| | Before (the branch base) | After |
|---|---|---|
| Local median LCP (5 runs, CI environment) | 2179 ms | 2333 ms (+154 ms; the plan's stop was +100 ms) |
| CI median LCP (`bdc9d07`, 5 runs, Chrome 154) | 2216 ms (`8e99f01`, 0015) | **1957 ms** (runs: 2320, 1966, 1737, 1372, 1957) |
| Performance (local / CI median) | 99 / 99 | 98 / 99 |
| Best Practices | 96 (the favicon 404) | **100** |
| Images / other | 0 / 0 | 24,074 B (the logo, uncompressed in the lab) / 7,080 B (manifest and favicon) |
| HTML + CSS + JS | 147,491 B | 148,912 B of 190,868 B |

- **The H1 stays the LCP element,** CLS is 0, and every hard limit and the T1 floor hold.
- **CI's median run is under the old baseline.** CI medians vary a lot between runs (0015), so this isn't a claimed improvement.
- **In production** Vercel compresses the SVG, to roughly a third of its size.
- **The owner accepted the cost** ("step 9 and 10 approved"), because the P2 header puts the logo on every page anyway.

## Consequences
- **Rule edits** (approved with the plan):
  - 05 §5 and §6
  - 03 §1 (`check:contrast` reports the pixels)
  - the new-icon skill
  - conflict register C36–C38
  - URL registry R174–R178 and a change-log row
  - `CLAUDE.md`
- **P2 (layout shell):**
  - **Mount `IconDefs` once** in the English root layout, and in `global-not-found.tsx` if it shows an icon (it bypasses the layout). The two identical `viewport` exports can move into one shared constant.
  - **The logo's caching:** it's served `max-age=0, must-revalidate`, so every page view revalidates it. Version the URL with the locked hash (for example `?v=6431c297`) and send `public, max-age=31536000, immutable` through `next.config.ts` `headers()`; check it on `next start` and on Vercel.
  - **The first paint:** the performance audit saw the first frame 60–80 ms later in 4 of 5 local runs (not verified; possibly drawing the SVG, which has a blur filter, twice). Record one trace in the header plan, and measure it on the budget Android phone in the effects feasibility gate.
  - **Tier 3:** the cluster, depth, glass and sweep definitions, AI Front Desk and the four pillar head icons, with the shared IntersectionObserver.
  - **Reduce effects:** add the switch's selector to the static rules in `icons.css`.
  - **The pixel gradient:** its slight diagonal (0.55 → 0.45) mirrors in flipped icons. It can't be seen at icon sizes; make it vertical if that ever matters.
  - Brand the built-in error page (no `global-error.tsx` yet), and optionally set `appleWebApp.title` for the iOS home-screen name.
- **P3:** icon stops come from classes, so a nonce-based `style-src` can't blank them. The logo's `<image>` elements need `img-src 'self'`.
- **P4:** the schema `#logo` uses `/brand/deepzeta-logo-512.png`. `check:schema` or `check:seo` should assert that it returns 200 without `noindex` on an indexable build.
- **Open, for the owner:** the Icon Master Rules' "line centres on .25 or .75" (§3). Most of the prototype's horizontal and vertical lines sit on .0 or .5. The owner either snaps them (each moves ≤ 0.25; clearance re-measured) or records an exception.
