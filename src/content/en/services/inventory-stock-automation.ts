// The service page's copy: Inventory & Stock Automation (catalogue 1E.3, registry R042, a core
// service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 2; engine
// §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1E.3's list: low-stock alerts and automatic reorder suggestions,
// stock sync between shop, warehouse and online store, AI demand forecasting from sales history; §8
// platforms (E-commerce, Accounting & ERP, Messaging, Automation); 1F.5 for "POS" as a source of shop
// sales; §9 naming rules; 0.1, the audit's written summary and quote; 1K.1, data rules in every
// automation project; 1E.4, 1E.6 and 1I.1 for the pairs), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, results, stock-accuracy or forecast-accuracy
// figures (10 §3; facts §3, §5; the forecast is described as working from sales history, never with
// a figure); a "Best for" line and a 7.5 fit (1E.3 has neither, so the fit follows from its own list:
// stock in more than one place or channel); barcode scanning, automatic purchase orders and named POS
// or warehouse tools (the catalogue lists suggestions, not orders, and names no such tools; the hero
// photo shows a scanner, so the copy stays clear of scanning claims); which accounting systems hold
// stock (a vendor fact: the copy says "if you keep stock in…"); VAT, customs or any trade rule (no
// citation row is APPROVED). No bundle includes 1E.3, so none is named. No demo matches stock (the
// workflow explorer follows a lead to a booking), so the page has no try-it band. The UAE section
// states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (inventoryStockAutomationFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const inventoryStockAutomation: ServicePageContent = {
  catalogueNumber: '1E.3',
  // 39 characters (the exact catalogue name, 28, is too short alone); rendered with " | Deepzeta AI",
  // 53 (08 §1: 50–60)
  title: 'Inventory & Stock Automation in the UAE',
  // 155 characters: the key point in the first 120 (the sync across shop, warehouse and online
  // store), one concrete fact (low-stock alerts), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Inventory & Stock Automation syncs stock across shop, warehouse and online store, and alerts you when an item runs low. Book a free AI audit.`,
  // 33 characters: catalogue 1E.3's low-stock alerts and reorder suggestions as the outcome (it
  // suggests, it doesn't order); two lines at 360 px, so it clears the European banner at 360 × 640
  heading: 'Reorder before the stock runs out',
  // 59 words: what it is, the outcome, who it's for (1E.3's sync: stock in more than one place)
  answer: `Inventory & Stock Automation by ${siteConfig.brandName} keeps stock in sync between your shop, warehouse and online store, alerts you when an item runs low and suggests what to reorder. AI forecasts demand from your sales history, so you can plan purchases ahead. It is for UAE retailers and online stores that hold stock in more than one place.`,

  // The hero photo, P29 (src/lib/media/photos.ts; the media plan): 118 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'A handheld scanner reading a cardboard box in a Dubai boutique’s stockroom, shelves of boxes and folded clothes behind',

  // 2 · The problem it solves (before-after, 5 rows; catalogue 1E.3's three capabilities: the sync as
  // two rows, the alerts, the suggestions, the forecast). Lede: 37 words
  problem: {
    heading: 'Where stock counts drift',
    lede: 'When the shop, the warehouse and the online store each keep their own count, the numbers drift apart. Then the guesswork starts: what is left, and what to reorder. Here is what changes once stock is synced.',
    rows: [
      {
        before: 'The shop, the warehouse and the online store each show a different count.',
        after: 'Stock stays in sync between your shop, warehouse and online store.',
      },
      {
        before: 'An item sells online after the last one has left the shop floor.',
        after: 'A sale in one place updates the count everywhere, so the online store shows what you have.',
      },
      {
        before: 'You learn an item has run out when a customer asks for it.',
        after: 'A low-stock alert reaches you while there is still time to reorder.',
      },
      {
        before: 'Reorders are worked out by hand from shelf counts and memory.',
        after: 'Automatic reorder suggestions show what to buy, for you to check and approve.',
      },
      {
        before: 'Purchases for busy seasons are planned on instinct.',
        after: 'AI forecasts demand from your sales history, so you can plan purchases ahead.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1E.3's list as one example flow, labelled "Example"; a
  // fashion boutique with a shop, a warehouse and an online store (1E.3's sync). The lede (56 words)
  // says what everything works from: one shared count. Each title ≤ 5 words, each text ≤ 20 words
  // (types.ts)
  how: {
    heading: 'How stock stays in sync',
    lede: 'Inventory & Stock Automation connects every place you hold or sell stock, so each sale and delivery updates one shared count. Alerts, reorder suggestions and forecasts all work from that count. Here is one example flow for a fashion boutique with a shop, a warehouse and an online store; yours follows your own items and channels.',
    steps: [
      {
        title: 'New stock is booked in',
        text: 'A delivery of dresses arrives at the warehouse and is booked in, so every channel sees the new count.',
      },
      {
        title: 'A sale in the shop',
        text: 'A customer buys a dress in the shop, and the online store’s count drops with it.',
      },
      {
        title: 'A low-stock alert',
        text: 'Stock of that dress falls below the level you set, and the shop manager gets a low-stock alert.',
      },
      {
        title: 'A reorder is suggested',
        text: 'A reorder suggestion shows what to buy and how many, for the manager to check and approve.',
      },
      {
        title: 'The forecast looks ahead',
        text: 'AI reads the boutique’s sales history and forecasts demand, so purchases for the next season can be planned.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (6; each from catalogue 1E.3's list, §8 for the store platforms, 1K.1 for the
  // access rules)
  deliverables: {
    heading: 'What stock automation includes',
    items: [
      'Stock sync between your shop, warehouse and online store',
      'Connections to Shopify, WooCommerce or a custom online store',
      'Low-stock alerts for the items and levels you choose',
      'Automatic reorder suggestions, for you to check and approve',
      'AI demand forecasting from your sales history',
      'Access rules for who can see and change stock and sales data',
    ],
  },

  // 5 · Works with: names as text, only those catalogue §8 (E-commerce, Accounting & ERP, Messaging,
  // Automation) and 1F.5 ("POS") name. The accounting line is conditional ("if you keep stock in…"),
  // since which of them hold stock is a vendor fact. Lede: 54 words
  worksWith: {
    heading: 'Works with your store and accounts',
    lede: 'Sales can come from your online store on Shopify, WooCommerce or a custom build, and from your shop’s POS. If you keep stock in Odoo, Zoho Books, QuickBooks, Xero or SAP Business One, counts are read from there. Alerts reach you by WhatsApp or email, and the automation runs on n8n, Make or Zapier.',
    platforms: [
      'Shopify',
      'WooCommerce',
      'custom stores',
      'POS systems',
      'Odoo',
      'Zoho Books',
      'QuickBooks',
      'Xero',
      'SAP Business One',
      'WhatsApp Business API',
      'email',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? 1E.3 has no "Best for" line and no 7.5 row, so the fit follows from its
  // own list (stock in more than one place or channel; forecasting from sales history), with a
  // decision aid. Lede: 36 words
  fit: {
    heading: 'Is stock automation right for you?',
    lede: 'Inventory & Stock Automation suits any business that holds stock in more than one place, or sells it through more than one channel. These questions help you decide whether to start with sync, alerts or forecasting.',
    goodFit: [
      'Shops that also sell online and need one stock count for both',
      'Retailers with a warehouse or stockroom behind the shop floor',
      'Online stores on Shopify, WooCommerce or a custom build that hold their own stock',
    ],
    decisionAid: [
      {
        question: 'Have you sold an item online that was already out of stock?',
        answer: 'Then stock sync keeps the online store’s count in line with the shop and the warehouse.',
      },
      {
        question: 'Do you find out an item has run out when a customer asks for it?',
        answer: 'Then low-stock alerts tell you while there is still time to reorder.',
      },
      {
        question: 'Is reordering worked out by hand from shelf counts?',
        answer: 'Then reorder suggestions do the first draft, and your team approves what gets bought.',
      },
      {
        question: 'Do you sell from one place, with stock you can see at a glance?',
        answer:
          'Then a simple stock list may serve you for now, and the free AI audit will show where automation pays back first.',
      },
    ],
  },

  // 7 · Try it: left out (types.ts): no demo matches stock, so the hero shows the audit CTA alone

  // 8 · UAE specifics: Deepzeta AI's own practice only (1E.3: alerts and suggestions, never orders;
  // §8 and 1A.1: Arabic and English; 1K.1: retention and access rules). No VAT, customs or trade rules
  // until their citation rows are APPROVED.
  uae: {
    heading: 'Set up for UAE shops and stores',
    points: [
      'Alerts on WhatsApp: low-stock alerts and reorder suggestions reach your team on the channel it already uses, with email as a back-up.',
      'Arabic and English: item names are kept as written in either language, and alerts can go out in both.',
      'A person decides: reorder suggestions stay suggestions, and what gets bought is always your team’s call.',
      'Data rules from day one: who can see and change stock and sales records, and how long they are kept, agreed before launch.',
    ],
  },

  // 9 · Pairs well with: Task & Approval Workflows (1E.6: purchases with approval chains), the add-on
  // Procurement & Supplier Automation (1E.4: the buying after a reorder is approved; engine §3.1 lists
  // add-ons here) and Store Operations Automation (1I.1: the orders the stock serves). 1E.3 is in no
  // bundle (§5)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1E.6',
        line: 'Routes purchase requests through approval chains, with reminders for pending approvals and a full audit trail.',
      },
      {
        catalogueNumber: '1E.4',
        line: 'Compares supplier quotes, creates purchase orders and tracks each delivery, with approval steps for purchase requests.',
      },
      {
        catalogueNumber: '1I.1',
        line: 'Sends order, shipping and delivery updates by WhatsApp, and runs cash-on-delivery confirmations, returns and refunds.',
      },
    ],
  },

  faq: {
    heading: 'Questions about stock automation',
    lede: 'What shop and store owners ask first: cost, timing, systems, forecasts and who decides.',
  },
};
