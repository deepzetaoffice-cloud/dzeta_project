---
paths:
  - "src/components/**"
  - "src/styles/**"
  - "src/lib/fx/**"
  - "src/app/**/*.css"
---

**Before changing these files, read:**
- `docs/ai/05-design-system.md` (tokens)
- `docs/ai/13-experience-design.md` (effects, motion, interaction)
- `docs/ai/07-performance-budget.md` §3
- for icons: `Planning Folder/For Ai/DeepZeta Icon Master Rules.md`
- for a page or shared surface: its spec in `docs/design/` (index: `docs/design/README.md`)

**Reminders:**
- tokens only (no raw hex/px outside `src/styles/tokens.css`)
- logical CSS only
- effects only by ID from 13, as listed in the plan's effect register
- transform/opacity-only motion, no loops
- reduced motion and Reduce effects give a static final state
- no entrance animation on the LCP element
- reuse → extend → create
- Server Components by default
