import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  bestFitAutomations as bestFitData,
  emirates as emirateData,
  industries as industryData,
  industryGroups,
  type BestFitAutomation,
  type EmiratesEntry,
  type Industry,
} from '@/content/emirates-industries';

// The shared emirates/industries data (src/content/emirates-industries.ts) against its two
// sources (P4 plan, S2; open question 1, option B): the Services Catalogue §7 (groups, the 27
// industries, the §7.5 best-fit table) and the URL registry (the four group rows R101–R104; the
// reserved patterns R200–R201). The emirates are the UAE's seven, in the traditional order, with
// a re-verification note in the module — first used by a page in P6.

const CATALOGUE = readFileSync('Planning Folder/For Ai/DeepZeta Services Catalogue.md', 'utf8');
const REGISTRY = readFileSync('docs/seo/url-registry.md', 'utf8');

const industries: readonly Industry[] = industryData;
const emirates: readonly EmiratesEntry[] = emirateData;
const bestFitAutomations: readonly BestFitAutomation[] = bestFitData;

// The catalogue's §7.1–§7.4 group sections, in order: "### 7.1 B2B, Corporate & Tech". §7.5
// (the best-fit table) and §7.6 (compliance notes) are also "### 7.n" headings, so the number
// is limited to the four groups.
const groupSections = [...CATALOGUE.matchAll(/^### (7\.[1-4]) (.+)$/gm)];
// §7.5's table rows: "| Real Estate | Speed-to-Lead (portals), WhatsApp AI Agent, … |". The
// section runs from its heading to the next "## " heading (§8), so rows are matched inside that
// slice — anchoring against a window before each row misses the heading entirely.
const section75 = CATALOGUE.slice(
  CATALOGUE.indexOf('### 7.5'),
  CATALOGUE.indexOf('\n## ', CATALOGUE.indexOf('### 7.5')),
);
const bestFitRows = [...section75.matchAll(/^\| ([^|]+) \| ([^|]+) \|$/gm)].filter(
  ([match]) => !/^\| Industry \|/.test(match) && !/^\|---/.test(match),
);

// Registry rows as cells, ID first (catalogue.test.ts's shape).
const registryRows = new Map(
  REGISTRY.split('\n')
    .filter((line) => /^\| R\d{3} \|/.test(line))
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      return [cells[0]!, cells[1]!.replace(/`/g, '')] as const;
    }),
);

// The catalogue's informal name in a §7.5 cell → its catalogue number (the module's header
// comment documents each mapping; §7.5 names services by shorthand, not exact names).
const INFORMAL: Record<string, string> = {
  'Speed-to-Lead (portals)': '1B.1',
  'WhatsApp AI Agent': '1A.1',
  'Viewing Scheduling': '1C.3',
  'CRM Automation': '1B.6',
  'AI Voice Receptionist': '1A.2',
  'Booking Automation': '1C.1',
  'Reminders & No-Show Reduction': '1C.2',
  'Review Automation': '1D.3',
  'Quote-to-Cash System': '5.2',
  'Job & Work-Order Management': '1E.1',
  'AMC Scheduling': '1E.2',
  'Automated Quotation & Tracking': '1B.3',
  'Proposal Automation': '1B.4',
  'Client Portal': '3.2',
  'AI Shopping Visibility': '1I.2',
  'Store Operations Automation': '1I.1',
  'AI Ad Creative': '4B.6',
  'Table & Reservation Automation': '1C.5',
  'Enquiry Speed-to-Lead': '1B.1',
  'Event & Webinar Registration': '1C.4',
  'Nurture Sequences': '1B.5',
  'Website AI Chat Agent': '1A.4',
  'Document Extraction': '1F.3',
  'Contract Generation': '1F.6',
  'Service-Due Reminders': '1D.4',
  'Renewal & Win-Back Automation': '1D.4',
  'Recruitment Automation': '1G.1',
  'AI Sales Prospecting': '1B.7',
  'Delivery & Logistics Tracking': '1E.5',
  'Custom AI Agents': '1A.7',
  // The Logistics row's shorthand for 1B.3 (its full name is "Automated Quotation & Quote
  // Tracking System", the row's Construction name is the longer "Automated Quotation & Tracking").
  'Automated Quotation': '1B.3',
};

describe('the industry groups (catalogue §7.1–§7.4)', () => {
  it("are the catalogue's four, names byte for byte, at their registry paths", () => {
    expect(groupSections).toHaveLength(4);
    expect(industryGroups).toHaveLength(4);
    industryGroups.forEach((group, index) => {
      const [, number, name] = groupSections[index]!;
      expect(group.number).toBe(number);
      expect(group.name).toBe(name);
      expect(`/industries/${group.slug}`).toBe(registryRows.get(`R10${index + 1}`));
    });
  });

  it('carry the compound slugs the registry reserved (no collision with single industries)', () => {
    const singleSlugs = new Set(industries.map((industry) => industry.slug));
    for (const group of industryGroups) {
      expect(singleSlugs.has(group.slug), group.slug).toBe(false);
    }
  });
});

describe('the 27 individual industries (catalogue §7.1–§7.4 lists)', () => {
  it("each name is in its group's catalogue list, byte for byte, in list order", () => {
    expect(industries).toHaveLength(27);
    for (const group of industryGroups) {
      const section = groupSections.find(([, number]) => number === group.number)!;
      const list = CATALOGUE.slice(
        CATALOGUE.indexOf(section[0]),
        CATALOGUE.indexOf('###', CATALOGUE.indexOf(section[0]) + 1),
      )
        .split('\n')
        .find((line) => line.trim() && !line.startsWith('#') && !line.startsWith('|'))!
        .trim();
      const listed = list.split('·').map((name) => name.trim());
      const mine = industries.filter((industry) => industry.group === group.number);
      expect(mine.map((industry) => industry.name)).toEqual(listed);
    }
  });

  it('slugs are kebab-case, unique, and never end in a hyphen', () => {
    const slugs = industries.map((industry) => industry.slug);
    expect(new Set(slugs).size).toBe(27);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });
});

describe('the §7.5 best-fit table', () => {
  it('has one row per catalogue row, labels byte for byte, in order', () => {
    expect(bestFitRows).toHaveLength(12);
    expect(bestFitAutomations).toHaveLength(12);
    bestFitAutomations.forEach((row, index) => {
      expect(row.label).toBe(bestFitRows[index]![1]!.trim());
    });
  });

  it('resolves every automation the table names to a catalogue number, in order', () => {
    bestFitAutomations.forEach((row, index) => {
      // Match arrays: [full row, label, automations cell].
      const [, , cell] = bestFitRows[index]!;
      const named = cell!.split(',').map((name) => name.trim());
      expect(row.automations, row.label).toHaveLength(named.length);
      named.forEach((name, position) => {
        expect(row.automations[position], `${row.label}: "${name}"`).toBe(INFORMAL[name]);
      });
    });
  });

  it("covers industries that exist, and every industry in a covered group's row", () => {
    const bySlug = new Map(industries.map((industry) => [industry.slug, industry]));
    const covered = new Set<string>();
    for (const row of bestFitAutomations) {
      for (const slug of row.industries) {
        expect(bySlug.has(slug), row.label).toBe(true);
        expect(covered.has(slug), `${slug} twice`).toBe(false);
        covered.add(slug);
      }
    }
    // The table covers 17 of the 27 (the S2 module mapped group rows to their member industries,
    // so a row like "Technical Services & Facility Management" covers its three); the rest get
    // their best fits from their group page (P6).
    expect(covered.size).toBe(17);
  });
});

describe('the emirates (reserved R201)', () => {
  it("are the UAE's seven, in the traditional order, with unique kebab-case slugs", () => {
    expect(emirates.map((emirate) => emirate.name)).toEqual([
      'Abu Dhabi',
      'Dubai',
      'Sharjah',
      'Ajman',
      'Umm Al Quwain',
      'Ras Al Khaimah',
      'Fujairah',
    ]);
    expect(new Set(emirates.map((emirate) => emirate.slug)).size).toBe(7);
    for (const emirate of emirates) {
      expect(emirate.slug).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    }
  });

  it('reserves the R201 dimension: an industry slug never equals an emirate slug', () => {
    const emirateSlugs = new Set(emirates.map((emirate) => emirate.slug));
    for (const industry of industries) {
      expect(emirateSlugs.has(industry.slug), industry.slug).toBe(false);
    }
  });
});
