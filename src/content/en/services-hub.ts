// The services hub's copy (/services, registry R010): the P6 part A plan, S10, and its S7 surface
// spec (engine §3: the Hub row, 500–1,000 visible words, 4–6 questions).
// Sources: the Services Catalogue (pillar promises and contents, §0 starter offers, §5 bundles, §6
// ongoing care, 1K.1, 2.1), docs/facts/company-facts.md (the market: the UAE first, then the GCC).
// Rows and lists name a service, offer or bundle by its catalogue number; the components read the
// exact names from src/content/catalogue.ts (10 §2). Names in prose are the catalogue's, exactly.
// No numbers, prices, clients or results (10 §3; facts §3, §5). The hub's FAQ is in faq-bank.ts.
// Word budget: the pillar directories render every lead and core service name from the catalogue
// (about 300 words), so this copy stays lean to keep the page inside the hub's range.
import type { ServicesHubContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const servicesHub: ServicesHubContent = {
  // 42 characters; rendered with " | Deepzeta AI", 56 (08 §1: 50–60)
  title: 'AI Automation, Website and Growth Services',
  // 157 characters: the key point first, the four pillars as the concrete fact, ends with the action
  description: `Every ${siteConfig.brandName} service, by pillar: AI automation, custom-coded websites, software, and growth and ranking. Find yours by problem, or book a free AI audit.`,
  heading: 'AI automation, websites, software and growth services',
  // 43 words; the positioning line (facts §1) and the market (facts §3)
  answer: `${siteConfig.brandName} builds online growth for every business, starting with the UAE, through four pillars: AI Automation, Websites, Software, and Growth & Ranking. Find your service by problem or by pillar. Not sure? A free AI automation audit shows what to automate first.`,

  // "Which service do you need?": problems in the owner's words, each to a lead or core service
  // that the catalogue says solves it (1B.1, 1A.2 "after hours and during peak times", 1A.1, 1B.3,
  // 1F.2, 3.3 "Replace spreadsheets with proper tools", 2.1, 4A.1)
  chooser: {
    heading: 'Which service do you need?',
    lede: 'Find the problem that sounds like yours.',
    caption: 'Common problems and the service for each',
    problemHeader: 'Your problem',
    serviceHeader: 'The service',
    rows: [
      { problem: 'Leads wait hours before anyone replies', catalogueNumber: '1B.1' },
      { problem: 'We miss calls after hours', catalogueNumber: '1A.2' },
      { problem: 'WhatsApp messages pile up unanswered', catalogueNumber: '1A.1' },
      { problem: 'Quotes go out late, and nobody chases them', catalogueNumber: '1B.3' },
      { problem: 'We aren’t ready for UAE e-invoicing', catalogueNumber: '1F.2' },
      { problem: 'We run the business on spreadsheets', catalogueNumber: '3.3' },
      { problem: 'Our website is slow and brings few leads', catalogueNumber: '2.1' },
      { problem: 'AI assistants like ChatGPT never mention us', catalogueNumber: '4A.1' },
    ],
  },

  // "Start here": the catalogue's starter offers (§0), each line from its own entry
  startHere: {
    heading: 'Start here',
    lede: 'From a free first look to an in-depth review.',
    items: [
      { offerNumber: '0.1', line: 'Shows what to automate first, with estimated hours and money saved.' },
      { offerNumber: '0.2', line: 'A full review for larger companies before a major AI project.' },
      { offerNumber: '0.3', line: 'Checks your site’s speed and AI-search visibility, with fixes ranked by impact.' },
    ],
  },

  // The four pillar directories: one 40–75-word lede each, written from the pillar's own sections
  pillars: {
    heading: 'Every service, by pillar',
    ledes: {
      // 41 words: sub-groups 1B, 1D–1H; 1A.1, 1A.2 and 1A.4 (Arabic and English); 1B.3, 1C.1, 1F.1, 1B.6
      ai: 'AI Automation takes repetitive work off your team across sales, service, operations, finance, HR and marketing. AI agents answer customers on WhatsApp, phone and chat in Arabic and English, and automations send quotes, book appointments, chase invoices and update your CRM.',
      // 40 words: section 2's standard and the catalogue's highlights
      web: 'Every website we build is hand-coded, with no page builders or templates, and built to pass Core Web Vitals on every page. SEO, GEO and AI ranking go in during development, ready for Google and AI engines from launch day.',
      // 40 words: 3.1 (roles, integrations), 3.2, 3.3 (spreadsheets), 3.4 (around how the business works)
      software:
        'Software covers the jobs off-the-shelf tools don’t fit. We build web applications, client portals, internal tools and admin dashboards around how your business works, with user roles and links to your CRM, ERP, payments and WhatsApp. Spreadsheets become proper tools.',
      // 42 words: 4A (2.1's "understand and cite" wording), 4B, 4C, 4D
      ranking:
        'Growth & Ranking helps buyers find your business and choose it. It covers search and AI visibility, so Google, ChatGPT, Gemini and Perplexity can understand and cite you, plus paid ads on Google, Meta and TikTok, social media, content, and brand strategy.',
    },
  },

  // "Ongoing care": section 6, in catalogue order (6.1 AI Ops Retainer; the add-ons 6.2–6.4 have no
  // pillar page, so the hub is where they are listed)
  care: {
    heading: 'Ongoing care',
    lede: 'The AI Ops Retainer monitors, fixes and improves your automations and AI agents every month. Training, tracking setup and priority support can be added to any project.',
    catalogueNumbers: ['6.1', '6.2', '6.3', '6.4'],
  },

  // "Solutions": the six bundles (§5) are listed by the component from the catalogue
  solutions: {
    heading: 'Solutions',
    lede: 'Solutions package several services into one system built around one business problem.',
  },

  faq: {
    heading: 'Questions about our services',
    lede: 'Straight answers before you choose.',
  },
};
