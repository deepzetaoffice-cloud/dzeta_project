// The service page's copy: AI Shopping Visibility (Agentic Commerce Readiness) (catalogue 1I.2,
// registry R051, 🔥 lead), batch 1 of the service pages under the standing plan
// (docs/plans/2026-10-08-service-pages-standing-plan.md; engine §3.1, the service order; the pilot
// speed-to-lead-system.ts is the model).
// Sources: the Services Catalogue (1I.2's description and list, 1I.1, 1I.3, 2.3, 5.4 E-Commerce
// Growth Engine, 7.5 "E-Commerce & Beauty", §8 E-commerce platforms, §9 naming rules), the
// blueprint (demo 6, "See how AI reads this page"), docs/facts/company-facts.md, and Home's
// published ownership answer (who-owns-the-system: accounts in the client's name).
// Left out, and why: no prices, timeframes, clients, results or visibility numbers (10 §3; facts §3,
// §5); no claim about how ChatGPT Shopping, Google AI Mode or Merchant Center rank, read or select
// products, and no platform policies (no citation row is APPROVED yet, so the copy describes our own
// practice only); no promise that products will be shown or recommended (catalogue §9); no
// marketplace named, because the catalogue names none; no n8n/Make/Zapier, because 1I.2's entry
// doesn't say the feed work runs on them (stock sync is 1I.1's, named in Pairs well with).
// The short form "AI Shopping Visibility" is the catalogue's own (5.4, 7.5); the full name opens
// the direct answer. The flow is an example, labelled as one (10 §3.6). The FAQ questions are in
// this file's aiShoppingVisibilityFaq (the integrator moves them into faq-bank.ts).
import type { FaqQuestion } from '@/content/en/faq-bank';
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const aiShoppingVisibility: ServicePageContent = {
  catalogueNumber: '1I.2',
  // 44 characters; rendered with " | Deepzeta AI", 58 (08 §1: 50–60)
  title: 'AI Shopping Visibility for UAE Online Stores',
  // 156 characters: the key point in the first 120 (feeds, schema, Merchant Center for ChatGPT
  // Shopping), the named deliverables as the concrete fact, ends with the action (08 §1)
  description: `AI Shopping Visibility by ${siteConfig.brandName} prepares your product feeds, schema and Merchant Center for ChatGPT Shopping and Google AI Mode. Book a free AI audit.`,
  // 50 characters, one statement headline; "help", because no one can promise what an assistant shows
  heading: 'AI Shopping Visibility: help AI find your products',
  // 59 words: the full catalogue name, the outcome (the catalogue's own aim, "built to help"), what
  // it covers (1I.2's four items) and who it's for (5.4: online stores and D2C brands)
  answer: `AI Shopping Visibility (Agentic Commerce Readiness) by ${siteConfig.brandName} is built to help your products appear and get recommended in AI shopping assistants such as ChatGPT Shopping and Google AI Mode. We restructure your product feed, add product schema and rich attributes, manage Merchant Center and marketplace feeds, and monitor visibility. It is for online stores and D2C brands.`,

  // 2 · The problem it solves (before-after, at most 5 rows; 1I.2's four items). The lede (37 words)
  // speaks of what a catalogue "can" leave out, never of how a given assistant behaves
  problem: {
    heading: 'Where product data falls short',
    lede: 'A catalogue written for shoppers browsing your website can leave an AI agent guessing. Titles can be vague, attributes missing and feeds out of date. Here is what changes when the catalogue is restructured for AI agents.',
    rows: [
      {
        before: 'Titles and descriptions are written for browsing, with key details buried in the text.',
        after: 'Your feed and catalogue are restructured so each product’s key facts are clear to AI agents.',
      },
      {
        before: 'Size, material, colour or compatibility sit only in photos or loose text.',
        after: 'Product schema and rich attributes state those details in a structured form.',
      },
      {
        before: 'Merchant Center and marketplace feeds were set up once, then left to drift.',
        after: 'Merchant Center and marketplace feeds are managed and kept in line with your store.',
      },
      {
        before: 'Nobody can say whether AI shopping assistants show your products at all.',
        after: 'AI shopping visibility is monitored, so you see where your products appear.',
      },
    ],
  },

  // 3 · How it works (story-flow): 1I.2's list as one example flow, labelled "Example". The lede is
  // 57 words; each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How AI Shopping Visibility works',
    lede: 'AI Shopping Visibility works on the data behind your store, not on its design. We restructure the catalogue, describe each product in structured data, keep your feeds in line and then watch where the products surface. Here is one example flow for a beauty brand on Shopify; your platform, feeds and product range set the real plan.',
    steps: [
      {
        title: 'We review the catalogue',
        text: 'We review the Shopify catalogue and feeds to see what an AI agent can and can’t tell about each product.',
      },
      {
        title: 'The catalogue is restructured',
        text: 'Titles, categories and descriptions are reorganised so each product’s key facts are stated plainly.',
      },
      {
        title: 'Schema and rich attributes',
        text: 'Each product page gets product schema with rich attributes, such as shade, size and ingredients.',
      },
      {
        title: 'Feeds kept in line',
        text: 'The brand’s Merchant Center and marketplace feeds are managed, so prices and stock match the store.',
      },
      {
        title: 'Visibility is monitored',
        text: 'We monitor whether the products show up in AI shopping assistants and show the brand what changed.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (at most 8, each from 1I.2's list; the last from Home's published ownership
  // answer: accounts in the client's name)
  deliverables: {
    heading: 'What you get',
    items: [
      'Product feed and catalogue restructuring for AI agents',
      'Product schema with rich attributes on your product pages',
      'Merchant Center feed management, kept in line with your store',
      'Marketplace feed management for the marketplaces you sell on',
      'Monitoring of your products’ visibility in AI shopping assistants',
      'Feeds and your Merchant Center account kept in your business’s name',
    ],
  },

  // 5 · Works with: names as text, only those 1I.2's entry (ChatGPT Shopping, Google AI Mode,
  // Merchant Center) and §8's E-commerce row name. The lede is 43 words
  worksWith: {
    heading: 'Works with your store and feeds',
    lede: 'We work from the store you already run, on Shopify, WooCommerce or a custom build, and from your Merchant Center and marketplace feeds. The aim is to have your products appear in AI shopping assistants such as ChatGPT Shopping and Google AI Mode.',
    platforms: ['Shopify', 'WooCommerce', 'custom stores', 'Merchant Center', 'ChatGPT Shopping', 'Google AI Mode'],
  },

  // 6 · Is it right for you? Catalogue 7.5 (E-Commerce & Beauty: "AI Shopping Visibility") and 5.4
  // ("Best for: online stores and D2C brands"), and a decision aid. The lede is 42 words
  fit: {
    heading: 'Is it right for you?',
    lede: 'AI Shopping Visibility suits online stores whose products are compared on details such as size, shade, material or specs. It is a best-fit automation for e-commerce and beauty brands, and part of the E-Commerce Growth Engine solution. Ask yourself these questions first.',
    goodFit: [
      'Online stores and D2C brands selling on their own site and on marketplaces',
      'Beauty and cosmetics brands with shades, sizes and ingredients to describe',
      'Stores on Shopify, WooCommerce or a custom build with Merchant Center feeds',
    ],
    decisionAid: [
      {
        question: 'Do shoppers compare your products on specific details?',
        answer: 'Then stating those details as structured attributes, not burying them in text, is where to start.',
      },
      {
        question: 'Do you sell on marketplaces as well as your own store?',
        answer: 'Then managed feeds keep each listing in line with your store, so details don’t contradict each other.',
      },
      {
        question: 'Do you already run Merchant Center feeds?',
        answer: 'Then we start from those feeds and improve them, rather than starting again.',
      },
      {
        question: 'Is your catalogue small and your store still new?',
        answer: 'Then you may not need it yet. A free AI audit shows what to fix first instead.',
      },
    ],
  },

  // 7 · Try it: AI View (blueprint demo 6, "See how AI reads this page"; P7 builds it), which reads
  // this page's own structured data. The line says the tool is still being built (42 words)
  tryIt: {
    heading: 'See the structured data behind this page',
    line: 'AI View will show the structured data on this page as a machine reads it: the same kind of data we add to your product pages. The tool is still being built and goes live in a later update of this site.',
    trigger: 'See how AI reads this page',
    demoId: 'ai-view',
    icon: 'globe',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (1I.3: AI-written translations reviewed by a
  // person; 02 §1.4's rule that structured data never carries an invented value, applied to the
  // client's product data; Home's ownership answer). No laws or platform rules until their citation
  // rows are APPROVED.
  uae: {
    heading: 'Built for UAE stores',
    points: [
      'Arabic and English: product titles, descriptions and attributes can be prepared in both, and a person reviews every AI-written translation.',
      'One set of facts: prices, stock and delivery details in your feeds come from your store, so shoppers see the same offer everywhere.',
      'No invented ratings: reviews and ratings go into your product data only when they are real.',
      'Your accounts, your data: feeds, Merchant Center and product data stay in your business’s name.',
    ],
  },

  // 9 · Pairs well with: the add-on Product Content Automation (1I.3), Store Operations Automation
  // (1I.1), whose line names the E-Commerce Growth Engine solution (bundle 5.4) both belong to, and
  // E-Commerce Websites (2.3)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1I.3',
        line: 'Writes product titles, descriptions and translations with AI, each reviewed by a person, to fill the gaps the restructuring finds.',
      },
      {
        catalogueNumber: '1I.1',
        line: 'Sends order and delivery updates by WhatsApp and keeps stock in sync across channels. Both are part of the E-Commerce Growth Engine solution.',
      },
      {
        catalogueNumber: '2.3',
        line: 'Builds Shopify, WooCommerce or custom stores in Arabic and English, when the store itself needs replacing.',
      },
    ],
  },

  faq: {
    heading: 'Questions about AI Shopping Visibility',
    lede: 'What store owners ask before we touch their catalogue: cost, timing, platforms, Arabic and results.',
  },
};

// The questions on the AI Shopping Visibility page (/services/ai-shopping-visibility, R051): 8, the
// lead service range of 6–8 (engine §3); cost and timeline first (§6.2 rule 3). Each first sentence
// stands alone (≤ 25 words); each answer is 40–90 words and names at most one other service.
// Sources: catalogue 0.1 (the written summary, next steps and a quote), 1I.2, 1I.3 (translations
// reviewed by a human), 2.3, §8 and §9 (no guaranteed results); Home's ownership answer. The ids
// carry the service's stem; none repeats a question on Home, the hub or the pilot.
export const aiShoppingVisibilityFaq: readonly FaqQuestion[] = [
  {
    id: 'what-does-ai-shopping-visibility-cost',
    topic: 'cost',
    question: 'How much does AI Shopping Visibility cost?',
    answer:
      'The price depends on your catalogue, so we quote it after a free AI audit. The main drivers are how many products and categories need restructuring, how many feeds and marketplaces we manage, and how much product data is missing today. A store with clean data needs less work than one with sparse titles and no attributes.',
  },
  {
    id: 'how-long-does-ai-shopping-visibility-take',
    topic: 'timeline',
    question: 'How long does it take to get a catalogue ready?',
    answer:
      'We give a timeframe only after the free AI audit, once we have seen your catalogue and feeds. Restructuring a focused range is a smaller job than a store with deep categories and several marketplaces. The audit ends with a written summary, next steps and a quote, so you see the plan before any work begins.',
  },
  {
    id: 'can-ai-shopping-visibility-promise-recommendations',
    topic: 'results',
    question: 'Can you make ChatGPT recommend our products?',
    answer:
      'No: nobody can promise that ChatGPT or any AI assistant will recommend a product. The assistant decides what it shows, not us and not you. What we control is your side: clear, structured, accurate product data in every feed, and monitoring that shows where your products appear. We report what we measure, never invented numbers.',
  },
  {
    id: 'does-ai-shopping-visibility-work-with-shopify',
    topic: 'integrations',
    question: 'Does it work with Shopify and WooCommerce?',
    answer:
      'Yes: AI Shopping Visibility works with stores on Shopify, WooCommerce or a custom build. We work in your existing store and feeds, including Merchant Center and the marketplaces you already sell on, so there is no need to change platform. If the store itself needs rebuilding, E-Commerce Websites covers Shopify, WooCommerce and custom stores.',
  },
  {
    id: 'can-ai-shopping-visibility-cover-arabic',
    topic: 'arabic',
    question: 'Can our product data be in Arabic as well as English?',
    answer:
      'Yes: product titles, descriptions and attributes can be prepared in Arabic and English, so the store reads correctly in both. Where translations are needed, Product Content Automation writes them with AI and a person reviews every one before it reaches your store or feeds.',
  },
  {
    id: 'does-ai-shopping-visibility-need-customer-data',
    topic: 'data-privacy',
    question: 'Do you need access to our customer data?',
    answer:
      'No: AI Shopping Visibility works on product data, not on your customers’ personal data. We need access to your product catalogue, your feeds and your Merchant Center account, with permissions that cover only that work. You choose the access level, and you can remove it at any time.',
  },
  {
    id: 'who-controls-the-ai-shopping-visibility-feeds',
    topic: 'ownership',
    question: 'Who controls our product feeds and Merchant Center account?',
    answer:
      'You do: your feeds, your Merchant Center account and your product data stay in your business’s name. We work inside your accounts and document every change we make to the catalogue and feeds. If you later move the work in-house or to another team, nothing has to be rebuilt or handed back.',
  },
  {
    id: 'what-happens-after-ai-shopping-visibility-set-up',
    topic: 'support',
    question: 'What happens after the catalogue is restructured?',
    answer:
      'Monitoring continues after launch: we watch where your products appear in AI shopping assistants and keep your feeds in line with the store. When you add products or change prices, the feeds follow. You see what changed and what we fixed, so you can judge the work on real observations.',
  },
];
