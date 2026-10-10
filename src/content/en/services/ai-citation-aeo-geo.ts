// The service page's copy: AI Citation & Answer Engine Optimisation (AEO/GEO) (catalogue 4A.1,
// registry R068, 🔥 lead), batch 1 of the service pages under the standing plan
// (docs/plans/2026-10-08-service-pages-standing-plan.md; engine §3.1, the service order; the pilot
// speed-to-lead-system.ts is the model).
// Sources: the Services Catalogue (4A.1's description and list, 2.1's "SEO, GEO and AI ranking
// built into development", 4A.3, 4A.4, 4A.5, 5.3 Get Found by AI and its "Best for", 7.1 and 7.3
// industries, §8 Web, §9 naming rules), the blueprint (demo 6, "See how AI reads this page"; the
// monthly test, "ask ChatGPT, Gemini and Perplexity about us"), docs/facts/company-facts.md, and
// this site's own build: the direct answer under every H1, the FAQ text the FAQPage schema reads
// byte for byte (faq-bank.ts; 08 §3 rule 7), and the Service node whose provider is #organization
// (src/lib/schema). This site has no llms.txt yet (engine §9.2 is planned), so the copy never says
// it does.
// Left out, and why: no prices, timeframes, clients, rankings, traffic or citation numbers (10 §3;
// facts §3, §5); no claim about how ChatGPT, Gemini, Perplexity or Google AI Overviews choose, rank
// or cite sources, no llms.txt format facts, and no "AI tools cite X often" claims (no citation row
// is APPROVED yet, so the copy describes our own practice only); no promise to get a business
// cited or named (catalogue §9).
// The short form "AEO/GEO" is the catalogue's own (5.3); the full name opens the direct answer. The
// flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (aiCitationAeoGeoFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const aiCitationAeoGeo: ServicePageContent = {
  catalogueNumber: '4A.1',
  // 40 characters; rendered with " | Deepzeta AI", 54 (08 §1: 50–60)
  title: 'AI Citation & AEO/GEO for UAE Businesses',
  // 150 characters: the key point in the first 120 (schema, llms.txt and direct answers so AI
  // engines can cite you; 2.1's "understand and cite" wording), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s AEO/GEO service sets up schema, llms.txt and direct-answer content so ChatGPT, Gemini and Perplexity can cite you. Book a free AI audit.`,
  // 37 characters, one statement headline: what we give the engines, not a promise of what they do;
  // clears the European banner at 360 × 640
  heading: 'Answers AI engines can quote and cite',
  // 56 words: the full catalogue name, the outcome (4A.1's own aim, "built to"), what it covers
  // (4A.1's list) and who it's for (5.3: "any local or B2B business")
  answer: `AI Citation & Answer Engine Optimisation (AEO/GEO) by ${siteConfig.brandName} is built to get your business named and recommended by ChatGPT, Gemini, Perplexity and Google AI Overviews. We set up your entity and schema, llms.txt and direct-answer content, then test every month how AI engines describe you. It suits local and B2B businesses in the UAE.`,

  // 2 · The problem it solves (before-after, at most 5 rows; 4A.1's four items, the entity item in
  // two rows). The lede (30 words) names what the work starts from, not how an engine behaves
  problem: {
    heading: 'When AI answers leave your business out',
    lede: 'AEO/GEO starts from what AI engines can find out about you: your site, your structured data and your profiles. Here is what changes when the gaps in them are closed.',
    rows: [
      {
        before: 'Your business is described one way on your site and another on profiles and directories.',
        after: 'Entity and schema setup describes your business the same way everywhere you control.',
      },
      {
        before: 'Pages explain what you do in long paragraphs, with no short answer to quote.',
        after: 'Each key page opens with a direct answer that makes sense quoted on its own.',
      },
      {
        before: 'The questions buyers ask before they call go unanswered on your site.',
        after: 'FAQs and comparison pages answer those questions in plain words.',
      },
      {
        before: 'Nothing on your site points to the pages that explain your business best.',
        after: 'An llms.txt file lists those pages, and the content follows an AI-readable structure.',
      },
      {
        before: 'Nobody checks what ChatGPT or Gemini says about you.',
        after: 'Monthly AI visibility tests show how AI engines describe your business.',
      },
    ],
  },

  // 3 · How it works (story-flow): 4A.1's list as one example flow for a law firm (catalogue 7.3),
  // labelled "Example". The lede is 55 words; each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How AEO/GEO works',
    lede: 'AEO/GEO works on who you are, what you answer and how it is tested. We fix the facts about your business first, then write the answers, then check what AI engines say. Here is one example flow for a law firm in Dubai; the real plan follows your services, your pages and your buyers’ questions.',
    steps: [
      {
        title: 'We map the entity',
        text: 'We list how the firm is named and described on its site, profiles and directories.',
      },
      {
        title: 'Schema connects the facts',
        text: 'Organization, service and FAQ schema describe the firm as one connected entity across its pages.',
      },
      {
        title: 'Answers come first',
        text: 'Each practice-area page opens with a direct answer, then FAQs drawn from real client questions.',
      },
      {
        title: 'Comparison pages added',
        text: 'A page comparing mediation with going to court answers a choice clients weigh up.',
      },
      {
        title: 'llms.txt published',
        text: 'An llms.txt file lists the firm’s key pages in plain language for AI engines.',
      },
      {
        title: 'Monthly AI visibility test',
        text: 'Each month we ask ChatGPT, Gemini and Perplexity about the firm and report what they say.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (at most 8, each from 4A.1's list)
  deliverables: {
    heading: 'What you get',
    items: [
      'Entity and schema setup so AI engines recognise your business',
      'An llms.txt file and an AI-readable content structure',
      'Direct-answer sections that open your key pages',
      'FAQs written from the questions your buyers really ask',
      'Comparison pages for the choices your buyers weigh up',
      'Monthly AI visibility tests with a plain report of what they found',
    ],
  },

  // 5 · Works with: names as text, only those 4A.1's entry (ChatGPT, Gemini, Perplexity, Google AI
  // Overviews) and §8's Web row name; the last sentence is 2.1's built-in GEO. The lede is 40 words
  worksWith: {
    heading: 'Tested on the engines your buyers ask',
    lede: 'We test how ChatGPT, Gemini, Perplexity and Google AI Overviews describe your business. The changes themselves live on your website: its pages, its structured data and its llms.txt. Websites we build on Next.js carry this layer from their first release.',
    platforms: ['ChatGPT', 'Gemini', 'Perplexity', 'Google AI Overviews', 'Next.js', 'Vercel'],
  },

  // 6 · Is it right for you? Catalogue 5.3 ("Best for: any local or B2B business"; its components
  // named in prose), 7.1 and 7.3 industries, and a decision aid. The lede is 44 words
  fit: {
    heading: 'Is it right for you?',
    lede: 'AEO/GEO suits any local or B2B business whose buyers research before they make contact. It is part of the Get Found by AI solution, with Local AI Dominance, the Technical SEO & Schema Audit and Google Business Profile Automation. These questions show whether it fits.',
    goodFit: [
      'B2B companies whose buyers compare suppliers before making contact',
      'Law firms, financial services and other professional firms',
      'SaaS and software companies with a product that needs explaining',
    ],
    decisionAid: [
      {
        question: 'Do buyers ask you the same questions before they buy?',
        answer: 'Then those questions are the raw material: each one becomes a direct answer on your site.',
      },
      {
        question: 'Is your business described differently across the web?',
        answer: 'Then entity and schema work comes first, so your site and profiles tell one consistent story.',
      },
      {
        question: 'Do you know what ChatGPT says about you today?',
        answer: 'If not, the first monthly test gives you a baseline to measure later changes against.',
      },
      {
        question: 'Is your website hard to change, or due for a rebuild?',
        answer:
          'Then consider Custom-Coded High-Performance Websites, which build this structure in during development.',
      },
    ],
  },

  // 7 · Try it: the non-commodity point, this page built the same way (true today: the direct
  // answer, FAQ text equal to its FAQPage schema, the Service's provider #organization), and AI
  // View (blueprint demo 6; P7 builds it), which says it is still being built. 52 words
  tryIt: {
    heading: 'This page is built the same way',
    line: `This page opens with a direct answer, its FAQ text matches its structured data word for word, and one schema graph names ${siteConfig.brandName} as the provider. AI View will show that data as a machine reads it. The tool is still being built and goes live in a later update of this site.`,
    trigger: 'See how AI reads this page',
    demoId: 'ai-view',
    icon: 'globe',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (Arabic and English throughout the catalogue;
  // the engine's question bank from sales calls and WhatsApp, §6.1; catalogue §9, measured results
  // only). No laws or platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Built for how UAE buyers ask',
    points: [
      'Arabic and English: answers and FAQs in both languages, so Arabic-speaking buyers get the same clear facts.',
      'The facts buyers check, stated once: your name, emirate, contact details and services match on every page.',
      'Questions from real conversations: FAQs start from your sales calls and WhatsApp chats, not from guesswork.',
      'No invented proof: every number we publish for you comes with a source you can show.',
    ],
  },

  // 9 · Pairs well with: the add-on Technical SEO & Schema Audit (4A.5), Local AI Dominance (4A.3),
  // whose line names the Get Found by AI solution (bundle 5.3) both belong to, and Custom-Coded
  // High-Performance Websites (2.1)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '4A.5',
        line: 'Audits crawling, indexing and speed, implements structured data and gives you a fix list with priorities.',
      },
      {
        catalogueNumber: '4A.3',
        line: 'Covers the local side: your Google Business Profile in Arabic and English, the map pack and local citations. Both are part of Get Found by AI.',
      },
      {
        catalogueNumber: '2.1',
        line: 'Builds schema, llms.txt and direct-answer sections into a new website during development, not afterwards.',
      },
    ],
  },

  faq: {
    heading: 'Questions about AEO/GEO',
    lede: 'What business owners ask before working on AI citation: cost, timing, results and access.',
  },
};
