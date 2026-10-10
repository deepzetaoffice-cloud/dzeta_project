// The shapes of the services hub's and the service pages' copy (the P6 part A plan, S10; engine §3,
// 10 §5). Copy is typed data, never hard-coded in components. Service names are never retyped:
// a page names a service by its catalogue number, and the component reads the exact name from
// src/content/catalogue.ts (10 §2). FAQ questions live in src/content/en/faq-bank.ts (engine §6.1).
import type { Pillar } from '@/components/icons/registry';

/** The demos a service page can offer (07 §4): the AI agent, the workflow explorer, the ROI calculator, the speed-to-lead test, AI View */
export type ServiceDemoId = 'ai-agent' | 'workflow-explorer' | 'roi-calculator' | 'speed-to-lead' | 'ai-view';

/** One row of the problem → outcome rows (story-before-after): at most 5 */
export type BeforeAfterRow = { before: string; after: string };

/** One step of the example flow (story-flow): 3–7, each title ≤ 5 words, each text ≤ 20 words */
export type FlowStep = { title: string; text: string };

/** A service page's copy (engine §3.1's order; docs/design/service-page.md) */
export type ServicePageContent = {
  /** The catalogue number (e.g. '1B.1'): the name, pillar and slug come from the catalogue */
  catalogueNumber: string;
  /** The page title, unbranded (the layout adds " | Deepzeta AI"): at most 45 characters */
  title: string;
  /** The meta description: 140–160 characters */
  description: string;
  /** The H1, one statement headline (service-page.md): at most 60 characters */
  heading: string;
  /** The direct answer under the H1: 40–60 words, names Deepzeta AI, the outcome and who it's for */
  answer: string;
  /** "The problem it solves": a lede (≤ 40 words) and at most 5 before → after rows */
  problem: { heading: string; lede: string; rows: readonly BeforeAfterRow[] };
  /** "How it works": a lede and 3–7 steps from the catalogue's list, shown as a labelled example */
  how: { heading: string; lede: string; steps: readonly FlowStep[]; exampleLabel: string };
  /** "What you get": at most 8 deliverables, each from the catalogue */
  deliverables: { heading: string; items: readonly string[] };
  /** "Works with": platform names as text (catalogue §8 and the service's entry) */
  worksWith: { heading: string; lede: string; platforms: readonly string[] };
  /** "Is it right for you?": the catalogue's fits and a short decision aid */
  fit: {
    heading: string;
    lede: string;
    goodFit: readonly string[];
    decisionAid: readonly { question: string; answer: string }[];
  };
  /**
   * "Try it": the matching demo's stub (07 §4; the live demo comes in P7) and its lead-in. Left out
   * when no demo matches the service: the hero then shows the audit CTA alone
   */
  tryIt?: {
    heading: string;
    line: string;
    trigger: string;
    /** The demo (demo_open's demo_id) */
    demoId: ServiceDemoId;
    /** The trigger's Tier 1 icon */
    icon: 'send' | 'arrow' | 'check' | 'globe' | 'chevron';
  };
  /** "UAE specifics": Deepzeta AI's own practice; external facts only from APPROVED citation rows */
  uae: { heading: string; points: readonly string[] };
  /** "Pairs well with": other services by catalogue number, one line each */
  pairs: { heading: string; items: readonly { catalogueNumber: string; line: string }[] };
  /** The FAQ section's heading and lede (the questions are in faq-bank.ts) */
  faq: { heading: string; lede: string };
};

/**
 * The flagship Websites page's two extras (docs/design/service-page.md, "Extras for the Websites
 * service page"; the plan docs/plans/2026-10-10-flagship-websites-page.md)
 */
export type WebsitesExtras = {
  /** "Code ↔ Page" (story-before-after) beside the How-it-works steps */
  codePage: {
    /** The figure's visible label, e.g. "Code ↔ Page" */
    label: string;
    /** One sentence under it: what the two sides are (the real hero, its real source) */
    caption: string;
    /** The two sides' names */
    pageLabel: string;
    codeLabel: string;
    /** The range input's accessible name */
    sliderLabel: string;
  };
  /** The build terminal (story-terminal): §7 Proof */
  terminal: {
    heading: string;
    /** ≤ 40 words: what the run is and that it is a recording, not live */
    lede: string;
    /** The window's title bar text */
    windowTitle: string;
    /** "Recorded on {date} from commit {commit}": the template fills the two values */
    recordedLabel: string;
    controls: { play: string; pause: string; replay: string; step: string; group: string };
  };
};

/** One line of a recorded terminal run: a command, its output, a passing check, or a note */
export type TerminalLine = { kind: 'command' | 'output' | 'ok' | 'note'; text: string };

/**
 * A real, recorded run of this site's own commands (13 §4.8 story-terminal: "real commands and
 * output only"): the date and commit it was recorded from, and its lines, trimmed but never edited
 */
export type TerminalRun = { date: string; commit: string; lines: readonly TerminalLine[] };

/** The services hub's copy (/services, R010; docs/design/services-hub.md) */
export type ServicesHubContent = {
  title: string;
  description: string;
  heading: string;
  /** 40–60 words, names Deepzeta AI */
  answer: string;
  /** "Which service do you need?": problems in the owner's words → a service by catalogue number */
  chooser: {
    heading: string;
    lede: string;
    /** The table's caption (visually hidden if the heading says it) */
    caption: string;
    problemHeader: string;
    serviceHeader: string;
    rows: readonly { problem: string; catalogueNumber: string }[];
  };
  /** "Start here": the starter offers by catalogue number, one line each */
  startHere: { heading: string; lede: string; items: readonly { offerNumber: string; line: string }[] };
  /** The four pillar directories: one lede each (40–75 words); names come from the catalogue */
  pillars: { heading: string; ledes: Readonly<Record<Pillar, string>> };
  /** "Ongoing care": services by catalogue number */
  care: { heading: string; lede: string; catalogueNumbers: readonly string[] };
  /** "Solutions": the bundles (names from the catalogue) */
  solutions: { heading: string; lede: string };
  faq: { heading: string; lede: string };
};
