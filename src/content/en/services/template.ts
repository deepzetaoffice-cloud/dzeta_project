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
  // The C diagram eyebrows over each section's heading (Figma 59:34: "[ 01 ] Before and after")
  eyebrows: {
    problem: 'Before and after',
    how: 'Example flow',
    deliverables: 'Deliverables',
    fit: 'Decision aid',
    faq: 'FAQ',
  },
  // The flow's caption: "Fig. 1 — {the page's figure} · example"
  figureLabel: 'Fig. 1',
  figureExample: 'example',
  goodFitLabel: 'A good fit for',
  // The try-it band's label until P7 ships the demo (10 §3.6: honest about what isn't live)
  demoLabel: 'Demo · being built',
  // The visual cue on a live "Pairs well with" card; the link itself is the service's name
  pairCue: 'Explore the service',
} as const;
