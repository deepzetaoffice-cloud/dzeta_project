# External Sources (citation register)

> **Applies to:** every external fact on the site (numbers, dates, laws, platform rules, vendor features) · **Precedence:** with [company-facts.md](company-facts.md), the only allowed source of facts that aren't about Deepzeta AI itself · **Last reviewed:** 2026-09-30

**Rules for agents**
- **Only APPROVED entries are used.** Page copy may state an external fact only if it's here with status **APPROVED**. A **PROPOSED** entry is never published.
- **Agents propose, the owner approves.** Agents add PROPOSED rows with an official source and the date they checked it. The owner changes the status to APPROVED.
- **Allowlist:** numbers in APPROVED rows join the `check:facts` allowlist (03).
- **Official sources only:** government portals, the law's official text, and the vendor's own documentation. Secondary sources (law-firm guides, blogs) may support a PROPOSED row, but can never approve it.
- **Re-checking:** each row is re-checked on its review cadence (engine §7.4). A change of value becomes a new row, and the old row is marked SUPERSEDED.
- **Citations on the page** follow engine §7.5: title, publisher, and the date checked.

| ID | Fact (as it may be written) | Value | Official source | Checked | Status | Used on |
|---|---|---|---|---|---|---|
| S001 | The UAE's federal data-protection law | Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data | https://uaelegislation.gov.ae/en/legislations/1972 · https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws | 2026-09-30 | PROPOSED | `/privacy` |
| S002 | Individuals can complain to the UAE Data Office under the PDPL | Article 24 | Official text not reachable by our tools on 2026-09-30 (the site returns 403); supported by secondary guides | 2026-09-30 | PROPOSED (needs the official text) | `/privacy` |
| S003 | Google Search doesn't use llms.txt files | — | https://developers.google.com/search/docs/fundamentals/ai-optimization-guide | 2026-09-30 | PROPOSED | engine §9.4; the GEO guide (R126) |
| S004 | Google has no special requirements to appear in AI Overviews or AI Mode | — | https://developers.google.com/search/docs/fundamentals/ai-optimization-guide | 2026-09-30 | PROPOSED | the GEO guide (R126) |
| S005 | Google's scaled content abuse policy | — | https://developers.google.com/search/docs/essentials/spam-policies | 2026-09-30 | PROPOSED | `/services/programmatic-seo` (R069) |
| S006 | "Good" Core Web Vitals thresholds: LCP 2.5 s, INP 200 ms, CLS 0.1 | 2.5 s / 200 ms / 0.1 | https://web.dev/articles/vitals | — | Listed in facts §6 (CONFIRMED there); official link to be re-checked in P8 | `/resources/core-web-vitals-explained` (R128) |

## Change log

| Date | Change | Approved by |
|---|---|---|
| 2026-09-30 | Created with the first proposed entries | Owner (plan approval, 2026-09-30); entries await approval one by one |
