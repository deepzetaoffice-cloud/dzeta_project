import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  bundles as bundleData,
  pillars,
  services as serviceData,
  starterOffers as offerData,
  type CatalogueBundle,
  type CatalogueService,
  type StarterOffer,
} from '@/content/catalogue';
import { PILLARS } from '@/components/icons/registry';

// The catalogue data (src/content/catalogue.ts) against its two sources (P4 plan, S2): the
// Services Catalogue (names byte for byte, numbers, priority tags, pillar structure, bundle
// components) and the URL registry (every slug its row's path). Checked in both directions: the
// catalogue file has a heading for every service, and every registry row for a catalogue service
// is covered — neither can drift.

const CATALOGUE = readFileSync('Planning Folder/For Ai/DeepZeta Services Catalogue.md', 'utf8');
const REGISTRY = readFileSync('docs/seo/url-registry.md', 'utf8');

// Widened from the `as const` data to the declared shapes, so optional fields (pillar, slug,
// flagship) can be walked uniformly.
const services: readonly CatalogueService[] = serviceData;
const starterOffers: readonly StarterOffer[] = offerData;
const bundles: readonly CatalogueBundle[] = bundleData;

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// "#### 1A.1 WhatsApp AI Agent 🔥" / "### 2.1 Custom-Coded … 🔥 (Flagship)": the exact number and
// name, then the tag, a parenthetical or the line's end.
const heading = (number: string, name: string) => new RegExp(`^#{3,4} ${escape(number)} ${escape(name)}(?: |$)`, 'm');
// The same heading with its priority tag on it (§ "Priority tags used below"). The tag is escaped
// too: the flagship's "🔥 (Flagship)" carries literal parentheses.
const taggedHeading = (number: string, name: string, tag: string) =>
  new RegExp(`^#{3,4} ${escape(number)} ${escape(name)} ${escape(tag)}`, 'm');
const TAGS: Record<string, string> = { lead: '🔥', core: '⭐', addon: '➕', timely: '⏰' };

// Registry rows as cells: ID, URL, then the table's other columns. Tables with a Cat. column
// (§3.1–§3.6) have it fifth.
const registryRows = new Map(
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

// Every catalogue number the registry gives a page, with that page's path: service numbers
// (1A.1, 2.1, 6.1), the starter offers (0.1–0.3) and the bundles (5.1–5.6). Pillar rows carry
// bare section numbers (1–4) and are read separately.
const numberToPath = new Map(
  [...registryRows]
    .filter(([, { catalogue }]) => /^\d[A-K]?\.\d$/.test(catalogue))
    .map(([, { path, catalogue }]) => [catalogue, path] as const),
);
const servicePath = (slug: string) => `/services/${slug}`;

describe('the pillars (catalogue § "How the catalogue is organised")', () => {
  it("are the catalogue's four, in order, with its promises, pixels and the registry slugs", () => {
    const rows = [...CATALOGUE.matchAll(/^\| (\d)\. ([^|]+?) \| [^|]+ \| ([^|]+?) \| `--dz-pixel-(\w+)` \|$/gm)];
    expect(rows).toHaveLength(4);
    expect(pillars).toHaveLength(4);
    pillars.forEach((pillar, index) => {
      const [, number, name, promise, pixel] = rows[index]!;
      expect(pillar.number).toBe(Number(number));
      expect(pillar.name).toBe(name);
      expect(pillar.promise).toBe(promise);
      expect(pillar.pixel).toBe(pixel);
      expect(pillar.slug).toBe(registryRows.get(`R01${index + 1}`)!.path.replace('/services/', ''));
    });
    expect(PILLARS).toEqual(pillars.map((pillar) => pillar.pixel));
  });
});

describe('the services', () => {
  it('each has its catalogue heading: number, exact name and priority tag', () => {
    for (const service of services) {
      expect(CATALOGUE, `${service.number} ${service.name}`).toMatch(heading(service.number, service.name));
      expect(CATALOGUE, `${service.number} ${service.name}`).toMatch(
        taggedHeading(service.number, service.name, TAGS[service.priority]!),
      );
    }
  });

  it('has exactly one service per catalogue service heading (no invention, no omission)', () => {
    // Service headings are ###/#### with a number like 1A.1, 2.1, 0.1, 5.1, 4A. Sections 0 and
    // 5 are the starter offers and bundles; sections 1–4 and 6 are the services.
    const numbers = [...CATALOGUE.matchAll(/^#{3,4} (\d[A-K]?\.\d) .+$/gm)]
      .map((match) => match[1])
      // Sections 1–4 and 6 only: 0.x are the starter offers, 5.x the bundles, 7.x the
      // industry sections (7.5 and 7.6 are also "### 7.n …" headings).
      .filter((number): number is string => number !== undefined && /^[1-46]/.test(number));
    expect(numbers).toHaveLength(services.length);
    expect(new Set(numbers)).toEqual(new Set(services.map((service) => service.number)));
  });

  it('sections 1–4 belong to the right pillar; section 6 is cross-pillar', () => {
    for (const service of services) {
      if (/^[1-4]/.test(service.number)) {
        expect(service.pillar, `${service.number}`).toBe(pillars[Number(service.number[0]) - 1]!.pixel);
      } else {
        expect(service.number).toMatch(/^6\./);
        expect(service.pillar, `${service.number}`).toBeUndefined();
      }
    }
  });

  it('carries the flagship marker on 2.1 only, as the catalogue does', () => {
    expect(CATALOGUE).toMatch(taggedHeading('2.1', 'Custom-Coded High-Performance Websites', '🔥 (Flagship)'));
    expect(services.filter((service) => service.flagship).map((service) => service.number)).toEqual(['2.1']);
  });

  it("each service's slug equals the path its catalogue number's registry row gives it", () => {
    for (const service of services) {
      const path = numberToPath.get(service.number);
      if (path) {
        expect(service.slug, service.number).toBeDefined();
        expect(servicePath(service.slug!), service.number).toBe(path);
      } else {
        expect(service.slug, service.number).toBeUndefined();
      }
    }
    // And the other direction: every registry service row is a service here (R084, the cross-
    // pillar AI Ops Retainer, included). The 0.x rows are the starter offers, 5.x the bundles,
    // 7.x the industry groups — none of them are services.
    for (const [number, path] of numberToPath) {
      if (!/^[1-46]/.test(number)) continue;
      expect(
        services.some((s) => s.number === number && servicePath(s.slug ?? '') === path),
        `${number} → ${path}`,
      ).toBe(true);
    }
  });

  it("the services without pages are exactly the registry's ➕ add-on list", () => {
    const listed = REGISTRY.match(/\*\*Catalogue ➕ add-ons\*\*[^:]*:\s*([\dA-Z., ]+)\./)![1]!
      .split(',')
      .map((number) => number.trim());
    expect(services.filter((service) => !service.slug).map((service) => service.number)).toEqual(listed);
  });
});

describe('the starter offers (catalogue §0)', () => {
  it("are the catalogue's three, names byte for byte, at their registry paths", () => {
    expect(CATALOGUE).toMatch(heading('0.1', 'Free AI Automation Audit'));
    expect(CATALOGUE).toMatch(heading('0.2', 'AI Readiness Assessment (paid, in-depth)'));
    expect(CATALOGUE).toMatch(heading('0.3', 'Website & AI Search Health Check'));
    expect(starterOffers.map((offer) => offer.path)).toEqual([
      numberToPath.get('0.1'),
      numberToPath.get('0.2'),
      numberToPath.get('0.3'),
    ]);
    expect(starterOffers.map((offer) => offer.priority)).toEqual(['lead', 'core', 'core']);
  });
});

describe('the bundles (catalogue §5)', () => {
  it("are the catalogue's six, names and components exactly, at their registry slugs", () => {
    expect(bundles).toHaveLength(6);
    for (const bundle of bundles) {
      expect(CATALOGUE, `${bundle.number} ${bundle.name}`).toMatch(heading(bundle.number, bundle.name));
      // §5 names the components in parentheses after each service's name, in order. A
      // parenthesised pair like "(1I.1–1I.2)" is a range and expands to both numbers.
      const at = CATALOGUE.indexOf(`### ${bundle.number} `);
      const section = CATALOGUE.slice(at, CATALOGUE.indexOf('\n###', at + 1));
      const listed = [...section.matchAll(/\(([\dA-Z.]+)(?:–([\dA-Z.]+))?\)/g)].flatMap(([, from, to]) => {
        if (!to) return [from!];
        const prefix = from!.slice(0, from!.lastIndexOf('.') + 1);
        const start = Number(from!.slice(prefix.length));
        const end = Number(to!.slice(to!.lastIndexOf('.') + 1));
        return Array.from({ length: end - start + 1 }, (_, i) => `${prefix}${start + i}`);
      });
      expect(bundle.components, bundle.name).toEqual(listed);
      expect(`/solutions/${bundle.slug}`).toBe(numberToPath.get(bundle.number));
    }
    expect(bundles.map((bundle) => bundle.priority)).toEqual(['lead', 'lead', 'lead', 'core', 'core', 'timely']);
  });

  it('names only components that exist (services or starter offers)', () => {
    const numbers = new Set([
      ...services.map((service) => service.number),
      ...starterOffers.map((offer) => offer.number),
    ]);
    for (const bundle of bundles) {
      for (const component of bundle.components) {
        expect(numbers.has(component), `${bundle.number} → ${component}`).toBe(true);
      }
    }
  });
});
