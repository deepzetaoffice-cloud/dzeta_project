// The real Home copy (P5, docs/design/home.md; engine §3.1 Home order). Sources: the Services
// Catalogue (names and promises, exactly), the blueprint's positioning, docs/facts/company-facts.md.
// No invented numbers, clients, results or timeframes (10 §3; facts §5, §6). The metadata title
// stays the P0 one (51 chars, the gate's 50–60); the description is the new one (156 chars).
// The story scripts (story-chat, story-flow, before-after) are typed data rendered by the
// sections; conversations and flows that aren't real carry the "Example" label (10 §3.6).
import { siteConfig } from '@/lib/site-config';

// The hero's direct answer (engine §2: the hero-answer module; 08 §2.3 quotable first sentence)
export const heroAnswer = {
  // H1 ≤ 70 characters (65; engine §2 hero-answer); the statement, with the hero answer the page's LCP
  // candidate (13 §3 rule 7). Figma 50:158's words (the owner, 2026-10-19; home.md's flag)
  heading: 'AI automation and custom-coded websites, built for UAE businesses',
  // The H1's visible tail (home.md §01): the rotator's phrase stands in for the lead-in, which stays
  // in the H1 for crawlers and screen readers, visually hidden. Always the end of `heading`.
  headingTail: 'built for UAE businesses',
  // The location chip over the headline (Figma 50:159)
  location: 'Based in Dubai · UAE · GCC',
  // The direct answer, 40–60 words, naming Deepzeta AI, what we build and where (engine §3.1)
  answer: `${siteConfig.brandName} builds online growth for every business: custom-coded, high-performance websites with SEO and AI search visibility built in, and AI automation systems that answer customers, follow up leads and run daily operations. Based in Dubai, serving the UAE first, then the GCC.`,
  // The secondary CTA beside the primary (home.md §01; the primary is the shell's audit CTA)
  tryAgent: 'Try our AI agent',
  // The proof card's eyebrow and label (home.md §01: story-chat in a glass-liquid proof card)
  proofEyebrow: 'Example conversation',
  proofHeading: 'A customer writes. The system answers.',
} as const;

// The hero's rotating phrase (decision 0033 §3; the owner's own six phrases, in order; Figma 50:162).
// Decorative and aria-hidden beside the stable H1; its pause button is labelled (WCAG 2.2.2).
export const heroRotator = {
  phrases: [
    'Business-centric',
    'Growth formula',
    'Branding',
    'Custom-coded websites',
    'AI Automation',
    'Social media strategy',
  ],
  pause: 'Pause the rotating phrase',
  play: 'Play the rotating phrase',
  // The chip beside the counter, to How we work (§08)
  seeHow: 'See how we work',
} as const;

// The hero's AI input (Figma 50:191, KokonutUI AI-02): it opens the website agent once that ships
// (P7). Until then sending opens WhatsApp with the visitor's text, and the note says so; never a fake
// chat. The chips fill the input.
export const heroAgent = {
  label: 'Your question for our AI agent',
  placeholder: 'Ask our AI agent anything, in Arabic or English…',
  mode: 'WhatsApp mode',
  send: 'Send to our AI agent on WhatsApp',
  note: 'Our website agent is on its way. Until then, sending opens WhatsApp with your message.',
  chips: ['Automate my WhatsApp', 'Build my custom website', 'Get found by AI engines'],
} as const;

// The hero's scene, from message to booking (home.md §01; Figma 50:215; 10 §3.6: an example, so it
// says so). Times and days are separate strings, joined where they show.
export const heroScene = {
  label: 'Example conversation',
  drag: 'Drag to rotate',
  scrub: 'Scroll to run the example',
  steps: ['Message', 'Reply', 'Booked', 'CRM'],
  notification: { title: 'WhatsApp · new message', text: 'Hi, do you have anything available this week?' },
  phone: {
    business: 'Your business',
    status: 'AI agent · online',
    customer: 'Hi, do you have anything available this week?',
    agent: 'Yes — I can book you in on Tuesday at 4pm. Shall I confirm?',
    booked: 'Booked',
    input: 'Message',
  },
  booking: { day: 'Tuesday', time: '16:00' },
  calendar: {
    title: 'Calendar',
    week: 'This week',
    days: [
      { day: 'Mon', slots: ['10:00', '13:00'] },
      { day: 'Tue', slots: ['10:00', '16:00'] },
      { day: 'Wed', slots: ['11:00', '15:00'] },
    ],
    locked: 'Locked',
  },
  crm: {
    label: 'CRM · lead record',
    title: 'New lead · WhatsApp',
    status: 'Status',
    booking: 'Booking',
    next: 'Next step',
    nextValue: 'Reminder before the visit',
    notified: 'Team notified',
  },
} as const;

// §02 The proof strip (home.md): platform names as plain text, catalogue §8; no client logos or
// partner badges (they appear only once confirmed, facts §5)
export const proofStrip = {
  heading: 'The platforms we build on',
  // The marquee's pause button (WCAG 2.2.2)
  pause: 'Pause the platform names',
  play: 'Play the platform names',
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
  // The section's mono eyebrow (the C diagram language; its number comes from the page order)
  eyebrow: 'Three leaks',
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
  eyebrow: 'Four pillars',
  heading: 'Four ways we build your growth',
  lede: 'Everything Deepzeta AI does stands on one of four pillars. Each has its own services, its own systems and one promise.',
  // One line per door, written from the catalogue's promise; the doors link to their pillar pages
  // once those ship (P6); until then they are cards (04 §1.4)
  doorsNote: 'Each pillar has its own page with every service in it.',
  // Three of each pillar's lead services on its door (Figma 51:305), by registry row; the names come
  // from navigation.ts, never retyped
  services: {
    ai: ['R020', 'R027', 'R033'],
    web: ['R060', 'R061', 'R062'],
    software: ['R064', 'R065', 'R066'],
    ranking: ['R068', 'R070', 'R076'],
  },
  // Each door's photo (P01–P04), what it shows: hands, devices and places, never a face
  photoAlt: {
    ai: 'A hand holding a phone at a sunlit Dubai café table with coffee and dates',
    web: 'A laptop on a desk before a wide window over Dubai Marina',
    software: 'A gloved hand holding a rugged tablet with charts in a Jebel Ali warehouse',
    ranking: 'A boutique street lined with palms and lit shopfronts in Dubai at dusk',
  },
} as const;

// §05 How an automation works (home.md; Figma 51:408): one example workflow, end to end, its five
// steps as a visible ordered list (13 §4.8) and the diagram's nodes with their pillar chips. The real
// n8n recording (SR01) joins the scene once it's recorded; until then the scene ends on the diagram.
export const workflowExplorer = {
  eyebrow: 'Example workflow',
  heading: 'See an automation run',
  lede: 'This is one workflow, end to end: a customer asks on WhatsApp, an AI agent understands and answers, the booking lands in the calendar and the CRM updates itself.',
  // The figure's label and caption (its number is set where it shows)
  figureLabel: 'Fig.',
  figure: 'One workflow, end to end · example',
  // The steps: the list's label, its line, and the diagram node's short line and pillar
  steps: [
    {
      label: 'Lead',
      text: 'A customer messages on WhatsApp, any time of day.',
      node: 'WhatsApp message in',
      pillar: 'ai',
    },
    {
      label: 'AI reply',
      text: 'The AI agent understands the question and answers in seconds.',
      node: 'Answers in Arabic or English',
      pillar: 'ai',
    },
    {
      label: 'Booking + CRM',
      text: 'The booking is made and confirmed in the calendar; the CRM record is updated and the team is notified.',
      node: 'Calendar and CRM updated',
      pillar: 'software',
    },
    { label: 'Reminder', text: 'A reminder goes out before the visit.', node: 'Before the visit', pillar: 'web' },
    {
      label: 'Review',
      text: 'After the visit, a review request goes out at the right moment.',
      node: 'Request after the visit',
      pillar: 'ranking',
    },
  ],
  // The scrubber's accessible name; its steps are buttons that jump the scene
  scrubLabel: 'Run the example step by step',
} as const;

// §06 Proof: "Watch this page build itself" (home.md; Figma 52:411; C19: until real case-study
// figures exist). The layers show this page's own title, description, H1, step list and JSON-LD, and
// a recorded run of this site's build (build-run.ts); the stamp is this visit's real LCP, never a
// promised score (10 §3.7).
export const buildItself = {
  eyebrow: 'This page is the proof',
  heading: 'Watch this page build itself',
  lede: 'A website should prove what it claims. This page is custom-coded, fast and readable by AI engines — and instead of a marketing claim, it shows its own real measurements, live, from this visit.',
  toggle: 'How AI reads this page',
  aiView: 'AI view on: the page as an engine reads it',
  // The stamp's label and notes; the value itself is this visit's real measurement
  stampLabel: 'This visit\u2019s LCP',
  stampNote: 'measured live',
  stampPending: 'measuring',
  layers: [
    { name: 'Design', line: 'Type, colour and layout, from one design system' },
    { name: 'Code', line: 'Custom code, no page builder or template' },
    { name: 'Schema', line: 'The schema tags tell machines what it all means.' },
    { name: 'SEO', line: 'Titles, answers and links an AI engine can quote' },
  ],
  // The code layer's caption: the recording it replays (build-run.ts gives the commit and the date)
  recorded: 'A recorded run of this site\u2019s build · commit',
} as const;

// §06 (below the pinned scene) — the illustrative proof examples (C18, 10 §3.6). No real client
// exists yet, so these are labelled concepts, not case studies: fictional business names, and
// outcomes written in words only. No invented numbers (check:facts fails on unlisted figures); the
// one figure that may appear is the allowlisted "60 seconds" Speed-to-Lead design target (facts §6).
export const illustrativeProof = {
  eyebrow: 'Concepts',
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
  eyebrow: 'Audit → Build → Launch → Improve',
  heading: 'How we work',
  lede: 'Four steps, whether we are building a website, an automation system or both. It starts with a free audit and it never ends in a handover you did not agree to.',
  // The audit-session photo beside the steps (P21; hands and a process map, no faces)
  photoAlt: 'Hands drawing a process map with sticky notes beside a laptop in a Dubai office',
  photoBadge: 'Photo',
  steps: [
    { title: 'Audit', text: 'We map your sales, operations and admin, and show which automations pay back first.' },
    { title: 'Build', text: 'We design and custom-code the system around how your business actually works.' },
    { title: 'Launch', text: 'We ship it, connect your platforms and train your team on it.' },
    { title: 'Improve', text: 'We watch the numbers and keep making it better after launch.' },
  ],
} as const;

// §10 The ROI calculator (home.md; Figma 53:508): computed only from the visitor's own numbers, with
// its formula always shown (10 §3.6). The starting values are example inputs and say so; they are
// numbers in code, never a claim.
export const roiTeaser = {
  eyebrow: 'Your numbers only',
  heading: 'What is manual work really costing you?',
  lede: 'The calculator uses your own numbers, and shows its formula: hours saved each week, multiplied by the cost of that hour, projected over a year. No assumptions, no invented benchmarks.',
  inputsLabel: 'Example inputs — move the sliders to your numbers',
  hoursLabel: 'Hours spent on this task each week',
  hoursUnit: 'h',
  rateLabel: 'Cost of one hour of that work',
  currency: 'AED',
  weeksLabel: 'Weeks in a year',
  weeksUnit: 'weeks',
  resultLabel: 'Yearly value of automating this one task',
  defaults: { hours: 6, rate: 120, weeks: 52 },
  ranges: { hours: { min: 1, max: 40, step: 1 }, rate: { min: 20, max: 500, step: 10 } },
  formulaLabel: 'The formula',
  formula:
    'Hours saved each week \u00d7 cost of that hour \u00d7 the weeks in a year = the yearly value of automating one task',
  cta: 'Open the ROI calculator',
} as const;

// §09 Industries (home.md): the four catalogue industry groups (R101–R104), names exactly
export const industries = {
  eyebrow: 'Four industry groups',
  heading: 'Built for your industry',
  lede: 'Deepzeta AI serves every industry, with ready-made automations for four broad groups. Each group has its own page with the best-fit automations for the businesses in it.',
  // Each card's group label before its catalogue number, the flip control and the back face. The
  // automations are the catalogue's best-fit table (§7.5) for the group's industries.
  groupLabel: 'Group',
  flip: 'Flip to see the automations',
  flipBack: 'Back to the photo',
  backHeading: 'Ready-made automations for this group',
  seePage: 'See the group page',
  previous: 'Previous industry group',
  next: 'Next industry group',
  // One photo per group (P05–P08): hands, devices and spaces, never a face
  photoAlt: {
    '7.1': 'Hands arranging cards on a glass table between two laptops in a DIFC meeting room',
    '7.2': 'Hands packing an order into a box beside a label printer in a Dubai studio',
    '7.3': 'A hand holding a phone and keys in an empty Dubai apartment with skyline windows',
    '7.4': 'Gloved hands holding a tablet in a bright Dubai dental clinic treatment room',
  },
} as const;

// §10 FAQ (home.md, faq.md, engine §6): the section wrapper; the questions live in faq-bank.ts
export const faqSection = {
  eyebrow: 'FAQ',
  heading: 'Questions, answered',
  lede: 'The questions UAE business owners ask before automating — answered directly. Can\u2019t find yours? Ask us.',
  askAgent: 'Ask our AI agent',
} as const;

// §11 The final CTA (home.md): the audit offer beside the 60-second test stub; the footer's
// Landing (finaleHeading, finaleLine) already follows in the shell
export const finalCta = {
  heading: 'Start with a free AI automation audit',
  lede: 'In one session we map your sales, operations and admin, and show which automations pay back first. No obligation, no jargon.',
  // The speed-to-lead test stub (demo 4; the real test is P7). "60 seconds" is the facts §6
  // service design target, phrased exactly as the allowlist entry has it.
  testEyebrow: 'Demo',
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
