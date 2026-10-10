// The flagship service page's copy: Custom-Coded High-Performance Websites (catalogue 2.1, registry
// R060, 🔥 lead, the flagship), under the approved plan docs/plans/2026-10-10-flagship-websites-page.md
// (engine §3.1, the service order; docs/design/service-page.md, "Extras for the Websites service
// page"; the pilot speed-to-lead-system.ts is the model).
// Sources: the Services Catalogue (2.1's description and four lists, the §2 intro's "same standard",
// 2.2, 2.4, 2.5, 4A.1, 4A.3, 5.5 Launch Pack, 6.3, §8 Web, Analytics, Messaging, CRM and Booking,
// §9 naming rules), the blueprint (the Websites pillar card; the stack table: hosting on Vercel,
// Tailwind CSS with left/right-neutral CSS for Arabic, Consent Mode v2), docs/facts/company-facts.md
// (§3 launch language: English first, Arabic after; §6 the Core Web Vitals thresholds), and this
// site's own build: Next.js, TypeScript and Tailwind CSS on Vercel, logical CSS ready for Arabic
// (00 N8), "Cookie settings" at the bottom of every page (09 §7; src/content/en/legal/consent.ts),
// the build terminal (a dated recording of a real run, build-run.ts) and the Code ↔ Page view (the
// hero's real source, read at build time).
// Left out, and why: no prices, timeframes, clients, case studies, rankings, traffic or results
// (10 §3; facts §3, §5); no score or timing of this site in prose (the terminal shows the recorded
// numbers, with their date and commit); no claim about how Google or AI engines rank, choose or cite
// sources, and no law (no citation row is APPROVED, so the UAE section is our own practice only);
// "can understand and cite" is 2.1's own capability wording, never a promise (catalogue §9); no
// claim that this site has an llms.txt (engine §9.2 is planned, not built); no content-editing or
// CMS claim (2.1 lists none); no live speed badge (blueprint demo 5 isn't built).
// The Core Web Vitals thresholds are written as 2.1 writes them, always as what every page is
// "built to pass", never as a measured result. `tryIt` is left out: the page's proof is the build
// terminal, and AI View may join later (the plan, question 3). The steps are our real process, not
// an example; `exampleLabel` names them so. The FAQ questions are in faq-bank.ts
// (customCodedWebsitesFaq).
import type { ServicePageContent, WebsitesExtras } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const customCodedWebsites: ServicePageContent = {
  catalogueNumber: '2.1',
  // 40 characters; rendered with " | Deepzeta AI", 54 (08 §1: 50–60)
  title: 'Custom-Coded Websites for UAE Businesses',
  // 145 characters: the key point in the first 120 (custom-coded, SEO, GEO and AI search built in;
  // 2.1's own lists), one concrete fact (Core Web Vitals), ends with the action (08 §1)
  description: `${siteConfig.brandName} builds custom-coded websites with SEO, GEO and AI search built in, every page designed to pass Core Web Vitals. Book a free AI audit.`,
  // 40 characters, one statement headline (the navigation's outcome line: "Built to load fast and
  // bring in business"); at most 3 lines at 360 px under the breadcrumb
  heading: 'Custom-coded websites built to load fast',
  // 58 words: the full catalogue name, what it is (2.1's stack, no page builders or templates), the
  // outcome (Core Web Vitals, SEO, GEO and AI ranking built in) and who it's for (2.1's "Best for")
  answer: `Custom-Coded High-Performance Websites by ${siteConfig.brandName} are hand-coded in Next.js, TypeScript and Tailwind CSS, with no page builders or templates. Every page is built to pass Core Web Vitals, with SEO, GEO and AI ranking built in during development. They suit any UAE business that wants a website that brings leads and sales, not just an online brochure.`,

  // 2 · The problem it solves (before-after, 5 rows; 2.1's four lists). The lede is 40 words
  problem: {
    heading: 'When your website is only a brochure',
    lede: 'A website can look fine and still lose you business: slow on a phone, hard for search and AI engines to read, with no clear next step. Here is what changes when it is built for speed, search and leads.',
    rows: [
      {
        before: 'Your site runs on a theme, a page builder and plugins, each loading its own code.',
        after: 'Each page carries only the code it needs: no page builder, theme or plugin bloat.',
      },
      {
        before: 'Pages are slow to appear on a phone over a mobile network.',
        after: 'Images, fonts and code are optimised, and every page is built to pass Core Web Vitals.',
      },
      {
        before: 'Search and AI engines find no clear, structured facts about what you offer and where.',
        after:
          'Structured data, direct answers and FAQs set out your business so search and AI engines can understand and cite it.',
      },
      {
        before: 'The Arabic version is the English layout with Arabic text dropped in.',
        after: 'Arabic and English are built in, with a true right-to-left layout for Arabic.',
      },
      {
        before: 'Visitors read a page, find no clear next step and leave without a trace.',
        after: 'Every key page has a clear call to action and a lead form, with conversion tracking.',
      },
    ],
  },

  // 3 · How it works: our real build process from 2.1's four lists (not an example), beside the
  // Code ↔ Page view. The lede is 43 words; each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How we build a custom-coded website',
    lede: 'Search and speed are part of every step we take, not a clean-up job before launch. These are the steps we follow for every custom-coded website. The pages, languages and integrations change with your business; the process and the checks stay the same.',
    steps: [
      {
        // 14 words (2.1: "Content structure planned around the searches that bring revenue")
        title: 'Plan the pages first',
        text: 'We plan the pages and their structure around the searches that bring you revenue.',
      },
      {
        // 18 words (2.1: no page builders, themes or pre-designed templates)
        title: 'Design and code each page',
        text: 'Each page is designed for your business and written in code, with no page builder or theme underneath.',
      },
      {
        // 16 words (2.1: technical SEO from the start; structured data)
        title: 'Build search into the code',
        text: 'Clean URLs, a sitemap, internal links and structured data go in as the pages are coded.',
      },
      {
        // 17 words (2.1: llms.txt, AI-readable structure, direct-answer sections and FAQs)
        title: 'Add the AI-search layer',
        text: 'Direct-answer sections, FAQs and an llms.txt file are written so AI engines can understand and cite you.',
      },
      {
        // 20 words (2.1: analytics, consent and conversion tracking; ready to connect)
        title: 'Connect tracking and tools',
        text: 'Analytics, consent and conversion tracking are set up, and the site is ready to connect to WhatsApp and your CRM.',
      },
      {
        // 18 words (2.1: optimised for mobile networks; Core Web Vitals; accessible design)
        title: 'Test speed and accessibility',
        text: 'Images, fonts and code are optimised for mobile networks, then tested against Core Web Vitals and for accessibility.',
      },
      {
        // 15 words (2.1: "Performance report delivered at launch")
        title: 'Launch with a performance report',
        text: 'You get a performance report at launch, with your pages measured against Core Web Vitals.',
      },
    ],
    exampleLabel: 'How we build',
  },

  // 4 · What you get (8, the maximum; each from 2.1's lists, each ≤ 20 words). The thresholds are
  // facts §6's allowlist, written as 2.1 writes them
  deliverables: {
    heading: 'What you get',
    items: [
      'A website designed and coded for your business, with no page builders, themes or pre-designed templates',
      'Every page built to pass Core Web Vitals: LCP under 2.5 s, INP under 200 ms, CLS under 0.1',
      'Optimised images, fonts and code, accessible design, and a performance report at launch',
      'Arabic and English pages, with a true right-to-left layout for Arabic',
      'Technical SEO: clean URLs, a sitemap and internal linking, plus local SEO for each area or emirate you serve',
      'Structured data that describes your business, services and locations as one connected entity',
      'An llms.txt file, direct-answer sections and FAQs that AI engines can understand and cite',
      'Clear calls to action and lead forms, with analytics, consent (Consent Mode v2) and conversion tracking',
    ],
  },

  // 5 · Works with: names as text, only those 2.1 and §8 name (Web; Analytics; Messaging; CRM;
  // Booking, for 2.1's "ready to connect to WhatsApp, CRM, booking"). Vercel hosts this site
  // (blueprint, the stack table). The lede is 55 words
  worksWith: {
    heading: 'Built on the same stack as this site',
    lede: 'Every custom-coded site is built in Next.js, TypeScript and Tailwind CSS, a modern stack that is secure and easy to scale. This site runs on it too, hosted on Vercel. We set up analytics with GA4 and Google Tag Manager, and each site is ready to connect to WhatsApp, your CRM and your booking calendar.',
    platforms: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Vercel',
      'GA4',
      'Google Tag Manager',
      'WhatsApp Business API',
      'HubSpot',
      'Zoho CRM',
      'Pipedrive',
      'Salesforce',
      'Odoo',
      'Cal.com',
      'Google Calendar',
    ],
  },

  // 6 · Is it right for you? 2.1's "Best for", 5.5 (new businesses), and a decision aid that sends
  // two cases to a better-fitting sibling (2.4 for a site with search traffic, 2.2 for one campaign
  // page). The lede is 45 words
  fit: {
    heading: 'Is it right for you?',
    lede: 'Custom-Coded High-Performance Websites suit any business that wants a website that brings leads and sales, not just an online brochure. That covers new businesses building their first site and established ones whose site no longer keeps up. These questions help you decide which step fits.',
    goodFit: [
      'New businesses that want their first website to bring in enquiries, not just look good',
      'Established businesses whose current site is slow, dated or hard to change',
      'Businesses that serve customers in Arabic and English',
      'Businesses that want their website connected to WhatsApp, a CRM, booking or AI automations',
    ],
    decisionAid: [
      {
        question: 'Is your current site slow on a phone?',
        answer:
          'Then start with speed: a custom-coded site carries only the code each page needs, built to pass Core Web Vitals.',
      },
      {
        question: 'Do your customers read Arabic as well as English?',
        answer: 'Then build both languages in from the start, with a true right-to-left layout for the Arabic pages.',
      },
      {
        question: 'Does your current site already bring in search traffic?',
        answer:
          'Then plan the move with care. Website Redesign & Migration maps your content and sets up redirects, so old links still work.',
      },
      {
        question: 'Do you only need one page for an ad campaign?',
        answer:
          'Then you may not need a full website yet. Landing Pages & Conversion Rate Optimisation (CRO) covers campaign pages and A/B tests.',
      },
    ],
  },

  // 7 · Proof: the build terminal (customCodedWebsitesExtras.terminal); no `tryIt` (the plan, Q3)

  // 8 · UAE specifics: our own practice only (2.1: Arabic and English with true right-to-left,
  // local SEO per area or emirate, Consent Mode v2, calls to action and lead forms, ready to connect
  // to WhatsApp). No laws or platform rules until their citation rows are APPROVED
  uae: {
    heading: 'Built for UAE customers',
    points: [
      'Arabic and English: Arabic pages get a true right-to-left layout, from the menu to the forms.',
      'Local by design: local SEO is set up for each area or emirate you serve.',
      'Consent built in: analytics and conversion tracking run with Consent Mode v2, and visitors can change their choice at any time.',
      'A person one tap away: every key page has a clear call to action and a lead form, ready to connect to WhatsApp.',
    ],
  },

  // 9 · Pairs well with: the add-on Website Care Plan (2.5), AI Citation & Answer Engine Optimisation
  // (AEO/GEO) (4A.1, the reciprocal of its own pair with 2.1), and Local AI Dominance (4A.3), whose
  // line names the Launch Pack (bundle 5.5: 4D.1 + 2.1 + 4A.3 + 1A.1); the type takes service
  // numbers only, so the bundle has no field of its own
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '2.5',
        line: 'Keeps the site hosted, secure, backed up and updated, with a monthly speed and uptime report and small content changes included.',
      },
      {
        catalogueNumber: '4A.1',
        line: 'Adds comparison pages and monthly AI visibility tests on top of the GEO set-up every custom-coded site gets.',
      },
      {
        catalogueNumber: '4A.3',
        line: 'Takes local search beyond the website: your Google Business Profile in Arabic and English, the map pack and local citations. Both are part of the Launch Pack for new businesses.',
      },
    ],
  },

  faq: {
    heading: 'Questions about custom-coded websites',
    lede: 'Straight answers on cost, timing, speed, Arabic and who owns the code.',
  },
};

// The flagship page's two extras (docs/design/service-page.md, "Extras for the Websites service page";
// 13 §4.8 story-before-after and story-terminal). Both show real things: the Code ↔ Page view reads
// the hero's real source at build time, and the terminal replays a real, dated run of this site's
// own build and checks (build-run.ts), so neither carries an "Example" label (10 §3.6); the terminal
// says plainly that it is a recording, never live.
export const customCodedWebsitesExtras: WebsitesExtras = {
  codePage: {
    label: 'Code ↔ Page',
    // 30 words, one sentence
    caption:
      'The page side is this page’s real opening section; the code side is the source code that renders it, read from this site’s repository each time the site is built.',
    pageLabel: 'Page',
    codeLabel: 'Code',
    sliderLabel: 'Reveal the code behind the page',
  },
  terminal: {
    heading: 'Watch this site run its own checks',
    // 34 words (≤ 40): what the run is, and that it is replayed, not live
    lede: 'This is a recording of a real run of this site’s own build and quality checks: the build, the structured-data, SEO and link checks, then the homepage’s Lighthouse result. It is replayed, not live.',
    windowTitle: `${siteConfig.brandName} · build and checks`,
    recordedLabel: 'Recorded on {date} from commit {commit}',
    controls: {
      play: 'Play',
      pause: 'Pause',
      replay: 'Replay',
      step: 'Next step',
      group: 'Build recording controls',
    },
  },
};
