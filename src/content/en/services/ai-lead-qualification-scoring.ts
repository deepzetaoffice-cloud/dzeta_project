// The service page's copy: AI Lead Qualification & Scoring (catalogue 1B.2, registry R028, a core
// service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 2; engine
// §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1B.2's list: qualifying questions on budget, timeline and need,
// a score from answers and behaviour, hot leads to sales and cold leads into nurture, conversion data
// back to Google Ads and Meta; 1A.1, which qualifies leads on WhatsApp; 4B.2, Meta lead ads; 1B.1,
// 1B.5, 1B.6 and 6.3 for the pairs and the integrations answer; §8 platforms; §9 naming rules and
// consent; 1K.1, retention and access rules and a record of what each AI step uses), the blueprint
// (demo 1, the AI agent that qualifies the visitor), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, conversion or reply rates, and any claim
// that scoring lowers ad costs or raises sales (10 §3; facts §3, §5); how Google Ads and Meta use
// conversion data, and their data and consent rules (platform facts with no APPROVED citation row);
// industry fits (catalogue 7.5 names no industry for 1B.2, so the fits come from its own list);
// named scoring or enrichment vendors (the catalogue names none). No bundle includes 1B.2, so none
// is named. The UAE section states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (aiLeadQualificationScoringFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const aiLeadQualificationScoring: ServicePageContent = {
  catalogueNumber: '1B.2',
  // 42 characters (the exact catalogue name, 31, plus the market); rendered with " | Deepzeta AI",
  // 56 (08 §1: 50–60)
  title: 'AI Lead Qualification & Scoring in the UAE',
  // 158 characters: the key point (the three qualifying questions) in the first 120 (ends at 96), one
  // concrete fact (budget, timeline and need), ends with the action (08 §1)
  description: `AI Lead Qualification & Scoring from ${siteConfig.brandName} asks each lead about budget, timeline and need, scores it and sends hot leads to sales. Book a free AI audit.`,
  // 30 characters: the registry row's intent ("so sales calls the best first") as the outcome; clears the
  // European banner at 360 × 640 under the long breadcrumb
  heading: 'Know which leads to call first',
  // 54 words: what it is, the outcome, who it's for (1B.2's list; no "Best for" line)
  answer: `AI Lead Qualification & Scoring by ${siteConfig.brandName} asks every new lead about budget, timeline and need, then scores it from its answers and behaviour. Hot leads go straight to your sales team, and cold leads go into nurture. It is for UAE sales teams that get more enquiries than they can call back.`,

  // The hero photo, P22 (src/lib/media/photos.ts; the media plan): 111 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'Hands holding a phone with leads marked by coloured score dots, a laptop chart behind, in a Business Bay office',

  // 2 · The problem it solves (before-after, 5 rows; catalogue 1B.2's four capabilities, the hot and
  // cold paths as two rows). Lede: 39 words
  problem: {
    heading: 'Where hot leads wait their turn',
    lede: 'When every enquiry looks the same, your team works them in the order they arrive. A ready buyer waits behind someone who is only browsing, and cold leads get dropped. Here is what changes when every lead is scored.',
    rows: [
      {
        before: 'Salespeople ask the same basic questions on every first call.',
        after: 'Qualifying questions on budget, timeline and need are asked automatically, before anyone calls.',
      },
      {
        before: 'Leads are worked in the order they arrive, not by how ready they are to buy.',
        after: 'Each lead is scored from its answers and behaviour, so your team knows who to call first.',
      },
      {
        before: 'A buyer ready to commit waits in the same queue as everyone else.',
        after: 'Hot leads go straight to your sales team, with their answers attached.',
      },
      {
        before: 'Leads who aren’t ready yet hear nothing more and go cold for good.',
        after: 'Cold leads go into nurture, so they keep hearing from you until they are ready.',
      },
      {
        before: 'Google Ads and Meta don’t hear which of your leads turned into sales.',
        after: 'Conversion data goes back to Google Ads and Meta, for better targeting.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1B.2's list as one example flow, labelled "Example"; a
  // property enquiry from a Meta lead ad (4B.2's lead ads), qualified on WhatsApp (1A.1). The lede
  // (42 words) says what decides each lead's path. Each title ≤ 5 words, each text ≤ 20 words
  // (types.ts)
  how: {
    heading: 'How each lead is qualified and scored',
    lede: 'AI Lead Qualification & Scoring asks the questions you choose, scores the answers with rules you agree, and decides where each lead goes next. Here is one example flow for a property enquiry; your questions, rules and thresholds follow how you sell.',
    steps: [
      {
        title: 'A lead ad arrives',
        text: 'A buyer fills in your Meta lead ad about new apartments in Dubai.',
      },
      {
        title: 'Qualifying questions on WhatsApp',
        text: 'The buyer is asked about budget, timeline and need, such as a home to live in or an investment.',
      },
      {
        title: 'The lead is scored',
        text: 'Its answers, plus behaviour such as how quickly the buyer replied, give the lead a score.',
      },
      {
        title: 'A hot lead reaches sales',
        text: 'The budget and timeline fit, so the lead goes straight to an agent with every answer attached.',
      },
      {
        title: 'A cold lead is nurtured',
        text: 'Another buyer plans to buy next year, so they join a nurture sequence instead of the call list.',
      },
      {
        title: 'Results go back to ads',
        text: 'When the deal is won, conversion data goes back to Meta and Google Ads, for better targeting.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (7; each from catalogue 1B.2's list, or §9 for the consent and human line; the
  // Arabic line is Deepzeta AI's bilingual practice, 1A.1)
  deliverables: {
    heading: 'What the service includes',
    items: [
      'Qualifying questions on budget, timeline and need, asked automatically',
      'Questions written around how you sell, in Arabic and English',
      'A score for each lead from its answers and behaviour, using rules you agree',
      'Hot leads sent straight to your sales team, with their answers attached',
      'Cold leads moved into nurture instead of being dropped',
      'Conversion data sent back to Google Ads and Meta for better targeting',
      'Consent wording in every question, and a clear way to reach a person',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1B.2 (Google Ads and Meta, as 4B.1's and
  // 4B.2's ad platforms) and §8 name (messaging, CRM, automation). Lede: 43 words
  worksWith: {
    heading: 'Works with your ads, channels and CRM',
    lede: 'Leads come in from your website forms, WhatsApp and campaigns on Google Ads and Meta. Questions go out through the WhatsApp Business API, email or SMS, and each score is written to your CRM. We build the flows on n8n, Make or Zapier.',
    platforms: [
      'Google Ads',
      'Meta Ads',
      'WhatsApp Business API',
      'email',
      'SMS',
      'HubSpot',
      'Zoho CRM',
      'Pipedrive',
      'Salesforce',
      'Odoo',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? No 7.5 row names 1B.2, so the fits come from its own list (more leads than
  // calls, paid leads from Google Ads and Meta, cold leads nurtured) and a decision aid. Lede: 30 words
  fit: {
    heading: 'Is lead scoring right for you?',
    lede: 'AI Lead Qualification & Scoring suits any business that gets more leads than its sales team can call, or that pays for leads from ads. These questions help you decide.',
    goodFit: [
      'Sales teams with more enquiries than they can call back quickly',
      'Businesses that pay for leads from Google Ads or Meta campaigns',
      'Teams that want cold leads nurtured until they are ready, not dropped',
    ],
    decisionAid: [
      {
        question: 'Do your first calls start with the same basic questions?',
        answer: 'Then those questions are asked before the call, so your salesperson starts from the answers.',
      },
      {
        question: 'Do you pay for leads from Google Ads or Meta?',
        answer: 'Then conversion data can go back to both platforms, for better targeting.',
      },
      {
        question: 'Do leads who aren’t ready yet simply drop out?',
        answer: 'Then cold leads move into nurture and keep hearing from you until they are ready to talk.',
      },
      {
        question: 'Do you get so few leads that you call each one yourself?',
        answer: 'Then scoring may not be worth it yet. A free AI audit shows which automation to start with.',
      },
    ],
  },

  // 7 · Try it: the AI agent's stub (blueprint demo 1: it answers in Arabic or English, qualifies the
  // visitor and books the audit; P7 builds it, so nothing here says it works today). The trigger
  // matches Home's ("Try our AI agent")
  tryIt: {
    heading: 'Be the lead our AI agent qualifies',
    line: 'Our own AI agent will answer your questions in Arabic or English, ask a few qualifying questions of its own, then book your free AI audit. It is still being built and arrives in a later update of this site.',
    trigger: 'Try our AI agent',
    demoId: 'ai-agent',
    icon: 'send',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (1A.1: Arabic and English; catalogue §9:
  // consent wording and a way to reach a human; 1B.2: cold leads go into nurture, never dropped; 1K.1:
  // retention and access rules). No laws or ad-platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Scoring set up for UAE leads',
    points: [
      'Arabic and English: each lead is asked in the language they used to reach you.',
      'Consent wording in every message, and a lead can ask for a person at any point.',
      'Your team stays in charge: a score decides who is called first, never who is turned away.',
      'Data rules from day one: retention and access rules for answers and scores, agreed before launch.',
    ],
  },

  // 9 · Pairs well with: Sales Follow-Up & Nurture Sequences (1B.5, where 1B.2's cold leads go), the
  // Speed-to-Lead System (1B.1, the first reply; "60 seconds" is the facts §6 design target, written
  // as one) and CRM Setup & Automation (1B.6, where scored leads land). No bundle includes 1B.2
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.5',
        line: 'Runs the nurture sequences that cold leads move into, and stops by itself when the lead replies or books.',
      },
      {
        catalogueNumber: '1B.1',
        line: 'Is built to answer each new lead within 60 seconds, so the qualifying questions start while the enquiry is fresh.',
      },
      {
        catalogueNumber: '1B.6',
        line: 'Sets up the CRM where scored leads land, with pipelines, tasks and reminders for each salesperson.',
      },
    ],
  },

  faq: {
    heading: 'Questions about lead scoring',
    lede: 'What sales teams ask before scoring leads: cost, timing, rules, ad data, Arabic and privacy.',
  },
};
