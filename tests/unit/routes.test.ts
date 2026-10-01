import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { navigation as content, type Navigation } from '@/content/en/navigation';
import { isShown, navHref, ROUTES, type RouteId } from '@/lib/routes';

// The typed route seed and the navigation that uses it (P2 plan, A1 and O; engine §5.3 rule 5).

// Widened from the `as const` data to its declared shape, so the lists can be walked together.
const navigation: Navigation = content;

const REGISTRY = readFileSync('docs/seo/url-registry.md', 'utf8');
const CATALOGUE = readFileSync('Planning Folder/For Ai/DeepZeta Services Catalogue.md', 'utf8');

// Registry rows as cells: ID, URL, then the table's other columns. Tables with a Cat. column (§3.1–§3.6)
// have it fifth.
const rows = new Map(
  REGISTRY.split('\n')
    .filter((line) => /^\| R\d{3} \|/.test(line))
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      return [cells[0]!, { path: cells[1]!.replace(/`/g, ''), catalogue: cells[4] ?? '' }] as const;
    }),
);

// The URL of every page file under src/app: route groups and private folders don't add a segment.
function pagePaths(dir = 'src/app', segments: string[] = []): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_') || entry.name.startsWith('@')) continue;
      const group = /^\(.*\)$/.test(entry.name);
      found.push(...pagePaths(join(dir, entry.name), group ? segments : [...segments, entry.name]));
    } else if (/^page\.(tsx|ts|jsx|js|mdx)$/.test(entry.name)) {
      found.push(`/${segments.join('/')}`);
    }
  }
  return found;
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// "### 1A.1 WhatsApp AI Agent 🔥": the exact name after the number, then a space or the line's end.
const catalogueHeading = (number: string, name: string) =>
  new RegExp(`^#{3,4} ${escape(number)} ${escape(name)}(?: |$)`, 'm');

describe('the route seed (src/lib/routes.ts)', () => {
  const ids = Object.keys(ROUTES) as RouteId[];

  it.each(ids)('%s has the path its registry row gives it', (id) => {
    expect(rows.get(id)?.path).toBe(ROUTES[id].path);
  });

  it('marks a route live exactly when its page file exists', () => {
    const pages = new Set(pagePaths());
    expect(pages.has('/')).toBe(true);
    for (const id of ids) expect(ROUTES[id].live, `${id} ${ROUTES[id].path}`).toBe(pages.has(ROUTES[id].path));
  });
});

describe('the navigation (src/content/en/navigation.ts)', () => {
  it('has one column per pillar, in catalogue order, named with the catalogue promise', () => {
    const pillars = [...CATALOGUE.matchAll(/^\| (\d)\. ([^|]+?) \| [^|]+ \| ([^|]+?) \| `--dz-pixel-(\w+)` \|$/gm)];
    expect(navigation.columns.map((c) => [c.name, c.promise, c.pillar])).toEqual(
      pillars.map(([, , name, promise, pillar]) => [name, promise, pillar]),
    );
    for (const [index, column] of navigation.columns.entries()) {
      expect(rows.get(column.route)?.catalogue, column.name).toBe(String(index + 1));
    }
  });

  it('names every service and solution exactly as the catalogue does, through its registry row', () => {
    const entries = [...navigation.columns.flatMap((column) => column.items), ...navigation.solutions.items];
    for (const { route, name } of entries) {
      const number = rows.get(route)?.catalogue ?? '';
      expect(number, `${route} has a catalogue number`).toMatch(/^\d/);
      expect(CATALOGUE, `${route}: ${number} ${name}`).toMatch(catalogueHeading(number, name));
    }
    expect(navigation.solutions.items).toHaveLength(6);
  });

  it('keeps each outcome to one line of at most 8 words, with no numbers (plan N)', () => {
    const outcomes = navigation.columns.flatMap((column) => column.items.map((item) => item.outcome));
    for (const outcome of outcomes) {
      expect(outcome.trim().split(/\s+/).length, outcome).toBeLessThanOrEqual(8);
      expect(outcome, outcome).not.toMatch(/\d/);
      expect(outcome, outcome).not.toBe('');
    }
    expect(new Set(outcomes).size).toBe(outcomes.length);
  });

  it('links only to rows in the seed, never to the same place twice in one list', () => {
    const lists = [
      navigation.primary.map((link) => link.route),
      navigation.rail.map((link) => link.route),
      ...navigation.columns.map((column) => [column.route, ...column.items.map((item) => item.route)]),
      [navigation.solutions.route, ...navigation.solutions.items.map((item) => item.route)],
    ];
    for (const list of lists) {
      for (const id of list) expect(ROUTES).toHaveProperty(id);
      expect(new Set(list).size).toBe(list.length);
    }
  });
});

describe("the shell's link helpers", () => {
  it('show a live route at its path, and every route on the review page as a fragment of itself', () => {
    expect(isShown('R001', false)).toBe(true);
    expect(navHref('R001', false)).toBe('/');
    expect(isShown('R011', false)).toBe(ROUTES.R011.live);
    expect(isShown('R011', true)).toBe(true);
    expect(navHref('R011', true)).toBe('#shell-R011');
    expect(navHref('R011', false)).toBe(ROUTES.R011.path);
  });
});
