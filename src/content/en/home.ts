// The real Home copy (P5, docs/design/home.md; engine §3.1 Home order). Sources: the Services
// Catalogue (names and promises, exactly), the blueprint's positioning, docs/facts/company-facts.md.
// No invented numbers, clients, results or timeframes (10 §3; facts §5, §6). The metadata title
// stays the P0 one (51 chars, the gate's 50–60); the description is the new one (156 chars).
// The story scripts (story-chat, story-flow, before-after) are typed data rendered by the
// sections; conversations and flows that aren't real carry the "Example" label (10 §3.6).
import { siteConfig } from '@/lib/site-config';

// The hero's direct answer (engine §2: the hero-answer module; 08 §2.3 quotable first sentence)
export const heroAnswer = {
  // H1 ≤ 70 characters (engine §2 hero-answer); the statement, the page's LCP element (13 §3 rule 2)
  heading: 'AI automation and custom-coded websites for UAE businesses',
  // The direct answer, 40–60 words, naming Deepzeta AI, what we build and where (engine §3.1)
  answer: `${siteConfig.brandName} builds online growth for every business: custom-coded, high-performance websites with SEO and AI search visibility built in, and AI automation systems that answer customers, follow up leads and run daily operations. Based in Dubai, serving the UAE first, then the GCC.`,
  // The secondary CTA beside the primary (home.md §01; the primary is the shell's audit CTA)
  tryAgent: 'Try our AI agent',
  // The proof card's eyebrow and label (home.md §01: story-chat in a glass-liquid proof card)
  proofEyebrow: 'Example conversation',
  proofHeading: 'A customer writes. The system answers.',
} as const;

// §02 The proof strip (home.md): platform names as plain text, catalogue §8; no client logos or
// partner badges (they appear only once confirmed, facts §5)
export const proofStrip = {
  heading: 'The platforms we build on',
  // One row of category labels + platform names, plain text (catalogue §8, byte for byte)
  categories: [
    { label: 'Automation', platforms: ['n8n', 'Make', 'Zapier'] },
    { label: 'AI models', platforms: ['OpenAI', 'Anthropic', 'Google Gemini', 'Jais', 'Falcon'] },
    { label: 'Messaging', platforms: ['WhatsApp Business API', 'Instagram', 'Messenger', 'SMS', 'email'] },
    { label: 'CRM', platforms: ['HubSpot', 'Zoho CRM', 'Pipedrive', 'Salesforce', 'Odoo'] },
    { label: 'Web', platforms: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'] },
  ],
} as const;

// §03 Problem → outcome (home.md; engine's before-after module): three pains in the owner's words,
// each with a 40–75-word answer. Outcomes use allowlisted design targets only (facts §6); no
// measured results (none exist yet, facts §5)
export const problemOutcome = {
  heading: 'Sound familiar?',
  // The labels over each row's two sides (BeforeAfter)
  beforeLabel: 'Today',
  afterLabel: `With ${siteConfig.brandName}`,
  lede: 'Most UAE businesses lose customers in the same three places: slow replies, manual admin and a website that cannot be found. Here is what changes when each one is automated.',
  rows: [
    {
      problem: 'Leads wait hours for a reply',
      outcome: 'Every lead gets a reply within 60 seconds',
      // 40–75 words (engine §1.1); "60 seconds" is the service design target (facts §6)
      answer:
        'A Speed-to-Lead System replies to every new lead within 60 seconds, on WhatsApp, the website or by phone, in Arabic and English. It qualifies the enquiry, books the meeting and hands over to your team only when a person is genuinely needed. The reply target is a design target we build to, not a measured result.',
    },
    {
      problem: 'Quotes, invoices and follow-ups by hand',
      outcome: 'Quotes go out on time, every time',
      answer:
        'Automated quotation, invoicing and follow-up sequences send the quote, chase it, book the next step and update your CRM without anyone remembering to. Your team handles exceptions and relationships; the system handles repetition. Nothing is promised on numbers we have not measured — the process is the guarantee.',
    },
    {
      problem: 'A website nobody finds',
      outcome: 'Built to be found by Google and AI engines',
      answer:
        'Custom-coded websites load fast and carry SEO, GEO and structured data built in at development time, not added afterwards. Every page answers the questions your buyers actually ask, in a format Google and AI engines can read, quote and cite. This site itself is the working example.',
    },
  ],
} as const;

// §04 The four doors (home.md): the four pillars (C6), names and promises from the catalogue,
// exactly (10 §2); AI Automation and Websites lead (facts §3)
export const fourDoors = {
  heading: 'Four ways we build your growth',
  lede: 'Everything Deepzeta AI does stands on one of four pillars. Each has its own services, its own systems and one promise.',
  // One line per door, written from the catalogue's promise; the doors link to their pillar pages
  // once those ship (P6); until then they are cards (04 §1.4)
  doorsNote: 'Each pillar has its own page with every service in it.',
} as const;

// §05 The workflow explorer teaser (home.md): the section's own text; one example workflow's
// final state (the owner's choice, open question 3). The interactive tabs are the P7 demo
export const workflowExplorer = {
  heading: 'See an automation run',
  lede: 'This is one workflow, end to end: a customer asks on WhatsApp, an AI agent understands and answers, the booking lands in the calendar and the CRM updates itself. The interactive explorer with more workflows comes with the live demos.',
  // The visible step list (13 §4.8: every story has a visible HTML step list)
  steps: [
    'A customer messages on WhatsApp, any time of day.',
    'The AI agent understands the question and answers in seconds.',
    'The booking is made and confirmed in the calendar.',
    'The CRM record is updated, and the team is notified.',
  ],
  // The static story-flow's own label (10 §3.6: an example flow carries the label)
  flowLabel: 'Example workflow',
  // The flow's nodes, one or two words each (StoryFlow; the last is the outcome)
  nodes: ['Message', 'AI agent', 'Calendar', 'CRM'],
} as const;

// §06 Proof: "Watch this page build itself" (home.md; C19: until real case-study figures exist)
export const buildItself = {
  heading: 'Watch this page build itself',
  lede: 'A website should prove what it claims. This page is custom-coded, fast and readable by AI engines — and instead of a marketing claim, it shows its own real measurements, live, from this visit.',
  // The pinned scene's steps (13 §5: grid → wireframe → type → glass → content → schema tags → stamp)
  steps: [
    'The grid and the page skeleton arrive first.',
    'Type and layout settle into place.',
    'Glass surfaces and the pixel accents land.',
    'The content layer becomes readable text.',
    'The schema tags tell machines what it all means.',
    'The stamp shows this visit\u2019s real LCP.',
  ],
  // The stamp's label; the value itself is this visit's real measurement (lazy, P5)
  stampLabel: 'This visit\u2019s LCP',
} as const;

// §06 (below the pinned scene) — the illustrative proof examples (C18, 10 §3.6). No real client
// exists yet, so these are labelled concepts, not case studies: fictional business names, and
// outcomes written in words only. No invented numbers (check:facts fails on unlisted figures); the
// one figure that may appear is the allowlisted "60 seconds" Speed-to-Lead design target (facts §6).
export const illustrativeProof = {
  // The block's heading (an H3, so the section's H2 order in home.spec.ts is untouched) and label
  heading: 'The kind of system we build',
  // The honesty label carried on every concept card (C18; 10 §3.6: "Concept by Deepzeta AI · fictional business")
  conceptLabel: 'Concept by Deepzeta AI \u00b7 fictional business',
  // The native <details> trigger and the hide label (visible by default for the first card; one
  // disclosure per card, no JavaScript)
  show: 'Show the example',
  hide: 'Hide the example',
  cards: [
    {
      name: 'Luma Properties',
      industry: 'Real estate \u00b7 Dubai',
      // No invented numbers: the outcome is a process promise, not a result claim.
      outcome:
        'Every enquiry is answered in under a minute, then qualified, booked and followed up automatically \u2014 while the agent handles the routine and the team handles the sale.',
      detail:
        'A Speed-to-Lead System replies to a WhatsApp or website enquiry the moment it arrives, in Arabic and English, asks the qualifying questions and drops the meeting straight into the calendar. No lead waits for office hours.',
    },
    {
      name: 'Nova Health Clinic',
      industry: 'Healthcare \u00b7 Dubai',
      outcome:
        'Appointments, reminders and follow-ups run themselves, so the front desk spends its time on patients instead of chasing confirmations.',
      detail:
        'The booking flow confirms the slot, sends reminders before the visit and follows up after it, with every step recorded in the CRM. A person steps in only when a patient genuinely needs one.',
    },
    {
      name: 'Atlas Interiors',
      industry: 'Fit-out & interiors \u00b7 Dubai',
      outcome:
        'A fast, custom-coded website that Google and AI engines can read, quote and cite \u2014 built to be found, not just to look good.',
      detail:
        'The site carries structured data, SEO and AI-search visibility built in at development time, and answers the questions buyers actually ask. This very page is the working example of the same build.',
    },
  ],
} as const;

// §07 How we work (home.md): Audit → Build → Launch → Improve. No timeframes — none confirmed
export const howWeWork = {
  heading: 'How we work',
  lede: 'Four steps, whether we are building a website, a automation system or both. It starts with a free audit and it never ends in a handover you did not agree to.',
  steps: [
    { title: 'Audit', text: 'We map your sales, operations and admin, and show which automations pay back first.' },
    { title: 'Build', text: 'We design and custom-code the system around how your business actually works.' },
    { title: 'Launch', text: 'We ship it, connect your platforms and train your team on it.' },
    { title: 'Improve', text: 'We watch the numbers and keep making it better after launch.' },
  ],
} as const;

// §08 The ROI calculator teaser (home.md): the formula shown, no money figures (the visitor's own
// inputs arrive with the P7 calculator; 10 §3.6)
export const roiTeaser = {
  heading: 'What is manual work really costing you?',
  lede: 'The calculator uses your own numbers, and shows its formula: hours saved each week, multiplied by the cost of that hour, projected over a year. No assumptions, no invented benchmarks.',
  formulaLabel: 'The formula',
  formula:
    'Hours saved each week \u00d7 cost of that hour \u00d7 the weeks in a year = the yearly value of automating one task',
  cta: 'Open the ROI calculator',
} as const;

// §09 Industries (home.md): the four catalogue industry groups (R101–R104), names exactly
export const industries = {
  heading: 'Built for your industry',
  lede: 'Deepzeta AI serves every industry, with ready-made automations for four broad groups. Each group has its own page with the best-fit automations for the businesses in it.',
} as const;

// §10 FAQ (home.md, faq.md, engine §6): the section wrapper; the questions live in faq-bank.ts
export const faqSection = {
  heading: 'Questions, answered',
  lede: 'The questions UAE business owners ask before automating — answered directly. Can\u2019t find yours? Ask us.',
} as const;

// §11 The final CTA (home.md): the audit offer beside the 60-second test stub; the footer's
// Landing (finaleHeading, finaleLine) already follows in the shell
export const finalCta = {
  heading: 'Start with a free AI automation audit',
  lede: 'In one session we map your sales, operations and admin, and show which automations pay back first. No obligation, no jargon.',
  // The speed-to-lead test stub (demo 4; the real test is P7). "60 seconds" is the facts §6
  // service design target, phrased exactly as the allowlist entry has it.
  testTitle: 'The speed-to-lead test',
  testLine: 'Send us a message as a customer would. Our speed-to-lead target: a reply within 60 seconds.',
  testCta: 'Take the speed-to-lead test',
} as const;

// Home's metadata (08 §1; the gate: title 50–60 chars, description 140–160)
export const homeContent = {
  title: 'AI Automation and Custom Websites in the UAE',
  description: `Deepzeta AI, a Dubai agency, builds custom-coded, high-performance websites with SEO and AI search visibility built in, plus AI automation for UAE businesses.`,
  heading: heroAnswer.heading,
  intro: heroAnswer.answer,
} as const;
