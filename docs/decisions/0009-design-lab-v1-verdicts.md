# 0009 · Design Lab v1 verdicts

Status: ACCEPTED (owner, 2026-09-29, through the Design Lab's saved verdicts and chat confirmation)

## Context
On 2026-09-29 the owner reviewed Lab v1 (`docs/design/prototypes/design-lab.html`, published privately) and confirmed the results in chat, including option (a) for the pixel hop.

- **Effects reviewed:** 46 of 51.
- **Verdicts:**
  - 42 Keep; 6 of those carry an improvement note
  - 4 Change
  - 0 Drop
- **Not yet reviewed:** header Proof Bar, CTA handoff, AI View, The Assembly, `story-chat`. They stay as confirmed in decision 0008 and are re-offered in Lab v2.

## Decision

1. **Lab decisions confirmed:**
   - `glass-liquid` edge refraction, kept as a Chromium-only extra
   - `scroll-signal-beams`, which runs once per chapter
   - `touch-haptic`, never the only feedback
2. **Token values** (the owner's Lab tuning; P0 re-checks contrast and speed):

   | Token | Value |
   |---|---|
   | `--dz-tilt-max` | 5deg |
   | `--dz-magnet-max` | 7px |
   | `--dz-glass-blur` | 17px |
   | `--dz-glass-tint-min` | 0.62 |
   | `--dz-text-statement` maximum | 9rem |
3. **Keep, improved as noted:**

   | Effect | Improvement |
   |---|---|
   | `hover-charge` | A richer inside: a light bead follows the pointer across the button, plus an inner rim light, while the sheen, arrow nudge and pixel pop stay |
   | `hover-outline` | The label shifts 4 px |
   | `pointer-grid-wake` | The brightened grid lines carry the signal gradient |
   | `story-system-map` | Redesigned to be visually striking: see 13 §4.8 |
   | `type-outline-fill` | Built as SVG text, so it stays sharp at every size |
4. **Changes:**
   - **`hover-glow` and the icons:** icons animate simply and beautifully, using the approved icon prototype (`Planning Folder/DeepZeta Signature Icon Prototype.html`) and the Icon Master Rules.
   - **`hover-pixel-hop` (option a):** the current-place marker becomes a miniature of the logo's four-pixel cluster that travels to the hovered item.
     - The pixels stay upright, in their exact gradients and arrangement.
     - This is a third permitted use of the cluster outside icons. It amends decision 0008 item 7, which allowed two (The Assembly and The Landing).
   - **`story-terminal`:**
     - a macOS-style window with close, minimise and maximise buttons
     - longer, real multi-step commands that show real capability
     - still only real output, or a visible "Example" label
   - **`type-outline-spotlight` (Designer Studio hero word):**
     - the word is filled with the zeta gradient
     - a frosted-glass lens follows the pointer
     - the letter edges ripple a few pixels in the direction the pointer moves (a "water touch")
     - the word underneath gets a minimal gradient drift
     - The ripple is the one effect allowed to animate a paint-based SVG filter. It is limited to this hero word, fine pointers only, and is static when effects are reduced.

## Consequences
- **Rule and spec updates:**
  - `docs/ai/13` §3, §4 and §8
  - the `docs/ai/05` tokens
  - conflict register C25 (cluster as nav marker) and C26 (ripple paint exception)
  - `docs/design/header.md`, `studio.md`, `service-page.md` and `automation.md`
- **Lab v2** implements the changes for re-review.
