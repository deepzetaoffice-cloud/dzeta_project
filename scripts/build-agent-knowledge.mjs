#!/usr/bin/env node
// The agent-knowledge generator (Track A, step S2; decision 0027; `npm run agent:knowledge`).
// Writes docs/facts/agent-knowledge.md: everything the WhatsApp agent (and, in P7, the website
// agent) knows about Deepzeta AI, built from the sources of truth only (02 §1):
//   - the Services Catalogue (Planning Folder/For Ai/DeepZeta Services Catalogue.md): the
//     descriptions, matched by catalogue number; the names come from the typed catalogue
//     (src/content/catalogue.ts), byte for byte
//   - docs/facts/company-facts.md: the CONFIRMED rows named in FACT_LABELS, nothing else
//   - src/content/emirates-industries.ts: the industries and the best-fit table
//   - src/content/en/faq-bank.ts: every published FAQ answer (Home's, the hub's and each service
//     page's), verbatim
//   - src/lib/site-config.ts: the founder
//   - docs/facts/sales-knowledge.md: the owner's APPROVED sales answers (a section whose status line
//     says APPROVED; a row marked OPEN never), with internal notes in brackets left out; the "Our
//     highlights" row rewrites and extends the catalogue's highlights instead (owner, 2026-10-12)
// Left out on purpose: catalogue sentences with dates or amounts (external facts need an APPROVED
// row in docs/facts/external-sources.md first), the catalogue's compliance notes (§7.6) and naming
// rules (§9), and the audit's "30–45 minute" line (the booked length is a fact: 30 minutes).
// Deterministic (02 §1.5): no dates and no build time. The owner reviews the output, then uploads it
// through DZ · Knowledge Upload (automation guide, Part G). tests/unit/agent-knowledge.test.ts checks
// that the committed file equals a fresh generation and that nothing unconfirmed leaks in.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const OUTPUT = 'docs/facts/agent-knowledge.md';
export const CATALOGUE_MD = 'Planning Folder/For Ai/DeepZeta Services Catalogue.md';
export const FACTS_MD = 'docs/facts/company-facts.md';
export const SALES_MD = 'docs/facts/sales-knowledge.md';
// The client row's business_profile is read into every prompt, so it stays short.
export const BUSINESS_PROFILE_MAX = 1500;

// The facts the agent may state: [the row's label in the facts tables, the label the agent sees].
export const FACT_LABELS = [
  ['Brand name', 'Brand'],
  ['Brand descriptor', 'Descriptor'],
  ['Legal company name', 'Legal name'],
  ['Positioning line', 'Positioning'],
  ['Founding date', 'Founded'],
  ['Trade licence issuing authority', 'Licensed by'],
  ['Full address, one line (display)', 'Office address'],
  ['Opening hours', 'Opening hours'],
  ['Google Business Profile URL', 'Google Maps location'],
  ['Phone (international format)', 'Phone'],
  ['Public contact email', 'Email'],
  ['Domain / canonical site URL', 'Website'],
  ['Primary market', 'Primary market'],
  ['Service structure', 'Service structure'],
  ['Free AI audit length', 'Free AI audit length'],
  ['Free AI audit booking hours', 'Free AI audit booking hours'],
  ['Audit meeting types', 'Free AI audit meeting types'],
];

// Catalogue lines a fact replaces: the audit's length is the owner's booked length (facts §3).
const SUPERSEDED = [{ number: '0.1', pattern: /minute discovery call/ }];

// A sentence with a year, a month, an amount or a mandate's phase states an external fact (a
// deadline, a threshold, a rollout).
const EXTERNAL_FACT =
  /\b(?:19|20)\d{2}\b|\bAED\b|\b[Pp]hases?\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/;

// The rules the agent follows whatever it's asked (00 N3; catalogue §9; facts §3 and §5).
const NEVER = [
  'Prices are not published yet. Never quote, estimate or compare a price, fee or package. Every project is scoped and quoted after the free AI automation audit.',
  'There are no published case studies, client names, reviews or results yet. Never mention or invent any. The only examples to share are the ones in the approved answers: deepzeta.ai and the two websites built by our team.',
  'Never promise guaranteed rankings, leads or results.',
  'Never state deadlines, legal requirements, regulator rules or amounts from outside sources, such as e-invoicing dates. Offer the free audit, or a member of the team, instead.',
  'Never give medical, legal, tax or financial advice.',
];

// The parts of a facts-table row: label → { value, status }. The tables in §1–§3 have Fact, Value
// and Status as their first three columns; other tables' rows never match a label in FACT_LABELS.
export function parseFacts(md) {
  const rows = new Map();
  for (const line of md.split(/\r?\n/)) {
    if (!line.startsWith('| ') || /^\|\s*-/.test(line)) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells.length < 3 || rows.has(cells[0])) continue;
    rows.set(cells[0], { value: cells[1], status: cells[2] });
  }
  return rows;
}

// Every published FAQ: each list the FAQ bank exports (one per page, engine §6.2 rule 1), Home's
// first and the rest by export name, each question once.
export function publishedFaqs(faqBank) {
  const lists = Object.keys(faqBank)
    .filter((name) => Array.isArray(faqBank[name]))
    .sort((a, b) => (a === 'homeFaq' ? -1 : b === 'homeFaq' ? 1 : a < b ? -1 : 1));
  const seen = new Set();
  return lists.flatMap((name) => faqBank[name]).filter((q) => !seen.has(q.id) && seen.add(q.id));
}

// The owner's sales answers: each "## N. Title" section whose status line says APPROVED, with its
// table rows ("| N.N | Topic | Answer |"); a row that says OPEN is never taken (sales-knowledge rules).
/** @returns {{ number: string, title: string, approved: boolean, rows: { id: string, topic: string, answer: string }[] }[]} */
export function parseSalesKnowledge(md) {
  const sections = [];
  let current = null;
  for (const line of md.split(/\r?\n/)) {
    const heading = line.match(/^## (\d+)\. (.+)$/);
    if (heading) {
      current = { number: heading[1], title: heading[2], approved: false, rows: [] };
      sections.push(current);
      continue;
    }
    if (!current) continue;
    if (/Status of every entry: \*\*APPROVED\b/.test(line)) current.approved = true;
    const cells = line.startsWith('| ')
      ? line
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim())
      : [];
    if (cells.length === 3 && /^\d+\.\d+$/.test(cells[0]) && !/\bOPEN\b/.test(line)) {
      current.rows.push({ id: cells[0], topic: cells[1], answer: cells[2] });
    }
  }
  return sections.filter((s) => s.approved && s.rows.length);
}

// A note for the owner, in brackets, that the agent doesn't need: a source or date ("owner, …"), a
// file name in code marks, or a cross-reference ("as 2.7", "8.3").
const INTERNAL_NOTE = /\s*\((?:[^()]*\bowner\b[^()]*|[^()]*`[^()]*|(?:as |see )?\d+\.\d+)\)/g;

// The catalogue's highlights with the owner's wording (sales-knowledge 9.3): a sentence that starts
// with a highlight's label replaces that bullet; any other sentence becomes a new bullet after them.
function withHighlights(intro, sentences) {
  const lines = [...intro];
  let last = lines.findLastIndex((line) => line.startsWith('- '));
  for (const sentence of sentences) {
    const label = sentence.match(/^([^:]+):/)?.[1];
    const at = label ? lines.findIndex((line) => line.startsWith(`- ${label}:`)) : -1;
    const bullet = `- ${sentence.replace(/\.$/, '')}`;
    if (at >= 0) lines[at] = bullet;
    else lines.splice(++last, 0, bullet);
  }
  return lines;
}

// Markdown the agent shouldn't echo: links become their text, bold and code marks go.
function plain(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

// The catalogue's old lowercase brand becomes the brand name (C29); URLs and emails are untouched.
function brand(text) {
  return text.replace(/(?<![@/.\w-])deepzeta(?![.\w-])/g, 'Deepzeta AI');
}

// One catalogue line, cleaned: sentences stating external facts are dropped.
function cleanLine(line) {
  const kept = plain(brand(line))
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .filter((sentence) => !EXTERNAL_FACT.test(sentence));
  return kept.join(' ').trim();
}

// The catalogue by number: each item's lines (description and bullets), the group names (1A…), the
// intro ("What deepzeta does") and the platforms table (§8).
export function parseCatalogue(md) {
  const items = new Map();
  const groups = new Map();
  const intro = [];
  const platforms = [];
  let current = null;
  let section = '';
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trimEnd();
    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      section = h2[1];
      current = null;
      continue;
    }
    const group = line.match(/^### (\d[A-K])\. (.+)$/);
    if (group) {
      groups.set(group[1], group[2]);
      current = null;
      continue;
    }
    const item = line.match(/^#{3,4} (\d[A-K]?\.\d{1,2}) /);
    if (item) {
      current = [];
      items.set(item[1], current);
      continue;
    }
    if (line.startsWith('#') || line === '---') {
      current = null;
      continue;
    }
    if (!line) continue;
    if (section === 'What deepzeta does') intro.push(line);
    else if (section.startsWith('8.') && line.startsWith('| ') && !/^\|\s*-/.test(line)) {
      const [category, list] = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      if (category !== 'Category') platforms.push([category, list]);
    } else if (current) current.push(line);
  }
  return { items, groups, intro, platforms };
}

// An item's lines, cleaned, without the lines a fact supersedes or a bundle's composition line.
function itemLines(catalogue, number, { dropComposition = false } = {}) {
  const lines = catalogue.items.get(number);
  if (!lines) throw new Error(`agent:knowledge: catalogue item ${number} has no section in the catalogue`);
  return lines
    .filter((line) => !SUPERSEDED.some((s) => s.number === number && s.pattern.test(line)))
    .filter((line) => !(dropComposition && /\(\d[A-K]?\.\d/.test(line)))
    .map(cleanLine)
    .filter(Boolean);
}

export function buildAgentKnowledge({ factsMd, catalogueMd, salesMd, catalogue, industryData, faq, siteConfig }) {
  const facts = parseFacts(factsMd);
  const sales = parseSalesKnowledge(salesMd);
  const isHighlights = (row) => row.topic === 'Our highlights';
  const highlights = sales
    .flatMap((s) => s.rows)
    .filter(isHighlights)
    .flatMap((row) => row.answer.split(/(?<=\.)\s+/));
  const confirmed = FACT_LABELS.flatMap(([label, shown]) => {
    const row = facts.get(label);
    return row && row.status.startsWith('CONFIRMED') && row.value !== '—' ? [[label, shown, plain(row.value)]] : [];
  });
  const fact = (label) => confirmed.find(([l]) => l === label)?.[2];
  const parsed = parseCatalogue(catalogueMd);
  const nameOf = new Map(
    [...catalogue.services, ...catalogue.starterOffers, ...catalogue.bundles].map((s) => [s.number, s.name]),
  );

  // The business profile: the short facts every prompt carries (the client row's business_profile).
  const profile = [
    `${fact('Brand name')} (${fact('Legal company name')}), ${fact('Brand descriptor')}.`,
    fact('Positioning line'),
    `Service pillars: ${catalogue.pillars.map((p) => `${p.name} (${p.promise})`).join('; ')}.`,
    `Main offer: the ${nameOf.get('0.1')}. Length: ${fact('Free AI audit length')}. Booking hours: ${fact('Free AI audit booking hours')}. Meeting types: ${fact('Audit meeting types')}.`,
    `Primary market: ${fact('Primary market')}.`,
    `Office: ${fact('Full address, one line (display)')}. Opening hours: ${fact('Opening hours')}.`,
    [
      fact('Public contact email') && `Email: ${fact('Public contact email')}`,
      fact('Phone (international format)') && `Phone: ${fact('Phone (international format)')}`,
      fact('Domain / canonical site URL') && `Website: ${fact('Domain / canonical site URL')}`,
      fact('Google Business Profile URL') && `Google Maps location: ${fact('Google Business Profile URL')}`,
    ]
      .filter(Boolean)
      .join(' · ') + '.',
    `Founder: ${siteConfig.founder.name}.`,
    'Prices are not published: every project is scoped and quoted after the free audit.',
  ].join('\n');
  if (profile.length > BUSINESS_PROFILE_MAX) {
    throw new Error(
      `agent:knowledge: the business profile is ${profile.length} characters (max ${BUSINESS_PROFILE_MAX})`,
    );
  }

  const out = [];
  const push = (...lines) => out.push(...lines);
  const service = (number, context, options) => {
    push(`### ${nameOf.get(number)}`);
    if (context) push(context);
    push(...itemLines(parsed, number, options), '');
  };

  push(
    '<!-- Generated by `npm run agent:knowledge` (scripts/build-agent-knowledge.mjs). Do not edit by hand: change',
    'the sources, regenerate, have the owner review it, then upload it with "Replace ALL" (automation guide, Part G). -->',
    '',
    `# ${fact('Brand name')}: what the assistant knows`,
    '',
    '## Business profile',
    '',
    '<!-- business-profile:start -->',
    profile,
    '<!-- business-profile:end -->',
    '',
    `## About ${fact('Brand name')}`,
    '',
    ...withHighlights(parsed.intro.map(cleanLine).filter(Boolean), highlights),
    '',
    '## Company and contact details',
    '',
    ...confirmed.map(([, shown, value]) => `- ${shown}: ${value}`),
    `- Founder: ${siteConfig.founder.name}`,
    '',
    `## Booking the ${nameOf.get('0.1')}`,
    '',
    `The ${nameOf.get('0.1')} is free. It can be booked right here in this chat.`,
    `- Length: ${fact('Free AI audit length')}`,
    `- Booking hours: ${fact('Free AI audit booking hours')}`,
    `- Meeting types: ${fact('Audit meeting types')}`,
    '',
    '## Starter offers',
    '',
  );
  for (const offer of catalogue.starterOffers) service(offer.number, 'Starter offer');

  for (const pillar of catalogue.pillars) {
    push(`## ${pillar.name} pillar: ${pillar.promise}`, '');
    for (const s of catalogue.services.filter((x) => x.pillar === pillar.pixel)) {
      const key = s.number.match(/^\d[A-K]/)?.[0] ?? null;
      const groupName = key ? parsed.groups.get(key) : null;
      service(s.number, `Pillar: ${pillar.name}${groupName ? ` · ${groupName}` : ''}`);
    }
  }

  push('## Bundles (packaged solutions)', '');
  for (const b of catalogue.bundles) {
    service(b.number, `Includes: ${b.components.map((n) => nameOf.get(n)).join(', ')}`, { dropComposition: true });
  }

  push('## Ongoing care and add-ons', '');
  for (const s of catalogue.services.filter((x) => !x.pillar)) service(s.number, 'Ongoing care or add-on');

  push('## Industries we serve', '');
  for (const g of industryData.industryGroups) {
    push(
      `- ${g.name}: ${industryData.industries
        .filter((i) => i.group === g.number)
        .map((i) => i.name)
        .join(', ')}`,
    );
  }
  push('', '### Best-fit automations by industry', '');
  for (const row of industryData.bestFitAutomations) {
    push(`- ${row.label}: ${row.automations.map((n) => nameOf.get(n)).join(', ')}`);
  }

  push('', '## Tools and platforms we work with', '');
  for (const [category, list] of parsed.platforms) push(`- ${category}: ${plain(list)}`);

  push(
    '',
    '## How we work: the approved answers',
    '',
    `These are ${fact('Brand name')}'s own answers on timelines, process, terms and common doubts. Where a frequently asked question below says something more general, give these answers.`,
    '',
  );
  for (const section of sales) {
    const rows = section.rows.filter((row) => !isHighlights(row));
    if (!rows.length) continue;
    push(`### ${plain(section.title)}`, '');
    for (const row of rows) {
      push(`- ${plain(row.topic).replace(INTERNAL_NOTE, '')}: ${plain(row.answer.replace(INTERNAL_NOTE, ''))}`);
    }
    push('');
  }

  push('## Frequently asked questions', '');
  for (const q of faq) push(`### ${q.question}`, q.answer, '');

  push(`## What ${fact('Brand name')} never says or does`, '', ...NEVER.map((rule) => `- ${rule}`), '');

  return { markdown: out.join('\n'), businessProfile: profile };
}

async function main() {
  const root = process.cwd();
  const load = (rel) => import(pathToFileURL(join(root, rel)).href);
  const [catalogue, industryData, faqBank, { siteConfig }] = await Promise.all([
    load('src/content/catalogue.ts'),
    load('src/content/emirates-industries.ts'),
    load('src/content/en/faq-bank.ts'),
    load('src/lib/site-config.ts'),
  ]);
  const { markdown, businessProfile } = buildAgentKnowledge({
    factsMd: readFileSync(join(root, FACTS_MD), 'utf8'),
    catalogueMd: readFileSync(join(root, CATALOGUE_MD), 'utf8'),
    salesMd: readFileSync(join(root, SALES_MD), 'utf8'),
    catalogue,
    industryData,
    faq: publishedFaqs(faqBank),
    siteConfig,
  });
  writeFileSync(join(root, OUTPUT), markdown);
  console.log(
    `agent:knowledge wrote ${OUTPUT} (${markdown.length} characters; business profile ${businessProfile.length}/${BUSINESS_PROFILE_MAX}).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
