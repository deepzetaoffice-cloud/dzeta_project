// The shared emirates and industries data (P4 plan, S2; open question 1, option B — owner,
// 2026-10-04): the fourth data module alongside src/content/catalogue.ts, for the pages that
// read geography — the industries hub and groups (P6), the industry pages and industry × emirate
// pSEO pages (reserved R200–R201, P12), and any schema `areaServed` beyond the country level.
// Locale-independent typed data: industry names are catalogue facts (§7, byte for byte), not
// English copy — page copy arrives with each page's plan. tests/unit/emirates-industries.test.ts
// checks the groups and industries against the catalogue and the URL registry, so neither can
// drift.
//
// The emirates list is the UAE's seven emirates. Nothing on the site reads it until the industry
// pages (P6) and pSEO (P12), and the list is re-verified against the UAE government portal
// (u.ae) when the first page that shows it ships — the same precedent as Wikidata's UAE entity
// in the schema spec §2.1: verified online at build time, never from memory alone.

// One of the four industry groups (catalogue §7.1–§7.4), each an industry-group page.
export type IndustryGroup = {
  /** The catalogue's section number, e.g. '7.1' */
  number: string;
  /** The group's exact catalogue name, e.g. 'B2B, Corporate & Tech' */
  name: string;
  /** /industries/<slug> (registry R101–R104; compound, so single-industry slugs can't collide) */
  slug: string;
};

// One of the 27 individual industries (catalogue §7.1–§7.4 lists), the reserved pSEO dimension
// R200. Slugs follow registry §1.1 (kebab-case from the exact name, '&' dropped).
export type Industry = {
  /** The group's catalogue number ('7.1'–'7.4') */
  group: string;
  /** The exact catalogue name from its group's list */
  name: string;
  /** /industries/<slug> — reserved R200; pages only from P12 (registry §4) */
  slug: string;
};

// One of the UAE's seven emirates — the reserved pSEO dimension R201 (industry × emirate).
export type EmiratesEntry = {
  name: string;
  slug: string;
};

// One row of the catalogue's §7.5 table, "Best-fit automations by industry". `label` is the
// table's first cell byte for byte; `industries` are the individual industries the row covers
// (by slug); `automations` are catalogue numbers, in the table's order — services, and bundles
// where the table names one (Quote-to-Cash System, 5.2). The table names services informally
// ("AMC Scheduling", "Service-Due Reminders"); each number below is that service's registry row,
// and the informal name → number mapping is noted where it isn't the exact name.
export type BestFitAutomation = {
  label: string;
  industries: readonly string[];
  automations: readonly string[];
};

// The four industry groups, in catalogue order.
export const industryGroups = [
  { number: '7.1', name: 'B2B, Corporate & Tech', slug: 'b2b-corporate-tech' },
  { number: '7.2', name: 'E-Commerce & Consumer Brands', slug: 'ecommerce-consumer-brands' },
  { number: '7.3', name: 'Real Estate, Construction & Professional', slug: 'real-estate-construction-professional' },
  { number: '7.4', name: 'Local, Medical & Field Services', slug: 'local-medical-field-services' },
] as const satisfies readonly IndustryGroup[];

// The 27 individual industries, in catalogue order (each group's §7.x list, in its order).
export const industries = [
  // §7.1 B2B, Corporate & Tech
  { group: '7.1', name: 'B2B Corporate', slug: 'b2b-corporate' },
  { group: '7.1', name: 'SaaS & Software', slug: 'saas-software' },
  { group: '7.1', name: 'Cybersecurity', slug: 'cybersecurity' },
  { group: '7.1', name: 'Manufacturing', slug: 'manufacturing' },
  { group: '7.1', name: 'Logistics & Freight', slug: 'logistics-freight' },
  { group: '7.1', name: 'Renewable Energy & Solar', slug: 'renewable-energy-solar' },
  { group: '7.1', name: 'Recruitment & Staffing', slug: 'recruitment-staffing' },
  // §7.2 E-Commerce & Consumer Brands
  { group: '7.2', name: 'E-Commerce', slug: 'ecommerce' },
  { group: '7.2', name: 'Beauty & Cosmetics', slug: 'beauty-cosmetics' },
  { group: '7.2', name: 'Luxury & Fine Jewellery', slug: 'luxury-fine-jewellery' },
  { group: '7.2', name: 'Travel Agencies', slug: 'travel-agencies' },
  { group: '7.2', name: 'Hospitality & Fine Dining', slug: 'hospitality-fine-dining' },
  { group: '7.2', name: 'Event Management & Venues', slug: 'event-management-venues' },
  // §7.3 Real Estate, Construction & Professional
  { group: '7.3', name: 'Real Estate', slug: 'real-estate' },
  { group: '7.3', name: 'Construction', slug: 'construction' },
  { group: '7.3', name: 'Interior Fit-Out', slug: 'interior-fit-out' },
  { group: '7.3', name: 'Law Firms', slug: 'law-firms' },
  { group: '7.3', name: 'Education', slug: 'education' },
  { group: '7.3', name: 'Fintech & Financial Services', slug: 'fintech-financial-services' },
  // §7.4 Local, Medical & Field Services
  { group: '7.4', name: 'Healthcare', slug: 'healthcare' },
  { group: '7.4', name: 'Dentists', slug: 'dentists' },
  { group: '7.4', name: 'Technical Services', slug: 'technical-services' },
  { group: '7.4', name: 'Building Maintenance', slug: 'building-maintenance' },
  { group: '7.4', name: 'Facility Management', slug: 'facility-management' },
  { group: '7.4', name: 'Automotive', slug: 'automotive' },
  { group: '7.4', name: 'Fitness & Gyms', slug: 'fitness-gyms' },
  { group: '7.4', name: 'Pet Care & Veterinary Clinics', slug: 'pet-care-veterinary-clinics' },
] as const satisfies readonly Industry[];

// The UAE's seven emirates — the R201 pSEO dimension. See the file header: re-verified against
// u.ae when the first page that shows them ships.
export const emirates = [
  { name: 'Abu Dhabi', slug: 'abu-dhabi' },
  { name: 'Dubai', slug: 'dubai' },
  { name: 'Sharjah', slug: 'sharjah' },
  { name: 'Ajman', slug: 'ajman' },
  { name: 'Umm Al Quwain', slug: 'umm-al-quwain' },
  { name: 'Ras Al Khaimah', slug: 'ras-al-khaimah' },
  { name: 'Fujairah', slug: 'fujairah' },
] as const satisfies readonly EmiratesEntry[];

// The §7.5 best-fit table, in the catalogue's row order. Informal names → numbers:
// "Viewing Scheduling" is 1C.3; "AMC Scheduling" is 1E.2 (annual maintenance contracts);
// "Service-Due Reminders" is 1D.4 (renewal and service-due reminders); "Enquiry Speed-to-Lead"
// is 1B.1; "Nurture Sequences" is 1B.5; "Client Portal" is 3.2; "Document Extraction" is 1F.3;
// "Contract Generation" is 1F.6; "Quote-to-Cash System" is the bundle 5.2.
export const bestFitAutomations = [
  {
    label: 'Real Estate',
    industries: ['real-estate'],
    automations: ['1B.1', '1A.1', '1C.3', '1B.6'],
  },
  {
    label: 'Healthcare & Dentists',
    industries: ['healthcare', 'dentists'],
    automations: ['1A.2', '1C.1', '1C.2', '1D.3'],
  },
  {
    label: 'Technical Services & Facility Management',
    industries: ['technical-services', 'building-maintenance', 'facility-management'],
    automations: ['5.2', '1E.1', '1E.2'],
  },
  {
    label: 'Construction & Interior Fit-Out',
    industries: ['construction', 'interior-fit-out'],
    automations: ['1B.3', '1B.4', '3.2'],
  },
  {
    label: 'E-Commerce & Beauty',
    industries: ['ecommerce', 'beauty-cosmetics'],
    automations: ['1I.2', '1I.1', '4B.6'],
  },
  {
    label: 'Hospitality & Restaurants',
    industries: ['hospitality-fine-dining'],
    automations: ['1C.5', '1D.3', '1A.1'],
  },
  {
    label: 'Education & Training',
    industries: ['education'],
    automations: ['1B.1', '1C.4', '1B.5'],
  },
  {
    label: 'Law Firms & Professional Services',
    industries: ['law-firms'],
    automations: ['1A.4', '1C.1', '1F.3', '1F.6'],
  },
  {
    label: 'Automotive',
    industries: ['automotive'],
    automations: ['1C.1', '1A.2', '1D.4'],
  },
  {
    label: 'Fitness & Gyms',
    industries: ['fitness-gyms'],
    automations: ['1C.1', '1D.4', '1A.1'],
  },
  {
    label: 'Recruitment & Staffing',
    industries: ['recruitment-staffing'],
    automations: ['1G.1', '1B.7', '1B.6'],
  },
  {
    label: 'Logistics & Freight',
    industries: ['logistics-freight'],
    automations: ['1E.5', '1B.3', '1A.7'],
  },
] as const satisfies readonly BestFitAutomation[];
