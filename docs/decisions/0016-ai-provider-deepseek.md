# 0016 · AI provider: DeepSeek

Status: ACCEPTED (owner, 2026-09-30). Supersedes the "AI agent demo" row of [0004](0004-tech-stack.md) and its "Anthropic API account" input.

## Context

[0004](0004-tech-stack.md) chose the AI SDK with a Claude model for the AI agent demo, and the rules and specs followed it:
- 06 §1
- the Content Planner in `docs/design/tools.md`
- pSEO drafting in the SEO/GEO engine §10.5
- the privacy-policy draft
- the owner checklist
- `.env.example`

Nothing is built yet: no code reads an AI key, and no AI package is installed. P7 builds the demo and the tools.

On 2026-09-30 the owner decided to use the DeepSeek API instead, everywhere the site uses AI, pSEO drafting included.

**Checked 2026-09-30:**
- **The provider:** the AI SDK has a DeepSeek provider, `@ai-sdk/deepseek`. By default it reads the key from `DEEPSEEK_API_KEY`, and its base URL is `https://api.deepseek.com` ([ai-sdk.dev](https://ai-sdk.dev/providers/ai-sdk-providers/deepseek)).
- **The key:** created at `platform.deepseek.com` → API keys ([api-docs.deepseek.com](https://api-docs.deepseek.com/)).
- **Billing and spend controls:** not described in the API docs.
- **Data location:** DeepSeek's [privacy policy](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html) (updated 2026-02-10) says: "To provide you with our services, we directly collect, process and store your Personal Data in People's Republic of China." The operator is Hangzhou DeepSeek Artificial Intelligence Co., Ltd.
- **Training:** the same policy says inputs are used "to train and improve our technology, such as our machine learning models and algorithms", and it mentions a right to opt out of training.

## Decision

- **The AI agent demo, the Social Media Content Planner and pSEO drafting** use DeepSeek through the AI SDK (`@ai-sdk/deepseek`), called only from the server.
- **Models:** the P7 plan chooses the model for the demo and the Content Planner, and the pSEO plan for drafting. Each plan verifies the provider's version, as 06 §5 requires.
- **Unchanged from 0004:**
  - a streaming route handler
  - the chat UI loaded on tap
  - answers grounded in our own published content
  - a rate limit and a token cap
- **Environment variable:** `DEEPSEEK_API_KEY`, which replaces `ANTHROPIC_API_KEY` in `.env.example`. It's validated in `src/lib/env.ts` when P7 first reads it (02 §2.5).

## Consequences

- **Privacy:** visitors' inputs to the demo and the Content Planner are stored and processed in China.
  - The privacy-policy draft names DeepSeek, and adds China to the countries outside the UAE (§6, §7, §8, Q4–Q6).
  - It needs the owner's re-approval, and its external fact is S007 in the citation register (PROPOSED).
- **UAE PDPL cross-border transfer:** whether a transfer to China meets the PDPL's conditions is the owner's legal call. There's no external legal review (the owner's earlier decision).
- **Training:** P7 checks whether DeepSeek trains on API inputs, and turns on the opt-out if there is one. Until then, the demo keeps asking visitors not to share personal or sensitive information.
- **Owner steps** (owner checklist §4.6):
  - a DeepSeek Platform account and billing
  - check whether a spend limit or prepaid balance exists, and keep the exposure small
  - an API key, kept only in the password manager and in Vercel's environment variables
- **Files updated with this decision:**
  - `.env.example`
  - `docs/ai/06-code-standards.md` §1
  - `docs/design/tools.md`
  - `docs/seo/seo-geo-domination-engine.md` §10.5 and its "Improve" list
  - `docs/content-drafts/legal/privacy-policy.md`
  - `docs/facts/external-sources.md` (S007)
  - `docs/owner/deepzeta-owner-checklist.html`
  - the decisions index
  
  Earlier plans that name Claude are records and aren't edited; this decision supersedes them.
- **Not affected:**
  - Claude Code as the development tool
  - Anthropic's crawlers in `robots.txt` (decision 0010)
  - vendor names in content rules (08 §2.4)
