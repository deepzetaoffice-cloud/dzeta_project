// The tracking accounts' public IDs (P3 plan, J; the tracking guide §0: "Site settings: Claude enters
// what you send"). Each is null until the owner sends it, and a vendor whose ID is null is left out of
// the GTM container, the CSP and the cookie list (vendors.ts), so nothing of it can load. These are
// public IDs, never secrets. The GTM container ID itself is NEXT_PUBLIC_GTM_ID (env.ts): it differs
// per environment.
//
// Imported by scripts and next.config through Node's own TypeScript loader: keep relative imports with
// explicit `.ts` extensions and type-only syntax in this file.

export type Accounts = {
  // GA4 Measurement ID, G-…
  ga4MeasurementId: string | null;
  // Meta dataset (pixel) ID, digits
  metaDatasetId: string | null;
  // LinkedIn Insight Tag Partner ID, digits
  linkedinPartnerId: string | null;
  // LinkedIn's "Conversion ID for Google Tag Manager", per event the taxonomy marks `linkedin`
  linkedinConversionIds: { generate_lead: string | null };
  // Google Ads customer ID, 123-456-7890: only for the owner's linking steps (no Ads tag on the site, Q6)
  googleAdsCustomerId: string | null;
};

export const accounts: Accounts = {
  ga4MeasurementId: null,
  metaDatasetId: null,
  linkedinPartnerId: null,
  linkedinConversionIds: { generate_lead: null },
  googleAdsCustomerId: null,
};

// Each ID's shape, so a typo is caught by a test before it reaches a dashboard.
export const ACCOUNT_FORMATS = {
  ga4MeasurementId: /^G-[A-Z0-9]{6,12}$/,
  metaDatasetId: /^\d{10,20}$/,
  linkedinPartnerId: /^\d{4,12}$/,
  linkedinConversionId: /^\d{4,12}$/,
  googleAdsCustomerId: /^\d{3}-\d{3}-\d{4}$/,
} as const;
