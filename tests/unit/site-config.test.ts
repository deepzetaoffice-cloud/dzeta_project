import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { shellContent } from '@/content/en/shell';
import { siteConfig } from '@/lib/site-config';

// The site config against the facts file (P2 plan, N and O; docs/facts/company-facts.md): every value
// equals its CONFIRMED fact byte for byte (NAP is identical everywhere, facts §2), a fact that isn't
// confirmed is null, and the social profiles are the nine in §2.1, in its order, copied exactly.

const FACTS = readFileSync('docs/facts/company-facts.md', 'utf8');

// A table's rows as cells, keyed by the first cell (the fact or the platform).
const rows = new Map(
  FACTS.split('\n')
    .filter((line) => /^\| [^-|]/.test(line))
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      return [cells[0]!, cells.slice(1)] as const;
    }),
);

const fact = (name: string) => {
  const row = rows.get(name);
  if (!row) throw new Error(`no row "${name}" in the facts file`);
  return { value: row[0]!, status: row[1]! };
};

const confirmed = (name: string) => {
  const { value, status } = fact(name);
  expect(status, name).toMatch(/^CONFIRMED/);
  return value;
};

describe('siteConfig equals the facts file', () => {
  it('names, contact and address (facts §1–§2)', () => {
    expect(siteConfig.brandName).toBe(confirmed('Brand name'));
    expect(siteConfig.legalName).toBe(confirmed('Legal company name'));
    expect(siteConfig.positioningLine).toBe(confirmed('Positioning line'));
    expect(siteConfig.email).toBe(confirmed('Public contact email'));
    expect(siteConfig.address).toBe(confirmed('Full address, one line (display)'));
  });

  it('the opening hours: the fact for display, and the same fact in parts (facts §2; P3 plan, A)', () => {
    const fact = confirmed('Opening hours');
    const { display, days, opens, closes } = siteConfig.openingHours;
    expect(display).toBe(fact);
    const parts = /^(\w+) to (\w+), (\d\d:\d\d)–(\d\d:\d\d) .*; closed (\w+)$/.exec(fact);
    expect(parts, `can't read the hours "${fact}"`).not.toBeNull();
    const [, first, last, from, to, closed] = parts!;
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    expect(days).toEqual(week.slice(week.indexOf(first!), week.indexOf(last!) + 1));
    expect(days).not.toContain(closed);
    expect([opens, closes]).toEqual([from, to]);
  });

  it('a fact that is not confirmed is null, never filled (02 §1)', () => {
    for (const [key, name] of [
      ['phone', 'Phone (international format)'],
      ['whatsapp', 'WhatsApp number'],
    ] as const) {
      if (fact(name).status.startsWith('CONFIRMED')) expect(siteConfig[key], key).toBe(fact(name).value);
      else expect(siteConfig[key], key).toBeNull();
    }
  });

  it('the social profiles are facts §2.1, in its order, copied exactly', () => {
    const section = FACTS.slice(FACTS.indexOf('### 2.1'), FACTS.indexOf('### 2.2'));
    const table = section
      .split('\n')
      .filter((line) => /^\| [^-|]/.test(line) && !line.startsWith('| Platform'))
      .map((line) => line.split('|').map((cell) => cell.trim()));
    expect(table).toHaveLength(9);
    expect(siteConfig.social).toHaveLength(table.length);
    siteConfig.social.forEach((profile, index) => {
      const [, platform, url, , status] = table[index]!;
      expect(platform!.startsWith(profile.platform), `${profile.platform} is "${platform}"`).toBe(true);
      expect(profile.url).toBe(url);
      expect(status).toBe('CONFIRMED');
    });
    expect(new Set(siteConfig.social.map((profile) => profile.key)).size).toBe(9);
  });

  it('each social link is named "Deepzeta AI on <platform>" (facts §2.1 rules)', () => {
    expect(shellContent.socialLinkName(siteConfig.brandName, 'LinkedIn')).toBe('Deepzeta AI on LinkedIn');
  });

  it('the legal line names the legal company and the founding year (facts §1)', () => {
    const year = confirmed('Founding date').slice(0, 4);
    expect(shellContent.copyright).toBe(`© ${year}`);
  });
});
