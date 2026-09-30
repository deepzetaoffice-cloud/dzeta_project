# 0002 · English first, Arabic after launch

Status: ACCEPTED (owner, 2026-09-26)

## Context
The blueprint and the performance constraint originally required Arabic + English at launch. The owner decided to launch in English first and add Arabic after launch, with Arabic content that reads like the work of a native GCC Arabic content writer, not a translation.

## Decision
- Launch in English only.
- The architecture is **RTL-ready from day one**: logical CSS only (gated), locale-aware URL/schema/sitemap builders, content keyed by stable ids, directional icons flagged for flipping.
- Arabic is added in phase P11 as an **additive** `/ar/` tree, written natively from English briefs, and reviewed by a native GCC Arabic reviewer before publishing.

## Consequences
- No Arabic routes, fonts or content in the launch build; the Arabic font (Readex Pro) is not loaded until P11.
- Conflict C1 in the conflict register records the change from the source documents.
- Routing library and URL scheme for Arabic are decided by a new decision record in P11 (conflict C5).
