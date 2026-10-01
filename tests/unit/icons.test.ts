import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Icon, type IconProps } from '@/components/icons/Icon';
import { IconDefs } from '@/components/icons/IconDefs';
import { PILLARS, TIER_1, TIER_2, TIER_3, type Pillar, type Shape } from '@/components/icons/registry';

// The Icon Master Rules as tests (P1 plan, section E; conflict C36: the registry is the source of
// truth, so these checks stand in for the Figma master and SVGO).

const CATALOGUE = readFileSync('Planning Folder/For Ai/DeepZeta Services Catalogue.md', 'utf8');
// Catalogue section → pillar (C6): 1 AI Automation, 2 Websites, 3 Software, 4 Growth & Ranking.
const PILLAR_BY_SECTION: Record<string, Pillar> = { '1': 'ai', '2': 'web', '3': 'software', '4': 'ranking' };
const BUDGET = { tier1: 400, tier2: 1024 }; // bytes (§2)
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
