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
  parseFacts,
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
  catalogue: { pillars, services, starterOffers, bundles },
  industryData: { industryGroups, industries, bestFitAutomations },
  faq: publishedFaqs(faqBank),
  siteConfig,
});
// Every page's FAQ list, read straight from the bank (not through the generator)
const everyFaq = Object.values(faqBank).filter(Array.isArray).flat();
const knowledge = read(OUTPUT);

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

  it('states no external fact: no amounts, months or years (except the founding date)', () => {
    const body = knowledge.replace(/^- Founded: .*$/m, '');
    expect(body).not.toMatch(/\bAED\b|\$\s?\d/);
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
