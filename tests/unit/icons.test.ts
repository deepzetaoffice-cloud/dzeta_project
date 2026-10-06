import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Icon, type IconProps } from '@/components/icons/Icon';
import { CLUSTER, clusterBoxes } from '@/components/icons/Cluster';
import { CLEARANCE, IconDefs } from '@/components/icons/IconDefs';
import { PILLARS, TIER_1, TIER_2, TIER_3, type Pillar, type Shape } from '@/components/icons/registry';

// The Icon Master Rules as tests (P1 plan, section E; conflict C36: the registry is the source of
// truth, so these checks stand in for the Figma master and SVGO).

const CATALOGUE = readFileSync('Planning Folder/For Ai/DeepZeta Services Catalogue.md', 'utf8');
// Catalogue section → pillar (C6): 1 AI Automation, 2 Websites, 3 Software, 4 Growth & Ranking.
const PILLAR_BY_SECTION: Record<string, Pillar> = { '1': 'ai', '2': 'web', '3': 'software', '4': 'ranking' };
const BUDGET = { tier1: 400, tier2: 1024, tier3: 4096 }; // bytes (§2)
const onGrid = (n: number) => Number.isInteger(n * 4); // 0.25 units (§3)
const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const render = (props: IconProps) => renderToStaticMarkup(createElement(Icon, props));
const tier1 = Object.entries(TIER_1);
const tier2 = Object.entries(TIER_2);
const tier3 = Object.entries(TIER_3);

// The end point of every path segment (and each arc's radii). Bézier control points are free: they
// shape a curve, not a position.
function pathPositions(d: string): number[] {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
  const arity: Record<string, number> = { m: 2, l: 2, t: 2, h: 1, v: 1, c: 6, s: 4, q: 4, a: 7 };
  const positions: number[] = [];
  let command = '';
  for (let i = 0; i < tokens.length;) {
    const token = tokens[i] ?? '';
    if (/[a-zA-Z]/.test(token)) {
      command = token.toLowerCase();
      i++;
      if (command === 'z') continue;
    }
    const count = arity[command];
    if (count === undefined) throw new Error(`unknown path command in "${d}"`);
    const args = tokens.slice(i, i + count).map(Number);
    i += count;
    positions.push(...(count <= 2 ? args : args.slice(-2)));
    if (command === 'a') positions.push(...args.slice(0, 2));
  }
  return positions;
}

// Every position in a shape that must sit on the grid. A dot's radius is set by §6 (0.7–1), not the grid.
function shapePositions(shape: Shape): number[] {
  switch (shape.kind) {
    case 'path':
      return pathPositions(shape.d);
    case 'rect':
      return [shape.x, shape.y, shape.width, shape.height, shape.rx ?? 0];
    case 'circle':
      return [shape.cx, shape.cy, shape.r];
    case 'dot':
      return [shape.cx, shape.cy];
  }
}

describe('Tier 1 icons', () => {
  it.each(tier1)('%s: every end point on the 0.25 grid', (_, icon) => {
    expect(pathPositions(icon.d).filter((n) => !onGrid(n))).toEqual([]);
  });

  it.each(tier1)('%s: within the 0.4 KB budget, decorative, named dz-1-*', (name) => {
    const html = render({ name: name as keyof typeof TIER_1, size: 24 });
    expect(html).toContain(`data-icon="dz-1-${name}"`);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).not.toContain('dz-px');
    const symbol = renderToStaticMarkup(createElement(IconDefs)).match(
      new RegExp(`<symbol id="dz-1-${name}"[\\s\\S]*?</symbol>`),
    )?.[0];
    expect(symbol).toBeDefined();
    expect(new TextEncoder().encode(symbol).length).toBeLessThanOrEqual(BUDGET.tier1);
  });

  it('marks exactly the directional icons to flip in Arabic (§9)', () => {
    expect(tier1.filter(([, icon]) => icon.flip).map(([name]) => name)).toEqual(['arrow', 'send', 'external-link']);
    expect(render({ name: 'arrow', size: 20 })).toContain('dz-icon--flip');
    expect(render({ name: 'close', size: 20 })).not.toContain('dz-icon--flip');
  });
});

describe('Tier 2 icons', () => {
  it.each(tier2)('%s: the exact catalogue name, its pillar and its slug', (name, icon) => {
    const heading = new RegExp(
      `^#{3,4} ${icon.catalogue.replace(/\./g, '\\.')} ${icon.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?: |$)`,
      'm',
    );
    expect(CATALOGUE).toMatch(heading);
    expect(icon.pillar).toBe(PILLAR_BY_SECTION[icon.catalogue[0] ?? '']);
    expect(name).toBe(slug(icon.name));
  });

  it.each(tier2)('%s: one pixel, lit, sized and placed by the rules', (name, icon) => {
    const { x, y, size } = icon.pixel;
    expect(icon.pixelIs.length).toBeGreaterThan(0);
    expect(size).toBeGreaterThanOrEqual(2.6); // §4.1
    expect(size).toBeLessThanOrEqual(3.4);
    expect([x, y].filter((n) => !onGrid(n))).toEqual([]);
    // Inside the live area: nothing crosses the 2-unit padding except the glow (§3)
    expect(Math.min(x, y)).toBeGreaterThanOrEqual(2);
    expect(Math.max(x + size, y + size)).toBeLessThanOrEqual(22);
    const html = render({ name: name as keyof typeof TIER_2, size: 24 });
    expect(html.match(/class="dz-px"/g)).toHaveLength(1);
    expect(html).toContain(`fill="url(#dz-px-${icon.pillar})"`);
  });

  it.each(tier2)('%s: every shape on the 0.25 grid', (_, icon) => {
    expect(icon.shapes.flatMap(shapePositions).filter((n) => !onGrid(n))).toEqual([]);
  });

  it.each(tier2)(
    '%s: dots 0.7–1 in radius (§6), rectangle corners 2.25 when large, 1.25 when small (§3)',
    (_, icon) => {
      for (const shape of icon.shapes) {
        if (shape.kind === 'dot') {
          expect(shape.r).toBeGreaterThanOrEqual(0.7);
          expect(shape.r).toBeLessThanOrEqual(1);
        }
        if (shape.kind === 'rect') expect(shape.rx).toBe(Math.min(shape.width, shape.height) >= 12 ? 2.25 : 1.25);
      }
    },
  );

  it.each(tier2)('%s: within the 1 KB budget, decorative, named dz-2-{pillar}-*', (name, icon) => {
    const html = render({ name: name as keyof typeof TIER_2, size: 24 });
    expect(new TextEncoder().encode(html).length).toBeLessThanOrEqual(BUDGET.tier2);
    expect(html).toContain(`data-icon="dz-2-${icon.pillar}-${name}"`);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).toContain(`dz-icon--${icon.motion}`);
    expect(html.includes('dz-icon--flip')).toBe(icon.flip);
  });
});

describe('IconDefs', () => {
  const defs = renderToStaticMarkup(createElement(IconDefs));
  const ids = [...defs.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);

  it('defines every id once: the pillar gradients and glows, the sprite and the knockouts', () => {
    expect(new Set(ids).size).toBe(ids.length);
    for (const pillar of PILLARS) expect(ids).toEqual(expect.arrayContaining([`dz-px-${pillar}`, `dz-halo-${pillar}`]));
    for (const [name] of tier1) expect(ids).toContain(`dz-1-${name}`);
    const knockouts = [...tier2, ...Object.entries(TIER_3)]
      .filter(([, icon]) => 'knockout' in icon)
      .map(([name]) => `dz-ko-${name}`);
    expect(ids.filter((id) => id?.startsWith('dz-ko-'))).toEqual(knockouts);
    // One clip per Tier 3 icon, for its sweep (P2 plan, K1)
    expect(ids.filter((id) => id?.startsWith('dz-clip-'))).toEqual(
      Object.keys(TIER_3).map((name) => `dz-clip-${name}`),
    );
  });

  it('takes every colour from tokens through classes: no colour values or style attributes in the SVG', () => {
    expect(defs).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(/i);
    expect(defs).not.toContain('style=');
    expect(defs).toContain('<linearGradient id="dz-px-ai" class="dz-grad--ai"');
    expect(defs).toContain('<stop offset="0" class="dz-stop--top"></stop>');
    const css = readFileSync('src/styles/icons.css', 'utf8');
    for (const pillar of PILLARS) expect(css).toContain(`--dz-grad-top: var(--dz-pixel-${pillar}-top);`);
  });

  it('is hidden without display: none, which would stop the gradients painting', () => {
    expect(defs).toMatch(/^<svg class="dz-icon-defs" aria-hidden="true" focusable="false">/);
    expect(defs).not.toContain('display');
  });
});

// Every absolute end point of a path, and the y of each horizontal and the x of each vertical segment,
// so a drawing can be checked against the live area and the line-centre rule (§3).
function walkPath(d: string) {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
  const arity: Record<string, number> = { m: 2, l: 2, t: 2, h: 1, v: 1, c: 6, s: 4, q: 4, a: 7 };
  const walk = { points: [] as [number, number][], horizontal: [] as number[], vertical: [] as number[] };
  let [x, y, startX, startY] = [0, 0, 0, 0];
  let command = '';
  for (let i = 0; i < tokens.length;) {
    const token = tokens[i] ?? '';
    if (/[a-zA-Z]/.test(token)) {
      command = token;
      i++;
      if (command.toLowerCase() === 'z') [x, y] = [startX, startY];
      continue;
    }
    const lower = command.toLowerCase();
    const count = arity[lower];
    if (count === undefined) throw new Error(`unknown path command in "${d}"`);
    const args = tokens.slice(i, i + count).map(Number);
    i += count;
    const [ox, oy] = command === lower ? [x, y] : [0, 0];
    if (lower === 'h') {
      walk.horizontal.push(y);
      x = ox + (args[0] ?? 0);
    } else if (lower === 'v') {
      walk.vertical.push(x);
      y = oy + (args[0] ?? 0);
    } else {
      const [nx, ny] = [ox + (args.at(-2) ?? 0), oy + (args.at(-1) ?? 0)];
      if (lower === 'l' && ny === y) walk.horizontal.push(y);
      if (lower === 'l' && nx === x) walk.vertical.push(x);
      [x, y] = [nx, ny];
      // After a moveto, further pairs are linetos.
      if (lower === 'm') [startX, startY, command] = [x, y, command === 'm' ? 'l' : 'L'];
    }
    walk.points.push([x, y]);
  }
  return walk;
}

// The 11 icons ported from the approved prototype in P1 keep their line centres as drawn (C39).
const P1_TIER_1 = ['arrow', 'send', 'check', 'menu', 'close', 'globe'];

describe('Tier 1 icons drawn from P2 on', () => {
  const fresh = tier1.filter(([name]) => !P1_TIER_1.includes(name));

  it("are the chevron and the external link (P2), and Home's four step and four industry icons (P5)", () => {
    expect(fresh.map(([name]) => name)).toEqual([
      'chevron',
      'external-link',
      'audit',
      'build',
      'launch',
      'improve',
      'industry-b2b',
      'industry-commerce',
      'industry-property',
      'industry-services',
    ]);
  });

  it.each(fresh)('%s: horizontal and vertical line centres on .25 or .75, inside the live area (§3)', (_, icon) => {
    const { points, horizontal, vertical } = walkPath(icon.d);
    const fraction = (n: number) => ((n % 1) + 1) % 1;
    expect([...horizontal, ...vertical].filter((n) => ![0.25, 0.75].includes(fraction(n)))).toEqual([]);
    expect(points.flat().filter((n) => n < 2 || n > 22)).toEqual([]);
  });
});

// The rules' own §4.3 tables, read from the file, so the cluster can't drift from them. The tables
// sit inside a list item, so their rows are indented.
const RULES = readFileSync('Planning Folder/For Ai/DeepZeta Icon Master Rules.md', 'utf8');
const TOKENS = readFileSync('src/styles/tokens.css', 'utf8');
const LOGO_PIXEL = { main: 2, upper: 3, lower: 4, bottom: 1 } as const;
// "S", "0", "0.7206 S", "+1.1741 S", "−0.7206 S" (a minus sign, U+2212), in units of S
const inS = (cell: string) => {
  const text = cell.replace('−', '-').replace('+', '').trim();
  return text === 'S' ? 1 : Number(text.replace(/\s*S$/, ''));
};
const SIZE_ROW = /^ *\| [\w-]+ \(logo pixel (\d)\) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([\d.]+)% \|$/gm;
const sizeRows = new Map(
  [...RULES.matchAll(SIZE_ROW)].map((m) => [
    Number(m[1]),
    {
      colours: m[2] ?? '',
      size: inS(m[3] ?? ''),
      dx: inS(m[4] ?? ''),
      dy: inS(m[5] ?? ''),
      // "11.8%" as a share, without the float tail of 11.8 / 100
      radius: Number((Number(m[6]) / 100).toFixed(4)),
    },
  ]),
);
const VECTOR_ROW = /^ *\| Logo pixel (\d) \| ([.\d]+) \| ([.\d]+) \| ([.\d]+) \| ([.\d]+) \|$/gm;
const vectorRows = new Map(
  [...RULES.matchAll(VECTOR_ROW)].map((m) => [
    Number(m[1]),
    { x1: Number(m[2]), y1: Number(m[3]), x2: Number(m[4]), y2: Number(m[5]) },
  ]),
);
const stopToken = (pillar: Pillar, stop: string) =>
  new RegExp(`--dz-pixel-${pillar}-${stop}: (#[0-9a-f]{6});`).exec(TOKENS)?.[1] ?? '';
// AI Front Desk is a bundle (catalogue §5), placed in the AI Automation pillar (P2 plan, K4).
const BUNDLE_PILLAR: Record<string, Pillar> = { '5.1': 'ai' };
const LIVE = { min: 4, max: 44 }; // the 48 grid's live area (§3)

function shapeExtent(shape: Shape): number[] {
  switch (shape.kind) {
    case 'path':
      return walkPath(shape.d).points.flat();
    case 'rect':
      return [shape.x, shape.y, shape.x + shape.width, shape.y + shape.height];
    case 'circle':
    case 'dot':
      return [shape.cx - shape.r, shape.cy - shape.r, shape.cx + shape.r, shape.cy + shape.r];
  }
}

describe('Tier 3 icons', () => {
  it('reproduce the logo cluster exactly: sizes, offsets, radii, gradient vectors and colours (§4.3)', () => {
    expect(sizeRows.size).toBe(4);
    expect(vectorRows.size).toBe(4);
    for (const pixel of CLUSTER) {
      const row = sizeRows.get(LOGO_PIXEL[pixel.part]);
      expect({ size: pixel.size, dx: pixel.dx, dy: pixel.dy, radius: pixel.radius }, pixel.part).toEqual({
        size: row?.size,
        dx: row?.dx,
        dy: row?.dy,
        radius: row?.radius,
      });
      expect(pixel.vector, pixel.part).toEqual(vectorRows.get(LOGO_PIXEL[pixel.part]));
      const hexes = (row?.colours.match(/#[0-9A-F]{6}/gi) ?? []).map((hex) => hex.toLowerCase());
      expect(hexes, pixel.part).toEqual(['top', 'mid', 'bottom'].map((stop) => stopToken(pixel.pillar, stop)));
    }
  });

  it('places the cluster from the main pixel: the prototype AI Front Desk numbers', () => {
    const [main, upper] = clusterBoxes(25.25, 24.25, 5.5);
    expect(main).toEqual({ part: 'main', x: 25.25, y: 24.25, size: 5.5, rx: 0.726 });
    expect(upper).toEqual({ part: 'upper', x: 31.708, y: 20.287, size: 3.963, rx: 0.424 });
  });

  it.each(tier3)('%s: the exact catalogue name, its pillar and its slug', (name, icon) => {
    const escaped = icon.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (/^\d$/.test(icon.catalogue)) {
      // A pillar head: the pillar's own section heading
      expect(CATALOGUE).toMatch(new RegExp(`^## ${icon.catalogue}\\. ${escaped}$`, 'm'));
      expect(icon.pillar).toBe(PILLAR_BY_SECTION[icon.catalogue]);
    } else {
      expect(CATALOGUE).toMatch(new RegExp(`^#{3,4} ${icon.catalogue.replace(/\./g, '\\.')} ${escaped}(?: |$)`, 'm'));
      expect(icon.pillar).toBe(BUNDLE_PILLAR[icon.catalogue]);
    }
    expect(name).toBe(slug(icon.name));
    expect(icon.pixelIs.length).toBeGreaterThan(0);
  });

  it.each(tier3)('%s: the 48 grid, the live area, the §3 radii and the §6 dots', (_, icon) => {
    const { frame } = icon;
    const shapes: Shape[] = [{ kind: 'rect', ...frame }, ...icon.lines, ...icon.parts.map((part) => part.shape)];
    expect(frame.rx).toBe(4);
    expect(shapes.flatMap(shapePositions).filter((n) => !onGrid(n))).toEqual([]);
    expect(shapes.flatMap(shapeExtent).filter((n) => n < LIVE.min || n > LIVE.max)).toEqual([]);
    for (const shape of shapes) {
      if (shape.kind === 'dot') expect(shape.r).toBe(1.1);
      if (shape.kind === 'rect') expect(shape.rx).toBe(Math.min(shape.width, shape.height) >= 20 ? 4 : 3);
    }
  });

  it.each(tier3)('%s: a main pixel of 5–6 units on the grid, the whole cluster inside the live area', (_, icon) => {
    const { x, y, size } = icon.cluster;
    expect([x, y].filter((n) => !onGrid(n))).toEqual([]);
    expect(size).toBeGreaterThanOrEqual(5); // §4.1
    expect(size).toBeLessThanOrEqual(6);
    for (const box of clusterBoxes(x, y, size)) {
      expect(Math.min(box.x, box.y), box.part).toBeGreaterThanOrEqual(LIVE.min);
      expect(Math.max(box.x + box.size, box.y + box.size), box.part).toBeLessThanOrEqual(LIVE.max);
    }
  });

  it.each(tier3)('%s: within the 4 KB budget, decorative, named dz-3-{pillar}-*, never mirrored', (name, icon) => {
    const html = render({ name: name as keyof typeof TIER_3, size: 160 });
    expect(new TextEncoder().encode(html).length).toBeLessThanOrEqual(BUDGET.tier3);
    expect(html).toContain(`data-icon="dz-3-${icon.pillar}-${name}"`);
    expect(html).toContain('viewBox="0 0 48 48"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    // The shared observer plays the story once on scroll-in (13 §3.4)
    expect(html).toContain('data-fx-once=""');
    expect(html.match(/class="dz-cluster-px[ "]/g)).toHaveLength(4);
    expect(html.match(/class="dz-halo[ "]/g)).toHaveLength(1);
    expect(html).toContain(`fill="url(#dz-px-${icon.pillar})"`);
    // The owner, 2026-10-01: no signature icon mirrors in Arabic.
    expect(icon.flip).toBe(false);
    expect(html).not.toContain('dz-icon--flip');
  });

  it('keeps every story part inside the signature cap, and gives each its replay twin (§2, §7.1)', () => {
    const css = readFileSync('src/styles/icons.css', 'utf8');
    const cap = Number(/--dz-dur-story-signature: (\d+)ms;/.exec(TOKENS)?.[1]);
    expect(cap).toBeLessThanOrEqual(1600);
    const roles = [...css.matchAll(/\.dz-t3-[\w-]+ \{([^}]*--dz-t3-name:[^}]*)\}/g)].map(([, body = '']) => {
      const value = (key: string) => new RegExp(`--dz-t3-${key}: ([\\w.-]+);`).exec(body)?.[1] ?? '';
      return {
        name: value('name'),
        again: value('again'),
        at: Number(value('at')),
        for: Number(value('for')),
        gap: Number(value('gap') || 0),
      };
    });
    expect(roles.length).toBeGreaterThanOrEqual(8);
    for (const role of roles) {
      // The last stagger step is 3 (the registry's type)
      expect(role.at + 3 * role.gap + role.for, role.name).toBeLessThanOrEqual(1);
      for (const keyframes of [role.name, role.again]) expect(css, keyframes).toContain(`@keyframes ${keyframes} {`);
    }
  });
});

describe('IconDefs for Tier 3', () => {
  const defs = renderToStaticMarkup(createElement(IconDefs));

  it('defines the cluster gradients on the logo vectors, in each pixel pillar colour', () => {
    for (const { part, pillar, vector } of CLUSTER) {
      expect(defs).toContain(
        `<linearGradient id="dz-cl-${part}" class="dz-grad--${pillar}" x1="${vector.x1}" y1="${vector.y1}" x2="${vector.x2}" y2="${vector.y2}">`,
      );
    }
    expect(defs).toContain('<linearGradient id="dz-sweep"');
  });

  it('cuts at least 1.5 around each cluster pixel, and enough that neighbouring cut-outs meet', () => {
    expect(CLEARANCE.tier3).toBeGreaterThanOrEqual(1.5);
    // The widest gap between two cluster pixels is 0.5911 S, at most 6 units of S (§4.1)
    expect(2 * CLEARANCE.tier3).toBeGreaterThanOrEqual(0.5911 * 6);
    for (const [name, icon] of tier3) {
      if (!('knockout' in icon)) continue;
      const mask = defs.match(new RegExp(`<mask id="dz-ko-${name}"[\\s\\S]*?</mask>`))?.[0] ?? '';
      const { x, y, size } = icon.cluster;
      const cut = CLEARANCE.tier3;
      for (const box of clusterBoxes(x, y, size)) {
        expect(mask, `${name} ${box.part}`).toContain(
          `<rect x="${box.x - cut}" y="${box.y - cut}" width="${box.size + 2 * cut}" height="${box.size + 2 * cut}" fill="black">`,
        );
      }
    }
  });
});
