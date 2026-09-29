# 11 · Internationalisation & RTL Readiness

> **Applies to:** layout, CSS, URLs, schema, content structure now; Arabic content after launch · **Precedence:** below 00 · **Last reviewed:** 2026-09-29

**Owner decision (2026-09-26):** English launches first. Arabic follows after launch, written to the standard of a **native GCC Arabic content writer, never a translation**. See `docs/decisions/0002-english-first-arabic-after-launch.md`.

---

## 1. RTL-ready from day one (applies now)

1. **Logical CSS only:** `ms-/me-/ps-/pe-/start-/end-/text-start/text-end`, `margin-inline-*`, `padding-inline-*`, `inset-inline-*`, `border-inline-*`. Physical `left/right` classes and properties are blocked by `check:tokens`.
2. **Directional icons** carry a `flip` flag and mirror with `[dir="rtl"]` (see Icon Master Rules §9). The logo, pixels, checkmarks, clocks and brand marks never flip.
3. **No text in images.** Text lives in HTML so it can be written in Arabic later. The one exception is screenshots and posters of our own UI (Studio posters, device frames, product screens). They carry alt text, any meaningful text also lives in HTML, and their Arabic versions are produced in P11 (conflict C24).
4. **Content in data files keyed by stable `id`**, never by array position, so each English entry can have an Arabic partner later.
5. **Locale-aware builders:** URL, canonical, schema `@id` and sitemap builders take a `locale` parameter from the start, even though only `en` exists now.
6. **Layout must tolerate longer and shorter strings** (Arabic can be longer or shorter than English). No fixed-width text containers.
7. `<html lang="en" dir="ltr">` is set from the locale, not hardcoded in multiple places.
8. **Kinetic type in Arabic** ([13](13-experience-design.md) §4.5): split text at word level only, never into letters (split letters are shaped in isolation, so Arabic joining breaks). Arabic display type has no letter-spacing; the negative tracking used on Montserrat is reset to 0.
9. **Effects mirror through logical properties** (inline-start origins, `scroll-journey-line` on the inline-start edge). Light in the design language comes from above, so lighting and pre-rendered 3D don't need mirrored versions. The pixel and the cluster never mirror.

---

## 2. Arabic architecture (P11, after launch; decided by decision record then)

- **Additive, not a migration.** English URLs stay unchanged (no `/en/` prefix, no redirects of existing URLs). Arabic lives under `/ar/`.
- A separate root layout for Arabic with `lang="ar"` `dir="rtl"` and Readex Pro, sharing all logic from `src/lib`.
- No automatic language redirects (no Accept-Language or cookie redirects); a visible switch links each page to its counterpart.
- hreflang pairs (`en`, `ar`, `x-default` → English), generated from the same builder, reciprocity checked.
- Schema generated per locale; Arabic pages never carry English schema text; `@id`s are locale-aware.
- Arabic body links point to Arabic pages.
- **English regression gate:** Arabic work must not change English titles, canonicals, content or Lighthouse scores (> 2-point drop blocks).
- **Parity gate:** every English content entry has an Arabic partner by stable id (or is explicitly marked English-only).

---

## 3. Arabic content standard (native GCC quality)

1. **Transcreation, not translation.** The Arabic Writer works from the English **brief** (goal, audience, key facts, call to action), not from the English sentences. The result must read as if written first in Arabic.
2. **Register:** modern standard Arabic suited to Gulf business audiences: professional, warm, direct. Gulf colloquial only where the owner approves (e.g. WhatsApp-style demo messages).
3. **Terminology:** keep a shared glossary (`src/content/ar/glossary.md`, created in P11) for service names and technical terms, including when to keep an English term (e.g. brand/product names like WhatsApp, n8n) and when to use the Arabic term.
4. **Numbers, dates, currency:** one consistent digit style (decided in P11), AED/درهم usage consistent, dates in formats familiar in the UAE.
5. **SEO in Arabic:** keyword research done in Arabic (how Gulf users actually search), not translated keywords. Titles ≤ 60 characters, unique descriptions.
6. **Human sign-off:** every Arabic page is reviewed by a **native GCC Arabic reviewer** before publishing; the reviewer's approval is recorded in the task plan. No Arabic page ships on AI output alone.
7. UI strings (nav, buttons, forms, legal) live in one file and get one careful human review.
