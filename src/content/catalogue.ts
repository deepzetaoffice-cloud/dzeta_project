// The typed catalogue data (P4 plan, S2): pillars, services, starter offers and bundles from
// Planning Folder/For Ai/DeepZeta Services Catalogue.md v1.1 — the single source for service
// names, numbers, structure and priority tags (00 §4; 10 §2). Names are byte for byte the
// catalogue's, the full heading name (parentheticals included, e.g. "AI Readiness Assessment
// (paid, in-depth)"). This data is locale-independent: names are brand facts, not English copy —
// descriptions and "Best for" lines are page copy and arrive with each page's plan (P6+), never
// here. URLs follow the URL registry (docs/seo/url-registry.md): pillars, services and bundles
// carry their slug; starter offers carry their full path, because their pages share no prefix.
// tests/unit/catalogue.test.ts checks every value against the catalogue and the registry, so
// neither can drift. The industries and emirates (catalogue §7, the reserved pSEO patterns
// R200–R201) live in src/content/emirates-industries.ts (open question 1, option B; owner,
// 2026-10-04).

import type { Pillar } from '@/components/icons/registry';

// The catalogue's priority tags (§ "Priority tags used below"): 🔥 Lead (highest demand now;
// feature on the homepage), ⭐ Core (steady demand; full service page), ➕ Add-on (sold with
// another service), and ⏰ on E-Invoicing Ready (5.6), the catalogue's time-sensitive marker.
export type CatalogueTag = 'lead' | 'core' | 'addon' | 'timely';

// One of the four pillars (catalogue § "How the catalogue is organised"): service sections 1–4,
// each the promise of one logo pixel and one pillar page.
export type CataloguePillar = {
  /** The pillar's section number in the catalogue (1–4) */
  number: 1 | 2 | 3 | 4;
  name: string;
  /** The catalogue's one-line promise */
  promise: string;
  /** The logo pixel the pillar stands for (its token: --dz-pixel-<pixel>) */
  pixel: Pillar;
  /** The pillar page's slug: /services/<slug> (registry R011–R014) */
  slug: string;
};

// A service. Sections 1–4 belong to a pillar; section 6 (Ongoing care & add-ons) is cross-pillar,
// like the starter offers and bundles.
export type CatalogueService = {
  /** The catalogue's number, e.g. '1A.1' */
  number: string;
  /** The exact catalogue name (byte for byte) */
  name: string;
  /** Sections 1–4 only; cross-pillar services (section 6) leave it out */
  pillar?: Pillar;
  priority: CatalogueTag;
  /** /services/<slug> (registry §3.3–§3.4). Add-ons have no page in V1 (registry §3.4) and no slug. */
  slug?: string;
  /** The catalogue's flagship (2.1) */
  flagship?: true;
};

// A starter offer (catalogue §0), the entry points. Their pages don't share a URL prefix, so each
// carries its full path.
export type StarterOffer = {
  number: string;
  name: string;
  priority: CatalogueTag;
  /** The offer's page path, byte for byte its registry row (R002, R083, R111) */
  path: string;
};

// A bundle (catalogue §5) — a "solution" in the URL registry (§3.5).
export type CatalogueBundle = {
  number: string;
  name: string;
  priority: CatalogueTag;
  /** /solutions/<slug> (registry R091–R096) */
  slug: string;
  /** The bundled services' catalogue numbers, in the catalogue's order (§5's lists) */
  components: readonly string[];
};

// The four pillars, in catalogue order.
export const pillars = [
  {
    number: 1,
    name: 'AI Automation',
    promise: 'Make the business run itself',
    pixel: 'ai',
    slug: 'ai-automation',
  },
  {
    number: 2,
    name: 'Websites',
    promise: 'Custom-coded, high-performance sites built to rank and convert',
    pixel: 'web',
    slug: 'websites',
  },
  {
    number: 3,
    name: 'Software',
    promise: 'Custom tools that scale',
    pixel: 'software',
    slug: 'software',
  },
  {
    number: 4,
    name: 'Growth & Ranking',
    promise: 'Get found, get chosen',
    pixel: 'ranking',
    slug: 'growth-ranking',
  },
] as const satisfies readonly CataloguePillar[];

// The catalogue's sub-groups ("### 1A. AI Agents & Assistants"), names byte for byte, in catalogue
// order (the P6 part A plan, S10: the services hub's directories). Websites (2) and Software (3)
// list their services directly, with no sub-groups. A service's sub-group is its number's prefix
// before the dot: 1B.1 → 1B.
export type CatalogueSubgroup = { code: string; name: string; pillar: Pillar };

export const subgroups = [
  { code: '1A', name: 'AI Agents & Assistants', pillar: 'ai' },
  { code: '1B', name: 'Sales & Lead Automation', pillar: 'ai' },
  { code: '1C', name: 'Booking & Scheduling Automation', pillar: 'ai' },
  { code: '1D', name: 'Customer Service & Retention Automation', pillar: 'ai' },
  { code: '1E', name: 'Operations & Field Service Automation', pillar: 'ai' },
  { code: '1F', name: 'Finance & Admin Automation', pillar: 'ai' },
  { code: '1G', name: 'HR & Team Automation', pillar: 'ai' },
  { code: '1H', name: 'Marketing Automation', pillar: 'ai' },
  { code: '1I', name: 'E-Commerce Automation', pillar: 'ai' },
  { code: '1J', name: 'Data, Reporting & AI Insights', pillar: 'ai' },
  { code: '1K', name: 'AI Governance & Compliance', pillar: 'ai' },
  { code: '4A', name: 'Search & AI Visibility', pillar: 'ranking' },
  { code: '4B', name: 'Performance Marketing (Paid Ads)', pillar: 'ranking' },
  { code: '4C', name: 'Social Media & Content', pillar: 'ranking' },
  { code: '4D', name: 'Brand & Strategy', pillar: 'ranking' },
  { code: '4E', name: 'Full-Funnel Growth System', pillar: 'ranking' },
] as const satisfies readonly CatalogueSubgroup[];

/** The sub-group a service number belongs to (1B.1 → 1B), or undefined for 2.x and 3.x */
export const subgroupOf = (serviceNumber: string) =>
  subgroups.find((group) => serviceNumber.startsWith(`${group.code}.`));

// Every service, in catalogue order: sections 1–4 by pillar, then the cross-pillar section 6.
export const services = [
  // §1 AI Automation
  {
    number: '1A.1',
    name: 'WhatsApp AI Agent',
    pillar: 'ai',
    priority: 'lead',
    slug: 'whatsapp-ai-agent',
  },
  {
    number: '1A.2',
    name: 'AI Voice Receptionist',
    pillar: 'ai',
    priority: 'lead',
    slug: 'ai-voice-receptionist',
  },
  {
    number: '1A.3',
    name: 'AI Outbound Calling Agent',
    pillar: 'ai',
    priority: 'core',
    slug: 'ai-outbound-calling-agent',
  },
  {
    number: '1A.4',
    name: 'Website AI Chat Agent',
    pillar: 'ai',
    priority: 'core',
    slug: 'website-ai-chat-agent',
  },
  {
    number: '1A.5',
    name: 'Omnichannel Inbox AI',
    pillar: 'ai',
    priority: 'core',
    slug: 'omnichannel-inbox-ai',
  },
  {
    number: '1A.6',
    name: 'Internal Knowledge Assistant',
    pillar: 'ai',
    priority: 'core',
    slug: 'internal-knowledge-assistant',
  },
  {
    number: '1A.7',
    name: 'Custom AI Agents',
    pillar: 'ai',
    priority: 'core',
    slug: 'custom-ai-agents',
  },
  {
    number: '1B.1',
    name: 'Speed-to-Lead System',
    pillar: 'ai',
    priority: 'lead',
    slug: 'speed-to-lead-system',
  },
  {
    number: '1B.2',
    name: 'AI Lead Qualification & Scoring',
    pillar: 'ai',
    priority: 'core',
    slug: 'ai-lead-qualification-scoring',
  },
  {
    number: '1B.3',
    name: 'Automated Quotation & Quote Tracking System',
    pillar: 'ai',
    priority: 'lead',
    slug: 'automated-quotation-tracking',
  },
  {
    number: '1B.4',
    name: 'Proposal Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'proposal-automation',
  },
  {
    number: '1B.5',
    name: 'Sales Follow-Up & Nurture Sequences',
    pillar: 'ai',
    priority: 'core',
    slug: 'sales-follow-up-nurture',
  },
  {
    number: '1B.6',
    name: 'CRM Setup & Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'crm-setup-automation',
  },
  {
    number: '1B.7',
    name: 'AI Sales Prospecting & Outreach',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1C.1',
    name: 'Booking Automation System',
    pillar: 'ai',
    priority: 'lead',
    slug: 'booking-automation-system',
  },
  {
    number: '1C.2',
    name: 'Appointment Reminder & No-Show Reduction',
    pillar: 'ai',
    priority: 'core',
    slug: 'appointment-reminders-no-show-reduction',
  },
  {
    number: '1C.3',
    name: 'Viewing & Site-Visit Scheduling',
    pillar: 'ai',
    priority: 'core',
    slug: 'viewing-site-visit-scheduling',
  },
  {
    number: '1C.4',
    name: 'Event & Webinar Registration Automation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1C.5',
    name: 'Table & Reservation Automation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1D.1',
    name: 'AI Customer Support Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'ai-customer-support-automation',
  },
  {
    number: '1D.2',
    name: 'Ticketing & Complaint Tracking System',
    pillar: 'ai',
    priority: 'core',
    slug: 'ticketing-complaint-tracking',
  },
  {
    number: '1D.3',
    name: 'Review & Reputation Automation',
    pillar: 'ai',
    priority: 'lead',
    slug: 'review-reputation-automation',
  },
  {
    number: '1D.4',
    name: 'Loyalty, Renewal & Win-Back Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'loyalty-renewal-win-back-automation',
  },
  {
    number: '1D.5',
    name: 'Customer Onboarding Automation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1E.1',
    name: 'Job & Work-Order Management Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'job-work-order-management',
  },
  {
    number: '1E.2',
    name: 'Maintenance Contract & Preventive Maintenance Scheduling',
    pillar: 'ai',
    priority: 'core',
    slug: 'preventive-maintenance-scheduling',
  },
  {
    number: '1E.3',
    name: 'Inventory & Stock Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'inventory-stock-automation',
  },
  {
    number: '1E.4',
    name: 'Procurement & Supplier Automation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1E.5',
    name: 'Delivery & Logistics Tracking',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1E.6',
    name: 'Task & Approval Workflows',
    pillar: 'ai',
    priority: 'core',
    slug: 'task-approval-workflows',
  },
  {
    number: '1F.1',
    name: 'Invoicing & Payment Collection Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'invoicing-payment-collection',
  },
  {
    number: '1F.2',
    name: 'UAE E-Invoicing Readiness & Integration',
    pillar: 'ai',
    priority: 'lead',
    slug: 'uae-e-invoicing',
  },
  {
    number: '1F.3',
    name: 'Document & Invoice Data Extraction (AI OCR)',
    pillar: 'ai',
    priority: 'core',
    slug: 'ai-document-data-extraction',
  },
  {
    number: '1F.4',
    name: 'Expense & Receipt Automation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1F.5',
    name: 'Accounting Sync & Reconciliation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1F.6',
    name: 'Contract Generation & E-Signature',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1G.1',
    name: 'Recruitment Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'recruitment-automation',
  },
  {
    number: '1G.2',
    name: 'Employee Onboarding & Offboarding',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1G.3',
    name: 'Attendance, Leave & HR Requests',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1H.1',
    name: 'Email & WhatsApp Marketing Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'email-whatsapp-marketing-automation',
  },
  {
    number: '1H.2',
    name: 'AI Content Engine',
    pillar: 'ai',
    priority: 'core',
    slug: 'ai-content-engine',
  },
  {
    number: '1H.3',
    name: 'Social Media Automation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1H.4',
    name: 'Google Business Profile Automation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1I.1',
    name: 'Store Operations Automation',
    pillar: 'ai',
    priority: 'core',
    slug: 'store-operations-automation',
  },
  {
    number: '1I.2',
    name: 'AI Shopping Visibility (Agentic Commerce Readiness)',
    pillar: 'ai',
    priority: 'lead',
    slug: 'ai-shopping-visibility',
  },
  {
    number: '1I.3',
    name: 'Product Content Automation',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1J.1',
    name: 'Automated Business Dashboards',
    pillar: 'ai',
    priority: 'core',
    slug: 'automated-business-dashboards',
  },
  {
    number: '1J.2',
    name: 'Weekly AI Business Summary',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1J.3',
    name: 'Call Tracking & Conversation Analytics',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1K.1',
    name: 'AI Compliance Setup (UAE PDPL)',
    pillar: 'ai',
    priority: 'addon',
  },
  {
    number: '1K.2',
    name: 'AI Policy & Staff Guidelines',
    pillar: 'ai',
    priority: 'addon',
  },
  // §2 Websites
  {
    number: '2.1',
    name: 'Custom-Coded High-Performance Websites',
    pillar: 'web',
    priority: 'lead',
    slug: 'custom-coded-websites',
    flagship: true,
  },
  {
    number: '2.2',
    name: 'Landing Pages & Conversion Rate Optimisation (CRO)',
    pillar: 'web',
    priority: 'core',
    slug: 'landing-pages-cro',
  },
  {
    number: '2.3',
    name: 'E-Commerce Websites',
    pillar: 'web',
    priority: 'core',
    slug: 'ecommerce-websites',
  },
  {
    number: '2.4',
    name: 'Website Redesign & Migration',
    pillar: 'web',
    priority: 'core',
    slug: 'website-redesign-migration',
  },
  {
    number: '2.5',
    name: 'Website Care Plan',
    pillar: 'web',
    priority: 'addon',
  },
  // §3 Software
  {
    number: '3.1',
    name: 'Web Application Development',
    pillar: 'software',
    priority: 'core',
    slug: 'web-application-development',
  },
  {
    number: '3.2',
    name: 'Client & Customer Portals',
    pillar: 'software',
    priority: 'core',
    slug: 'client-customer-portals',
  },
  {
    number: '3.3',
    name: 'Internal Tools & Admin Dashboards',
    pillar: 'software',
    priority: 'core',
    slug: 'internal-tools-admin-dashboards',
  },
  {
    number: '3.4',
    name: 'Custom Software Development',
    pillar: 'software',
    priority: 'core',
    slug: 'custom-software-development',
  },
  {
    number: '3.5',
    name: 'Mobile Apps',
    pillar: 'software',
    priority: 'addon',
  },
  {
    number: '3.6',
    name: 'SaaS Product Development',
    pillar: 'software',
    priority: 'addon',
  },
  // §4 Growth & Ranking
  {
    number: '4A.1',
    name: 'AI Citation & Answer Engine Optimisation (AEO/GEO)',
    pillar: 'ranking',
    priority: 'lead',
    slug: 'ai-citation-aeo-geo',
  },
  {
    number: '4A.2',
    name: 'Programmatic SEO (pSEO)',
    pillar: 'ranking',
    priority: 'core',
    slug: 'programmatic-seo',
  },
  {
    number: '4A.3',
    name: 'Local AI Dominance (Bilingual, Hyperlocal)',
    pillar: 'ranking',
    priority: 'lead',
    slug: 'local-ai-dominance',
  },
  {
    number: '4A.4',
    name: 'Performance SEO Retainer',
    pillar: 'ranking',
    priority: 'core',
    slug: 'performance-seo-retainer',
  },
  {
    number: '4A.5',
    name: 'Technical SEO & Schema Audit',
    pillar: 'ranking',
    priority: 'addon',
  },
  {
    number: '4B.1',
    name: 'Google Ads',
    pillar: 'ranking',
    priority: 'core',
    slug: 'google-ads',
  },
  {
    number: '4B.2',
    name: 'Meta Ads (Facebook & Instagram)',
    pillar: 'ranking',
    priority: 'core',
    slug: 'meta-ads',
  },
  {
    number: '4B.3',
    name: 'TikTok & Snapchat Ads',
    pillar: 'ranking',
    priority: 'core',
    slug: 'tiktok-snapchat-ads',
  },
  {
    number: '4B.4',
    name: 'LinkedIn Ads (B2B)',
    pillar: 'ranking',
    priority: 'core',
    slug: 'linkedin-ads',
  },
  {
    number: '4B.5',
    name: 'Microsoft, Pinterest & Yandex Ads',
    pillar: 'ranking',
    priority: 'addon',
  },
  {
    number: '4B.6',
    name: 'AI Ad Creative Production',
    pillar: 'ranking',
    priority: 'lead',
    slug: 'ai-ad-creative',
  },
  {
    number: '4C.1',
    name: 'Social Media Management',
    pillar: 'ranking',
    priority: 'core',
    slug: 'social-media-management',
  },
  {
    number: '4C.2',
    name: 'Content Creation',
    pillar: 'ranking',
    priority: 'core',
    slug: 'content-creation',
  },
  {
    number: '4C.3',
    name: 'Graphic Design',
    pillar: 'ranking',
    priority: 'core',
    slug: 'graphic-design',
  },
  {
    number: '4C.4',
    name: 'Influencer Marketing: Planning & Execution',
    pillar: 'ranking',
    priority: 'core',
    slug: 'influencer-marketing',
  },
  {
    number: '4D.1',
    name: 'Branding & Positioning',
    pillar: 'ranking',
    priority: 'core',
    slug: 'branding-positioning',
  },
  {
    number: '4D.2',
    name: 'Insights & Growth Strategy',
    pillar: 'ranking',
    priority: 'core',
    slug: 'growth-strategy',
  },
  // §6 Ongoing care & add-ons (cross-pillar; 4E, the Full-Funnel Growth System, is a section of
  // the Growth & Ranking pillar page, not a service — registry §3.4 note)
  {
    number: '6.1',
    name: 'AI Ops Retainer',
    priority: 'core',
    slug: 'ai-ops-retainer',
  },
  {
    number: '6.2',
    name: 'AI Training for Teams',
    priority: 'addon',
  },
  {
    number: '6.3',
    name: 'Analytics & Tracking Setup',
    priority: 'addon',
  },
  {
    number: '6.4',
    name: 'Priority Support',
    priority: 'addon',
  },
] as const satisfies readonly CatalogueService[];

// The starter offers (§0), the entry points for every client.
export const starterOffers = [
  {
    number: '0.1',
    name: 'Free AI Automation Audit',
    priority: 'lead',
    path: '/free-ai-audit',
  },
  {
    number: '0.2',
    name: 'AI Readiness Assessment (paid, in-depth)',
    priority: 'core',
    path: '/services/ai-readiness-assessment',
  },
  {
    number: '0.3',
    name: 'Website & AI Search Health Check',
    priority: 'core',
    path: '/tools/website-ai-search-health-check',
  },
] as const satisfies readonly StarterOffer[];

// The bundles (§5), the packaged solutions.
export const bundles = [
  {
    number: '5.1',
    name: 'AI Front Desk',
    priority: 'lead',
    slug: 'ai-front-desk',
    components: ['1A.1', '1A.2', '1C.1', '1B.1', '1B.6'],
  },
  {
    number: '5.2',
    name: 'Quote-to-Cash System',
    priority: 'lead',
    slug: 'quote-to-cash-system',
    components: ['1B.3', '1E.1', '1F.1', '1D.3'],
  },
  {
    number: '5.3',
    name: 'Get Found by AI',
    priority: 'lead',
    slug: 'get-found-by-ai',
    components: ['4A.1', '4A.3', '4A.5', '1H.4'],
  },
  {
    number: '5.4',
    name: 'E-Commerce Growth Engine',
    priority: 'core',
    slug: 'ecommerce-growth-engine',
    components: ['1I.1', '1I.2', '1H.1', '4B.1', '4B.2', '4B.6'],
  },
  {
    number: '5.5',
    name: 'Launch Pack',
    priority: 'core',
    slug: 'launch-pack',
    components: ['4D.1', '2.1', '4A.3', '1A.1'],
  },
  {
    number: '5.6',
    name: 'E-Invoicing Ready',
    priority: 'timely',
    slug: 'e-invoicing-ready',
    components: ['1F.2', '1F.3', '1F.5'],
  },
] as const satisfies readonly CatalogueBundle[];
