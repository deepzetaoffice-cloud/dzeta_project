import type { Tier1Name } from '@/components/icons/registry';

// The 18 UI glyphs (docs/ai/05 §6; Figma page Design system, frame 33:33): 24 × 24, a 1.8 stroke,
// drawn in-house, never an icon library (N2). They take their parent's colour. Decorative by
// default; a control that holds only a glyph names itself with aria-label.

const PATHS = {
  'arrow-up-right': ['M7 17L17 7M17 15V7H9'],
  'arrow-right': ['M5 12H19M13 18L19 12L13 6'],
  'chevron-down': ['M6 9L12 15L18 9'],
  menu: ['M4 8H20M4 16H14'],
  close: ['M6 6L18 18M18 6L6 18'],
  pause: ['M9 6V18M15 6V18'],
  play: ['M8 5.5V18.5L18.5 12L8 5.5Z'],
  whatsapp: [
    'M12 3.5C10.5 3.5 9 3.9 7.8 4.6C6.5 5.4 5.4 6.4 4.6 7.7C3.9 9 3.5 10.5 3.5 12C3.5 13.4 3.9 14.9 4.6 16.2L3.5 20.5L7.9 19.4C9 20 10.3 20.4 11.6 20.5C12.9 20.6 14.2 20.3 15.4 19.8C16.6 19.3 17.7 18.5 18.5 17.5C19.4 16.6 20 15.4 20.3 14.1C20.6 12.9 20.7 11.5 20.4 10.3C20.1 9 19.6 7.8 18.8 6.8C18 5.7 16.9 4.9 15.8 4.3C14.6 3.8 13.3 3.5 12 3.5Z',
    'M9 9C9.2 11.6 12.4 14.8 15 15',
  ],
  phone: [
    'M5.5 4.5H8.5L10 8.5L8 9.8C8.5 11.2 9.3 12.5 10.4 13.6C11.5 14.7 12.8 15.5 14.2 16L15.5 14L19.5 15.5V18.5C19.5 18.7 19.5 18.9 19.4 19.1C19.3 19.3 19.2 19.5 19 19.6C18.9 19.7 18.7 19.8 18.5 19.9C18.3 20 18.1 20 17.9 20C14.4 19.6 11.1 18 8.6 15.4C6 12.9 4.4 9.6 4 6.1C4 5.9 4 5.7 4.1 5.5C4.2 5.3 4.3 5.1 4.4 5C4.5 4.8 4.7 4.7 4.9 4.6C5.1 4.5 5.3 4.5 5.5 4.5Z',
  ],
  send: ['M4 12L20 4L14 20L11.5 13.5L4 12Z'],
  plus: ['M12 5V19M5 12H19'],
  minus: ['M5 12H19'],
  check: ['M5 12.5L9.5 17L19 7'],
  search: [
    'M11 17.5C14.6 17.5 17.5 14.6 17.5 11C17.5 7.4 14.6 4.5 11 4.5C7.4 4.5 4.5 7.4 4.5 11C4.5 14.6 7.4 17.5 11 17.5Z',
    'M16 16L20 20',
  ],
  calendar: [
    'M17.5 5.5H6.5C5.1 5.5 4 6.6 4 8V17.5C4 18.9 5.1 20 6.5 20H17.5C18.9 20 20 18.9 20 17.5V8C20 6.6 18.9 5.5 17.5 5.5Z',
    'M4 10H20M8.5 3.5V7.5M15.5 3.5V7.5',
  ],
  mail: [
    'M18 5.5H6C4.6 5.5 3.5 6.6 3.5 8V16C3.5 17.4 4.6 18.5 6 18.5H18C19.4 18.5 20.5 17.4 20.5 16V8C20.5 6.6 19.4 5.5 18 5.5Z',
    'M4.5 7.5L12 13L19.5 7.5',
  ],
  globe: [
    'M12 20.5C16.7 20.5 20.5 16.7 20.5 12C20.5 7.3 16.7 3.5 12 3.5C7.3 3.5 3.5 7.3 3.5 12C3.5 16.7 7.3 20.5 12 20.5Z',
    'M3.5 12H20.5M12 3.5C14.3 5.9 15.4 8.7 15.4 12C15.4 15.3 14.3 18.1 12 20.5C9.7 18.1 8.6 15.3 8.6 12C8.6 8.7 9.7 5.9 12 3.5Z',
  ],
  sparkle: ['M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z'],
} as const;

export type GlyphName = keyof typeof PATHS;

// The content's older interface names, each drawn by its nearest glyph (05 §6)
const FROM_CONTENT: Partial<Record<Tier1Name, GlyphName>> = {
  arrow: 'arrow-right',
  send: 'send',
  check: 'check',
  menu: 'menu',
  close: 'close',
  globe: 'globe',
  chevron: 'chevron-down',
  'external-link': 'arrow-up-right',
  lock: 'check',
  mail: 'mail',
  shield: 'check',
};

export function glyphFor(name: Tier1Name): GlyphName | undefined {
  return FROM_CONTENT[name];
}

export type GlyphProps = { name: GlyphName; className?: string };

export function Glyph({ name, className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === 'pause' ? 2.4 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['size-6 shrink-0', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
