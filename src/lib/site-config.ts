// Business facts for code (docs/ai/06 §3.2). Every value comes from docs/facts/company-facts.md and
// only CONFIRMED values appear; P4 extends this file. A fact that isn't confirmed yet is null, and
// whatever uses it hides itself.
export const siteConfig = {
  brandName: 'Deepzeta AI', // facts §1 (conflict C29)
  legalName: 'Deepzeta Digital Solutions L.L.C.', // facts §1 (decision D2)
  positioningLine: 'Deepzeta AI builds online growth for every business.', // facts §1
  email: 'hello@deepzeta.ai', // facts §2
} as const;
