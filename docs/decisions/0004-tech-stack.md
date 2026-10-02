# 0004 · Tech stack: native-first frontend, n8n automation backbone

Status: ACCEPTED (owner jamsheed khalid. date : 26-9-2026)

## Context
An AI-agent brief written for the earlier reference project (Roo Code) recommended keeping Next.js and adding a motion library, React Hook Form, HubSpot, a third-party CMP, Resend, Payload CMS, PostHog and `lucide-react`. Checked against `docs/ai/05`, `06`, `07`, `09`, the blueprint tech stack (§9) and the Services Catalogue:

- The **foundation is right**: Next.js App Router, TypeScript strict, Tailwind v4, Vercel, the schema/GEO architecture, no CSS-in-JS, no UI kit, no global state manager, quality-gated pSEO.
- Several additions **conflict** with the speed budget (N1), the custom-code promise (N2) or the Icon Master Rules, and the brief pins an old Next.js version (15.2.4).

The owner decided on 2026-09-26: a custom-coded consent banner; 3 performance tiers (see [0005](0005-performance-tiers.md)); n8n as the automation tool with step-by-step guides; Google Sheets as the CRM at launch.

## Decision

| Layer | Choice |
|---|---|
| Framework | Next.js **latest stable**, App Router; the React version it ships with; TypeScript `strict`. Version and security advisories verified in P0 and recorded there. |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens |
| Motion | Native first (CSS transitions, CSS scroll-driven animations, View Transitions API, `@property`, SVG). GSAP only on T2/T3 pages; WebGL and Rive only on T3 (and one post-LCP moment on Home). Tiers per [0005](0005-performance-tiers.md). |
| Content | Typed TS data + MDX in the repo |
| Forms | Native `<form>` + Server Actions + `useActionState`; Zod validation on the server |
| Spam / rate limit | Cloudflare Turnstile (loaded on form focus) + a serverless rate-limit store (Upstash Redis) |
| Automation backbone | **n8n**. Hosting recommended: start on n8n Cloud, self-host later if cost justifies it (**owner to confirm**; the blueprint said self-hosted). Workflow JSON exports are version-controlled in the repo. The website calls n8n only from the server through a signed webhook. |
| CRM | **Google Sheets as CRM v0**, written by n8n. Upgrade to HubSpot or Zoho by changing the n8n workflow only; website code does not change. |
| Email | Gmail from a Google Workspace account on the deepzeta domain, sent by n8n (needs D1). Resend only if volume or deliverability requires it. |
| WhatsApp | WhatsApp Business Cloud API, driven by n8n (blueprint demo 4) |
| Booking | Cal.com, embedded only when the visitor opens booking; booking webhook → n8n → the same Sheet |
| AI agent demo | AI SDK on a Vercel route handler with a Claude model, streaming; small custom chat UI loaded on tap. Model chosen in the P7 plan. Answers grounded in our own published content; rate limit and token cap. |
| Tracking | GTM via the site's own loader (`@next/third-parties` until P3; conflict C56, decision 0021), GA4, Google Ads, Meta Pixel + CAPI, LinkedIn Insight + CAPI (server events via n8n) |
| Consent | Custom-coded banner feeding Google Consent Mode v2, UAE PDPL wording |
| Speed proof | `web-vitals` for the live speed badge |
| Hosting | Vercel; function region verified in P0 (UAE / Middle East if available) |
| Quality | ESLint flat config, Prettier, Vitest, Playwright + axe, Lighthouse CI with per-tier assertions |

**Not adopted:**
- `motion` / Framer Motion (replaced by the native-first toolkit + GSAP per page tier)
- React Hook Form (client JS for two forms; native forms + Server Actions cover it)
- Third-party CMP (owner decision)
- `lucide-react` (brand and UI icons are drawn in-house per the Icon Master Rules)
- `SoftwareApplication` / `Product` schema for services (deepzeta sells services; use `Service` / `ProfessionalService`)
- a "CaseStudy" schema type (not a schema.org type; case studies use `Article`)
- Lenis or any smooth-scroll / scroll-jacking library
- Lottie, CSS-in-JS, UI kits, global state managers
- Google Apps Script as a second automation tool next to n8n

**After launch, each by its own decision:** server-side GTM, PostHog (consent-gated), headless CMS, Postgres / client portal.

## Consequences
- **Differs from the blueprint tech stack (§9):** n8n hosting (self-hosted → Cloud recommended), the chat agent (n8n → AI SDK route) and the CRM (HubSpot/Zoho → Sheets v0 first). This is recorded as a proposed conflict-register entry in the rule-changes plan.
- Every package above still needs an approved plan with its **verified** version and compressed size before install (`06 §5`). Nothing in this record is a version claim.
- Protected rule files need owner edits to match: see `docs/plans/2026-09-26-stack-rule-changes.md`.
- **Google Sheets holds personal data:** access limited to named accounts, never shared by link (UAE PDPL). Lead PII never passes through GTM (`09 §2.6`).
- Gmail send quotas and Sheets limits are checked in the plan that builds the lead workflow.
- Blocked by open inputs: domain (D1) for Workspace email and Cal.com branding; WhatsApp Business number and Meta business verification; Anthropic API account; n8n Cloud account.
- n8n guides for the owner are written as part of each workflow's plan.
