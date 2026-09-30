// Navigation copy (P2 plan, I3 and N): the header nav and the mega menu and, from part C, the footer's
// columns, from one source. Service names are the Services Catalogue's, exactly (docs/ai/10 §2).
// Hrefs come from src/lib/routes.ts by registry ID, and an item renders only while its page is live
// (04 §1.4). Outcomes are one line, at most 8 words, written from each service's catalogue entry.
import type { Pillar, Tier2Name } from '@/components/icons/registry';
import type { RouteId } from '@/lib/routes';

export type NavLink = { route: RouteId; label: string };
export type MenuItem = { route: RouteId; name: string; outcome: string; icon?: Tier2Name };
export type MenuColumn = {
  pillar: Pillar;
  route: RouteId;
  name: string;
  promise: string;
  allLabel: string;
  items: readonly MenuItem[];
};
export type Navigation = {
  servicesLabel: string;
  primary: readonly NavLink[];
  columns: readonly MenuColumn[];
  solutions: { label: string; route: RouteId; items: readonly { route: RouteId; name: string }[] };
  rail: readonly NavLink[];
};

export const navigation = {
  // The mega menu's button (header.md)
  servicesLabel: 'Services',
  // The header's nav, in header.md's order after Services
  primary: [
    { route: 'R011', label: 'Automation' },
    { route: 'R140', label: 'Studio' },
    { route: 'R110', label: 'Deepzeta Sync' },
    { route: 'R150', label: 'Work' },
    { route: 'R152', label: 'Pricing' },
  ],
  // One column per pillar, in catalogue order, with the catalogue's promise line. Items: the lead
  // services; Websites and Software also list their core services (plan I3).
  columns: [
    {
      pillar: 'ai',
      route: 'R011',
      name: 'AI Automation',
      promise: 'Make the business run itself',
      allLabel: 'All AI Automation services',
      items: [
        {
          route: 'R020',
          name: 'WhatsApp AI Agent',
          outcome: 'Instant Arabic and English replies, around the clock',
          icon: 'whatsapp-ai-agent',
        },
        {
          route: 'R021',
          name: 'AI Voice Receptionist',
          outcome: 'Calls answered and appointments booked, even after hours',
          icon: 'ai-voice-receptionist',
        },
        {
          route: 'R027',
          name: 'Speed-to-Lead System',
          outcome: 'Every new lead gets a reply in seconds',
          icon: 'speed-to-lead-system',
        },
        {
          route: 'R029',
          name: 'Automated Quotation & Quote Tracking System',
          outcome: 'Enquiry to signed quote, with little manual work',
        },
        {
          route: 'R033',
          name: 'Booking Automation System',
          outcome: 'Customers book themselves, with no back-and-forth',
          icon: 'booking-automation-system',
        },
        {
          route: 'R038',
          name: 'Review & Reputation Automation',
          outcome: 'Review requests go out at the right moment',
        },
        {
          route: 'R045',
          name: 'UAE E-Invoicing Readiness & Integration',
          outcome: 'Get your invoicing data and systems ready',
        },
        {
          route: 'R051',
          name: 'AI Shopping Visibility (Agentic Commerce Readiness)',
          outcome: 'Your products, ready for AI assistants to recommend',
        },
      ],
    },
    {
      pillar: 'web',
      route: 'R012',
      name: 'Websites',
      promise: 'Custom-coded, high-performance sites built to rank and convert',
      allLabel: 'All Websites services',
      items: [
        {
          route: 'R060',
          name: 'Custom-Coded High-Performance Websites',
          outcome: 'Built to load fast and bring in business',
        },
        {
          route: 'R061',
          name: 'Landing Pages & Conversion Rate Optimisation (CRO)',
          outcome: 'Test what turns your ad clicks into leads',
        },
        {
          route: 'R062',
          name: 'E-Commerce Websites',
          outcome: 'Sell in Arabic and English, with UAE payments',
        },
        {
          route: 'R063',
          name: 'Website Redesign & Migration',
          outcome: 'Rebuild your site with redirects that protect SEO',
        },
      ],
    },
    {
      pillar: 'software',
      route: 'R013',
      name: 'Software',
      promise: 'Custom tools that scale',
      allLabel: 'All Software services',
      items: [
        {
          route: 'R064',
          name: 'Web Application Development',
          outcome: 'An app built around your business processes',
        },
        {
          route: 'R065',
          name: 'Client & Customer Portals',
          outcome: 'Customers see their quotes, invoices and job status',
        },
        {
          route: 'R066',
          name: 'Internal Tools & Admin Dashboards',
          outcome: 'Replace your spreadsheets with proper tools',
        },
        {
          route: 'R067',
          name: 'Custom Software Development',
          outcome: 'Industry-specific systems, connected to what you already use',
        },
      ],
    },
    {
      pillar: 'ranking',
      route: 'R014',
      name: 'Growth & Ranking',
      promise: 'Get found, get chosen',
      allLabel: 'All Growth & Ranking services',
      items: [
        {
          route: 'R068',
          name: 'AI Citation & Answer Engine Optimisation (AEO/GEO)',
          outcome: 'Help AI engines name and recommend your business',
        },
        {
          route: 'R070',
          name: 'Local AI Dominance (Bilingual, Hyperlocal)',
          outcome: 'Be found on local maps and AI search',
        },
        {
          route: 'R076',
          name: 'AI Ad Creative Production',
          outcome: 'Fresh ads to test, replaced when performance drops',
        },
      ],
    },
  ],
  // The six bundles (catalogue §5), names only
  solutions: {
    label: 'Solutions',
    route: 'R090',
    items: [
      { route: 'R091', name: 'AI Front Desk' },
      { route: 'R092', name: 'Quote-to-Cash System' },
      { route: 'R093', name: 'Get Found by AI' },
      { route: 'R094', name: 'E-Commerce Growth Engine' },
      { route: 'R095', name: 'Launch Pack' },
      { route: 'R096', name: 'E-Invoicing Ready' },
    ],
  },
  // The mega menu's side rail (header.md); "Try a live demo" comes with P7's demos
  rail: [
    { route: 'R110', label: 'Deepzeta Sync' },
    { route: 'R140', label: 'Studio' },
    { route: 'R003', label: 'About' },
    { route: 'R005', label: 'Contact' },
    { route: 'R120', label: 'Resources' },
  ],
} as const satisfies Navigation;
