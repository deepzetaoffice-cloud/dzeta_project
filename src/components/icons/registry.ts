// The icon registry (Icon Master Rules; P1 plan, D2). Until a Figma master exists, this file is the
// source of truth (conflict C36). Every icon is data, not free-form markup, so the tests can check the
// rules: the grid, one pixel per Tier 2 icon, the pillar colour, the budgets and the clearance.
//
// The drawings come from the approved icon prototype (Planning Folder/DeepZeta Signature Icon
// Prototype.html, decision 0009). Where it broke a rule, the rule wins (C36): Tier 2 pixels snap to
// the 0.25 grid (§3), one tail line snaps from 3.8 to 3.75, corners take the §3 radii (2.25 on the
// chat bubble, 1.25 on the ear cups), and a pixel closer than 0.75 to a line gets a knockout (§4.2
// rule 4).

// The four pillars (C6), by their pixel token names (docs/ai/05 §2).
export type Pillar = 'ai' | 'web' | 'software' | 'ranking';
export const PILLARS: readonly Pillar[] = ['ai', 'web', 'software', 'ranking'];

// The pixel motions of the Tier 2 vocabulary (§7.3). Only `pop` has a story in icons.css so far; the
// others arrive with their first icon.
export type PixelMotion = 'pop' | 'drop' | 'stamp' | 'travel';

// Lines take currentColor and the tier's stroke (icons.css). A dot is filled; `blink` is its place in
// the story.
export type Shape =
  | { kind: 'path'; d: string; soft?: true }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'dot'; cx: number; cy: number; r: number; blink?: 'early' | 'late' };

// Tier 1 (interface): one plain line path, no pixel, no gradient. Shown through the sprite.
export type Tier1Icon = { flip: boolean; d: string };

// Tier 2 (service): lines and exactly one pixel, in its pillar's colour.
export type Tier2Icon = {
  /** The exact Services Catalogue name and number */
  name: string;
  catalogue: string;
  pillar: Pillar;
  /** "The pixel is …" (§4.2): the moment of value for the client */
  pixelIs: string;
  motion: PixelMotion;
  flip: boolean;
  shapes: readonly Shape[];
  /** An upright square, radius 12.5% of its size (§4.1) */
  pixel: { x: number; y: number; size: number };
  /** Lines within 0.75 of the pixel are cut away (§4.2 rule 4); see IconDefs */
  knockout?: true;
};

// Tier 3 (signature): the 48 grid, stroke 1.75 (§3, §6). A main shape carries the depth, glass and
// sweep layers (§5.3); lines are drawn on the glass; parts in front of them play in during the story;
// and the logo's four-pixel cluster lands with its main pixel on the moment of value (§4.3).
export type Tier3Motion = 'pop' | 'grow' | 'wave';

export type Tier3Part = {
  shape: Shape;
  motion: Tier3Motion;
  /** Its place in the stagger: parts with the same motion start one step apart */
  step?: 0 | 1 | 2 | 3;
  /** Filled with the surface colour, so the lines behind it are hidden (§5.3) */
  occlude?: true;
};

export type Tier3Icon = {
  /** The exact Services Catalogue name and number; a pillar head uses its pillar's section */
  name: string;
  catalogue: string;
  /** The depth layer's colour. The cluster always keeps the logo's four colours (§4.3). */
  pillar: Pillar;
  /** "The pixel is …" (§4.2): what the cluster's main pixel marks */
  pixelIs: string;
  flip: boolean;
  /** The main shape: the depth layer, the glass and the sweep's clip follow it (§5.3) */
  frame: { x: number; y: number; width: number; height: number; rx: number };
  lines: readonly Shape[];
  parts: readonly Tier3Part[];
  /** The main pixel's top-left corner and its size S, 5–6 units (§4.1); the rest follow §4.3 */
  cluster: { x: number; y: number; size: number };
  /** Lines within 1.5 of a cluster pixel are cut away (§4.2 rule 4, on the 48 grid); see IconDefs */
  knockout?: true;
};

// Tier 1: the prototype's interface icons, then the ones drawn for P2. `flip`: they mirror in Arabic
// (§9). Icons drawn from P2 on keep horizontal and vertical line centres on .25 or .75 (§3; C39).
export const TIER_1 = {
  arrow: { flip: true, d: 'M5 12h14M13 6l6 6-6 6' },
  send: { flip: true, d: 'M4 12h9M4 5l16 7-16 7 3-7' },
  check: { flip: false, d: 'M5 12.5l4.5 4.5L19 7.5' },
  menu: { flip: false, d: 'M4 7h16M4 12h16M4 17h16' },
  close: { flip: false, d: 'M6 6l12 12M18 6L6 18' },
  globe: {
    flip: false,
    d: 'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 1 1 0-17zM3.5 12h17M12 3.5c2.4 2.3 3.5 5.2 3.5 8.5s-1.1 6.2-3.5 8.5M12 3.5C9.6 5.8 8.5 8.7 8.5 12s1.1 6.2 3.5 8.5',
  },
  // A disclosure's "opens below" (the mega menu's button). Points down, so it never mirrors.
  chevron: { flip: false, d: 'M6.75 9.25l5.25 5.25 5.25-5.25' },
  // "Opens in a new tab" (the social links). The arrow points to the inline-end, so it mirrors.
  'external-link': {
    flip: true,
    d: 'M14.25 3.75h6v6M20.25 3.75l-8.5 8.5M17.75 13.25v4.75a2.25 2.25 0 0 1-2.25 2.25h-9.5a2.25 2.25 0 0 1-2.25-2.25v-9a2.25 2.25 0 0 1 2.25-2.25h5',
  },
  // The four process steps of "How we work" (P5, home.md §07). Plain line icons, no pixel: the
  // pixel stays reserved for services (the owner's choice, open question 1). Drawn from P2 on, so
  // line centres sit on .25/.75 (§3, C39). None mirrors: each draws a process, not a direction.
  // Audit: a page under a magnifier — the findings come first.
  audit: { flip: false, d: 'M10.75 3.75h-7v16h13.5v-7M10.75 10.75h9.5M17.25 14.75l3-3' },
  // Build: a code bracket pair, the hand-written-code motif of the Websites pillar icon.
  build: { flip: false, d: 'M8.75 7.75l-4.5 4.5 4.5 4.5M15.25 7.75l4.5 4.5-4.5 4.5' },
  // Launch: an arrow leaving a pad — the system goes live.
  launch: { flip: false, d: 'M3.75 8.75v11.5h11.5M20.25 3.75L9.25 14.75M20.25 3.75h-6.5M20.25 3.75v6.5' },
  // Improve: a gauge climbing — the numbers keep moving after launch.
  improve: { flip: false, d: 'M4.25 17.75a8.5 8.5 0 1 1 15.5 0M12 12.25l4.25-4.25' },
  // The four industry groups (P5, home.md §09; Icon Master Rules §14.2: plain Tier 1 for
  // industries, so they don't compete with service icons). None mirrors.
  // B2B, Corporate & Tech: an org chart — teams and reporting lines.
  'industry-b2b': {
    flip: false,
    d: 'M12 3.75v4M7.75 11.75v-2h8.5v2M9.25 11.75v-1h5.5v1M6.75 15.75h4v4h-4zM13.25 15.75h4v4h-4zM8.75 11.75v4M15.25 11.75v4M12 7.75v4',
  },
  // E-Commerce & Consumer Brands: a basket.
  'industry-commerce': {
    flip: false,
    d: 'M3.75 8.75h16.5l-1.75 8.5h-13zM8.75 8.75l2.75-5M15.25 8.75l-2.75-5M9.75 12.75v2M14.25 12.75v2',
  },
  // Real Estate, Construction & Professional: a skyline of two buildings.
  'industry-property': {
    flip: false,
    d: 'M3.75 20.25h16.5M5.75 20.25V8.75h6.5v11.5M12.25 12.75h6v7.5M8.25 11.75h1.5M8.25 14.75h1.5M15.25 15.75h1M15.25 17.75h1',
  },
  // Local, Medical & Field Services: a first-aid-style cross in a rounded square — care on call.
  'industry-services': {
    flip: false,
    d: 'M4.25 6.75a2.5 2.5 0 0 1 2.5-2.5h10.5a2.5 2.5 0 0 1 2.5 2.5v10.5a2.5 2.5 0 0 1-2.5 2.5h-10.5a2.5 2.5 0 0 1-2.5-2.5zM12 8.75v6.5M8.75 12h6.5',
  },
} as const satisfies Record<string, Tier1Icon>;

// Tier 2: the prototype's service icons. All five are catalogue §1, the AI Automation pillar.
export const TIER_2 = {
  'whatsapp-ai-agent': {
    name: 'WhatsApp AI Agent',
    catalogue: '1A.1',
    pillar: 'ai',
    pixelIs: 'the instant reply',
    motion: 'pop',
    flip: true, // a chat bubble's tail mirrors (§9)
    shapes: [
      {
        kind: 'path',
        d: 'M6.25 4.25h11.5a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-6.25l-4.75 3.75v-3.75h-.5a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25z',
      },
      { kind: 'dot', cx: 8.5, cy: 10.25, r: 1, blink: 'early' },
      { kind: 'dot', cx: 11.5, cy: 10.25, r: 1, blink: 'late' },
    ],
    pixel: { x: 13.75, y: 9, size: 2.6 },
  },
  'ai-voice-receptionist': {
    name: 'AI Voice Receptionist',
    catalogue: '1A.2',
    pillar: 'ai',
    pixelIs: 'the voice answering the call',
    motion: 'pop',
    flip: false,
    shapes: [
      { kind: 'path', d: 'M5 13v-1a7 7 0 0 1 14 0v1' },
      { kind: 'rect', x: 3.75, y: 12.5, width: 3.5, height: 5.5, rx: 1.25 },
      { kind: 'rect', x: 16.75, y: 12.5, width: 3.5, height: 5.5, rx: 1.25 },
      { kind: 'path', d: 'M18.5 18v.25a2.75 2.75 0 0 1-2.75 2.75H14.5' },
    ],
    pixel: { x: 11, y: 19.25, size: 2.6 },
    knockout: true, // 0.15 from the cord's end, measured
  },
  'booking-automation-system': {
    name: 'Booking Automation System',
    catalogue: '1C.1',
    pillar: 'ai',
    pixelIs: 'the booked slot',
    motion: 'pop',
    flip: false, // a calendar never flips (§9)
    shapes: [
      { kind: 'rect', x: 3.75, y: 5, width: 16.5, height: 15.25, rx: 2.25 },
      { kind: 'path', d: 'M3.75 9.5h16.5M8.5 3v3.5M15.5 3v3.5' },
      { kind: 'dot', cx: 8, cy: 13.5, r: 0.9 },
      { kind: 'dot', cx: 12, cy: 13.5, r: 0.9 },
      { kind: 'dot', cx: 8, cy: 17, r: 0.9 },
      { kind: 'dot', cx: 12, cy: 17, r: 0.9 },
    ],
    pixel: { x: 14.75, y: 12.25, size: 2.6 },
  },
  'speed-to-lead-system': {
    name: 'Speed-to-Lead System',
    catalogue: '1B.1',
    pillar: 'ai',
    pixelIs: 'the moment the reply goes out',
    motion: 'pop',
    flip: false, // a stopwatch never flips: time runs clockwise everywhere (§9)
    shapes: [
      { kind: 'circle', cx: 12, cy: 13.5, r: 7 },
      { kind: 'path', d: 'M10 3.25h4M12 3.25v3.25M12 13.5l2-2' },
    ],
    pixel: { x: 14.5, y: 9, size: 2.6 },
    knockout: true, // overlaps the dial by 0.55, measured
  },
  'crm-setup-automation': {
    name: 'CRM Setup & Automation',
    catalogue: '1B.6',
    pillar: 'ai',
    pixelIs: "the lead's updated status",
    motion: 'pop',
    flip: true, // text-line placeholders mirror (§9)
    shapes: [
      { kind: 'rect', x: 3.75, y: 6.5, width: 16.5, height: 12, rx: 2.25 },
      { kind: 'path', d: 'M6.5 3.75h11', soft: true },
      { kind: 'circle', cx: 8.5, cy: 11, r: 1.75 },
      { kind: 'path', d: 'M5.75 15.75a2.75 2.75 0 0 1 5.5 0M13.5 10.5h3.5M13.5 13.5h1.5' },
    ],
    pixel: { x: 16.5, y: 12.25, size: 2.6 },
    knockout: true, // 0.40 from the card's edge, measured
  },
} as const satisfies Record<string, Tier2Icon>;

// Tier 3: AI Front Desk from the approved prototype (§8.3), and the four pillar heads, drawn for P2.
// None mirrors in Arabic: the cluster never mirrors (§9), and its main pixel must stay on the moment
// of value. The prototype's AI Front Desk moves from the dropped "Win" stage colour to its pillar (C6),
// and its bubble moves up 1.5 units so the tail stays inside the live area (§3; C36).
export const TIER_3 = {
  'ai-front-desk': {
    name: 'AI Front Desk',
    catalogue: '5.1',
    pillar: 'ai',
    pixelIs: 'the booking landing in the calendar',
    flip: false, // a calendar never flips (§9)
    frame: { x: 8, y: 14, width: 26, height: 26, rx: 4 },
    lines: [{ kind: 'path', d: 'M8 21h26M15 11v5M27 11v5' }],
    parts: [
      { shape: { kind: 'dot', cx: 14, cy: 27, r: 1.1 }, motion: 'pop', step: 0 },
      { shape: { kind: 'dot', cx: 21, cy: 27, r: 1.1 }, motion: 'pop', step: 1 },
      { shape: { kind: 'dot', cx: 21, cy: 34, r: 1.1 }, motion: 'pop', step: 2 },
      // The call that became the booking: a speech bubble with a voice in it
      {
        shape: {
          kind: 'path',
          d: 'M7 30.5h9a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4.5L8 44v-3.5H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z',
        },
        motion: 'grow',
        occlude: true,
      },
      { shape: { kind: 'path', d: 'M8.5 34.5v2' }, motion: 'wave', step: 0 },
      { shape: { kind: 'path', d: 'M11 33.5v4' }, motion: 'wave', step: 1 },
      { shape: { kind: 'path', d: 'M13.5 34v3' }, motion: 'wave', step: 2 },
      { shape: { kind: 'path', d: 'M16 34.75v1.5' }, motion: 'wave', step: 3 },
    ],
    // The main pixel sits on the booked slot, (28, 27)
    cluster: { x: 25.25, y: 24.25, size: 5.5 },
    knockout: true, // the upper pixel crosses the header rule and the frame, as the logo's pixels break away
  },
  'ai-automation': {
    name: 'AI Automation',
    catalogue: '1',
    pillar: 'ai',
    pixelIs: 'the job finished without anyone touching it',
    flip: false,
    frame: { x: 8, y: 9, width: 28, height: 30, rx: 4 },
    // The request's path: down from the message to the step, then on to done
    lines: [{ kind: 'path', d: 'M14 25.75v2.5M16.25 30.5h5.75' }],
    parts: [
      // The request: a customer's message
      {
        shape: {
          kind: 'path',
          d: 'M14 14h8a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-5l-3 2.5V22a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3z',
        },
        motion: 'pop',
        step: 0,
        occlude: true,
      },
      // The step it passes through on its own
      { shape: { kind: 'circle', cx: 14, cy: 30.5, r: 2.25 }, motion: 'pop', step: 1 },
    ],
    cluster: { x: 24.5, y: 27.75, size: 5.5 },
    knockout: true,
  },
  websites: {
    name: 'Websites',
    catalogue: '2',
    pillar: 'web',
    pixelIs: 'the finished page, the result of hand-written code',
    flip: false,
    frame: { x: 6, y: 10, width: 32, height: 26, rx: 4 },
    lines: [{ kind: 'path', d: 'M6 16.25h32' }],
    parts: [
      { shape: { kind: 'dot', cx: 10.25, cy: 13.25, r: 1.1 }, motion: 'pop', step: 0 },
      { shape: { kind: 'dot', cx: 13.75, cy: 13.25, r: 1.1 }, motion: 'pop', step: 1 },
      { shape: { kind: 'dot', cx: 17.25, cy: 13.25, r: 1.1 }, motion: 'pop', step: 2 },
      // Hand-written code: </>
      { shape: { kind: 'path', d: 'M14.5 21.5l-4 4 4 4M21 20.5l-3 10M24.5 21.5l4 4-4 4' }, motion: 'pop', step: 3 },
    ],
    cluster: { x: 31, y: 23, size: 5.5 },
    knockout: true,
  },
  software: {
    name: 'Software',
    catalogue: '3',
    pillar: 'software',
    pixelIs: 'the module that fits how the team works',
    flip: false,
    frame: { x: 7, y: 9, width: 30, height: 30, rx: 4 },
    lines: [],
    parts: [
      { shape: { kind: 'rect', x: 11, y: 13, width: 10, height: 7, rx: 3 }, motion: 'pop', step: 0 },
      { shape: { kind: 'rect', x: 24, y: 13, width: 9, height: 7, rx: 3 }, motion: 'pop', step: 1 },
      { shape: { kind: 'rect', x: 11, y: 23.5, width: 10, height: 11.5, rx: 3 }, motion: 'pop', step: 2 },
    ],
    cluster: { x: 26.25, y: 27, size: 5.5 },
    knockout: true,
  },
  'growth-ranking': {
    name: 'Growth & Ranking',
    catalogue: '4',
    pillar: 'ranking',
    pixelIs: 'your business, chosen first',
    flip: false,
    frame: { x: 6, y: 12, width: 28, height: 28, rx: 4 },
    lines: [],
    parts: [
      { shape: { kind: 'path', d: 'M11 18.5h11' }, motion: 'pop', step: 0 },
      { shape: { kind: 'path', d: 'M11 27.25h13' }, motion: 'pop', step: 1 },
      { shape: { kind: 'path', d: 'M11 34.25h9' }, motion: 'pop', step: 2 },
    ],
    // The first result
    cluster: { x: 25.25, y: 15.75, size: 5.5 },
    knockout: true,
  },
} as const satisfies Record<string, Tier3Icon>;

export type Tier1Name = keyof typeof TIER_1;
export type Tier2Name = keyof typeof TIER_2;
export type Tier3Name = keyof typeof TIER_3;
export type IconName = Tier1Name | Tier2Name | Tier3Name;

export const isTier1 = (name: IconName): name is Tier1Name => Object.hasOwn(TIER_1, name);
export const isTier3 = (name: IconName): name is Tier3Name => Object.hasOwn(TIER_3, name);
