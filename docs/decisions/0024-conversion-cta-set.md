# 0024 · The conversion CTA set: WhatsApp primary, "Deepzeta AI" agent button, four contact CTAs

Status: ACCEPTED (owner, 2026-10-08, with `docs/plans/2026-10-07-cta-set.md`; in chat the same day: the number +971 54 547 6335 for both phone and WhatsApp, the full set with WhatsApp as the only floating button, Call with the contact surfaces, and the header's WhatsApp fallback until the P7 agent bot)

## Context

The P2 header shipped with "Book a free AI audit" as the header CTA (decision 0019, the conversion
path in `docs/design/conversion-path.md`), and an earlier approved plan —
`docs/plans/2026-10-01-header-ask-panel.md` ("Ask deepzeta AI") — was meant to replace that entry
with a five-row WhatsApp panel but was never built (see conflict C66).

On 2026-10-07 the owner re-decided the whole conversion entry, for the whole site:

- WhatsApp becomes the **primary** CTA, shown as a floating button site-wide (except the contact
  page, which is itself the contact surface).
- The header button changes from "Book a free AI audit" to **"Deepzeta AI"**, which **launches the
  Deepzeta Agent bot** (the AI chat that answers from our own content).
- "Book a free AI audit" stays in the site, used **deliberately** as the in-page and sticky-bar
  conversion CTA (the audit goal is unchanged).
- A **Call** button (`tel:`) joins the contact set.
- Booking and the agent bot stay as already planned.

The WhatsApp chatbot question was also settled: n8n + Meta's WhatsApp Cloud API, not Twilio.

## Decision

**The conversion CTA set:**

| Surface | CTA | Action | Where |
|---|---|---|---|
| Floating button | **WhatsApp** (primary) | `wa.me/<number>` deep link | Site-wide, **except the contact page** |
| Header button | **"Deepzeta AI"** | Launches the Deepzeta Agent bot (AI chat panel, answering from our content) | Header, all pages |
| In-page + sticky bar | **"Book a free AI audit"** | The audit flow (form → Cal.com → n8n) | Deliberately placed: hero, finale, sticky mobile bar |
| Contact set | **Call** | `tel:<number>` | With the other contact CTAs |
| Contact set | **Booking** | Cal.com embed opens on tap → n8n webhook | Already planned (n8n guide Parts 3 + 9) |

**The Deepzeta Agent bot** (the header button's target) runs on **DeepSeek through the AI SDK on a
Vercel route handler**, streaming, chat UI loaded on tap, answers grounded in our published content,
rate-limited and token-capped (decisions 0004 and 0016). It opens in a panel in the page. It is P7
work; until it ships, the header button is a placeholder that falls back to WhatsApp (see the plan).

**The WhatsApp chatbot** (auto-replies inside WhatsApp, a distinct thing from the website agent)
uses **n8n + Meta's WhatsApp Cloud API — not Twilio**. Twilio is a paid middleman to the same Meta
API and would be a new vendor; n8n is already the automation backbone (decision 0004) and connects to
the WhatsApp Cloud API directly (paying only Meta's per-message fee). Whether WhatsApp auto-replies
are AI at launch or human-first is a separate P7 question, recorded in the plan.

## Consequences

- **Supersedes** the unbuilt "Ask deepzeta AI" panel plan
  (`docs/plans/2026-10-01-header-ask-panel.md`) — recorded as conflict C66.
- **`docs/design/conversion-path.md`** and **`docs/design/header.md`** must change: the header CTA is
  "Deepzeta AI" (agent bot), WhatsApp is the primary floating CTA, and "Book a free AI audit" is the
  in-page/sticky conversion CTA.
- **`shellContent.cta`** (`src/content/en/shell.ts`) splits: the header label becomes "Deepzeta AI",
  while the in-page and sticky-bar CTAs keep "Book a free AI audit".
- **Tracking:** the agent-bot open is a new taxonomy event (registered in the taxonomy table before
  it is built, per 09 §3). `cta_click`, `contact_click`, `audit_start` and `generate_lead` are
  unchanged and already exist.
- **Blocked inputs:** the WhatsApp and Call buttons hide while their numbers are `null` in
  `docs/facts/company-facts.md` (PENDING, expected ~2026-10-09). The code already hides `wa.me` /
  `tel:` links while those facts are `null`, so the buttons appear automatically when the numbers
  are confirmed — no code change.
- **Primary conversion is unchanged** at the facts level (facts §3: "Book a free AI automation
  audit", secondary WhatsApp). This decision changes the *entry emphasis* site-wide, not the audit
  goal; facts §3 is updated only if the owner wants to re-rank the two.
