// The service template's shared labels (P6 part A2, S10): the words every service page shows the same
// way. Each page's own copy is in its file (speed-to-lead-system.ts); service names come from the
// catalogue, never retyped (10 §2).
import { siteConfig } from '@/lib/site-config';

export const serviceTemplate = {
  // The labels over each story-before-after row's two sides (BeforeAfter), as on Home
  beforeLabel: 'Today',
  afterLabel: `With ${siteConfig.brandName}`,
  // The visible step list's accessible name beside the example flow
  stepsLabel: 'How it works, step by step',
} as const;
