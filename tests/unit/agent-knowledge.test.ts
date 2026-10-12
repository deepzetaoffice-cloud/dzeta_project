import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bundles, pillars, services, starterOffers } from '@/content/catalogue';
import { bestFitAutomations, industries, industryGroups } from '@/content/emirates-industries';
import * as faqBank from '@/content/en/faq-bank';
import { siteConfig } from '@/lib/site-config';
import {
  BUSINESS_PROFILE_MAX,
  CATALOGUE_MD,
  FACTS_MD,
  FACT_LABELS,
  OUTPUT,
  buildAgentKnowledge,
  SALES_MD,
  parseFacts,
  parseSalesKnowledge,
  publishedFaqs,
} from '../../scripts/build-agent-knowledge.mjs';

// The agent's knowledge (Track A, S2; decision 0027): docs/facts/agent-knowledge.md is generated from
// the sources of truth only, and is what the WhatsApp agent answers from. These tests keep the
// committed file equal to a fresh generation (a changed fact or catalogue line means regenerating,
// re-reviewing and re-uploading it), and keep anything unconfirmed or external out of it (02 §1).

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');
const factsMd = read(FACTS_MD);
const generated = buildAgentKnowledge({
  factsMd,
  catalogueMd: read(CATALOGUE_MD),
  salesMd: read(SALES_MD),
  catalogue: { pillars, services, starterOffers, bundles },
  industryData: { industryGroups, industries, bestFitAutomations },
  faq: publishedFaqs(faqBank),
  siteConfig,
});
// Every page's FAQ list, read straight from the bank (not through the generator)
const everyFaq = Object.values(faqBank).filter(Array.isArray).flat();
const knowledge = read(OUTPUT);
// The owner's approved answers (sales-knowledge.md): owner facts, so they may carry years (the founder's
// story); everything else is checked for external facts.
const SALES_HEADING = '## How we work: the approved answers';
const salesPart = knowledge.slice(knowledge.indexOf(SALES_HEADING), knowledge.indexOf('## Frequently asked questions'));
const catalogueAndFaqs = knowledge.replace(salesPart, '');

describe('agent knowledge', () => {
  it('the committed file equals a fresh generation (npm run agent:knowledge)', () => {
    expect(knowledge).toBe(generated.markdown);
  });

  it('every fact it states is CONFIRMED in the facts file, value for value', () => {
    const facts = parseFacts(factsMd);
    for (const [label, shown] of FACT_LABELS) {
      const row = facts.get(label);
      expect(row, `facts row "${label}"`).toBeDefined();
      if (row!.status.startsWith('CONFIRMED')) expect(knowledge).toContain(`- ${shown}: `);
      else expect(knowledge, `"${label}" isn't CONFIRMED`).not.toContain(`- ${shown}: `);
    }
  });

  it('names every pillar, service, starter offer and bundle exactly as the catalogue does', () => {
    for (const { name } of [...pillars, ...services, ...starterOffers, ...bundles]) {
      expect(knowledge, name).toContain(name);
    }
  });

  it("carries every published FAQ answer verbatim, from every page's list", () => {
    expect(everyFaq.length).toBeGreaterThan(faqBank.homeFaq.length);
    for (const { question, answer } of everyFaq) {
      expect(knowledge).toContain(`### ${question}\n${answer}`);
    }
  });

  it('leaks nothing unconfirmed and no placeholder', () => {
    for (const marker of ['[[TODO', 'PENDING', 'UNKNOWN', 'PROPOSED']) expect(knowledge).not.toContain(marker);
  });

  it('states no external fact: no amounts anywhere; no months or years outside the founding date and the approved answers', () => {
    expect(knowledge).not.toMatch(/\bAED\b|\$\s?\d/);
    const body = catalogueAndFaqs.replace(/^- Founded: .*$/m, '');
    expect(body).not.toMatch(/\b(?:19|20)\d{2}\b/);
    expect(body).not.toMatch(
      /\b(?:January|February|March|April|June|July|August|September|October|November|December)\b/,
    );
    expect(body).not.toMatch(/\b[Pp]hases?\b/);
  });

  it("uses the booked audit length, never the catalogue's 30–45 minute range", () => {
    expect(knowledge).not.toContain('30–45');
    // The calendar gap after each audit is internal (facts §3), never said to visitors
    expect(knowledge).not.toMatch(/calendar gap|gap after|after each audit/i);
  });

  it('writes the brand as "Deepzeta AI" (C29), never the old lowercase name', () => {
    const outsideUrls = knowledge.replace(/[\w.-]*deepzeta\.ai[\w/.-]*/g, '');
    expect(outsideUrls).not.toMatch(/\bdeepzeta\b/);
    expect(outsideUrls).not.toMatch(/\bDeepzeta\b(?! AI| Digital)/);
  });

  it("carries every approved sales answer, without the owner's internal notes", () => {
    expect(salesPart.length).toBeGreaterThan(0);
    const rows = parseSalesKnowledge(read(SALES_MD)).flatMap((s) => s.rows);
    expect(rows.length).toBeGreaterThan(50);
    for (const { topic } of rows.filter((row) => row.topic !== 'Our highlights')) {
      expect(salesPart, topic).toContain(`- ${topic.replace(/\*\*/g, '').replace(/\s*\([^()]*\)/g, '')}`);
    }
    expect(salesPart).not.toMatch(/\(owner,|`|\(as \d/);
  });

  it('takes only APPROVED sections, and never an OPEN row', () => {
    const md = [
      '## 1. Approved',
      'Status of every entry: **APPROVED (owner, 2026-10-12)**.',
      '| # | Topic | Approved answer |',
      '|---|---|---|',
      '| 1.1 | Kept | Yes |',
      '| 1.2 | **OPEN:** Waiting | Maybe |',
      '## 2. Draft',
      'Status of every entry: **DRAFT**.',
      '| 2.1 | Never | No |',
    ].join('\n');
    expect(parseSalesKnowledge(md)).toEqual([
      { number: '1', title: 'Approved', approved: true, rows: [{ id: '1.1', topic: 'Kept', answer: 'Yes' }] },
    ]);
  });

  it("uses the owner's highlights (sales-knowledge 9.3)", () => {
    expect(knowledge).toContain(
      '- High performance: every page passes Core Web Vitals, with beautiful custom designs\n',
    );
    expect(knowledge).toContain(
      "- Detailed research and discussion of every client's requirements, for the best growth results\n",
    );
  });

  it('keeps the business profile short and inside the file', () => {
    expect(generated.businessProfile.length).toBeLessThanOrEqual(BUSINESS_PROFILE_MAX);
    expect(knowledge).toContain(
      `<!-- business-profile:start -->\n${generated.businessProfile}\n<!-- business-profile:end -->`,
    );
  });

  it('ends with the rules the agent never breaks', () => {
    expect(knowledge).toMatch(/## What Deepzeta AI never says or does\n\n- Prices are not published yet\./);
  });
});
