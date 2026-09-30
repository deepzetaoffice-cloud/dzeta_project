// The icon registry (Icon Master Rules; P1 plan, D2). Until a Figma master exists, this file is the
// source of truth (conflict C36). Every icon is data, not free-form markup, so the tests can check the
// rules: the grid, one pixel per Tier 2 icon, the pillar colour, the budgets and the clearance.
//
// The drawings come from the approved icon prototype (Planning Folder/DeepZeta Signature Icon
// Prototype.html, decision 0009). Where it broke a rule, the rule wins (C36): Tier 2 pixels snap to
// the 0.25 grid (§3), one tail line snaps from 3.8 to 3.75, and a pixel closer than 0.75 to a line
// gets a knockout (§4.2 rule 4).

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

// Tier 1: the prototype's interface icons. `flip`: they mirror in Arabic (§9).
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
        d: 'M7 4.25h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-5.5l-4.75 3.75v-3.75A3 3 0 0 1 4 13.25v-6a3 3 0 0 1 3-3z',
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
      { kind: 'rect', x: 3.75, y: 12.5, width: 3.5, height: 5.5, rx: 1.5 },
      { kind: 'rect', x: 16.75, y: 12.5, width: 3.5, height: 5.5, rx: 1.5 },
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

export type Tier1Name = keyof typeof TIER_1;
export type Tier2Name = keyof typeof TIER_2;
export type IconName = Tier1Name | Tier2Name;

export const isTier1 = (name: IconName): name is Tier1Name => Object.hasOwn(TIER_1, name);
