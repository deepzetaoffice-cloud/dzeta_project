// The tracking vendors (P3 plan, E and K): each one's consent group and the hosts it loads from or
// sends to. The CSP allows exactly the hosts of the vendors in use (security-headers.ts), the cookie
// list in Cookie settings names exactly their cookies, and the GTM container holds exactly their tags,
// so the site, the policy and the container can't name different tools (the pre-launch register's
// privacy row). A vendor is in use when its ID is set: GTM by NEXT_PUBLIC_GTM_ID, the rest in
// accounts.ts. Each vendor's cookies are added from its official pages, with external-sources.md rows.
//
// Imported by scripts and next.config through Node's own TypeScript loader: keep relative imports with
// explicit `.ts` extensions and type-only syntax in this file.
import type { Accounts } from './accounts.ts';

export type ConsentGroup = 'essential' | 'analytics' | 'marketing';
export type VendorId = 'gtm' | 'gtm_preview' | 'ga4' | 'meta' | 'microsoft' | 'linkedin';
export type CspHosts = {
  script?: readonly string[];
  style?: readonly string[];
  img?: readonly string[];
  font?: readonly string[];
  connect?: readonly string[];
  frame?: readonly string[];
};
// A first-party cookie a vendor sets, as Cookie settings lists it, from the vendor's own page. `approved`
// once its row in docs/facts/external-sources.md is APPROVED: only then is it shown (00 §4).
export type VendorCookie = { name: string; lifetimeMonths: number; source: string; approved: boolean };
export type Vendor = {
  id: VendorId;
  name: string;
  group: ConsentGroup;
  hosts: CspHosts;
  // Where the hosts come from
  source: string;
  // Listed in Cookie settings while the vendor is in use, each once approved. Until then the group's
  // own text names the tool (consent-copy.md §2), and its cookies are read from its own page and
  // proposed in external-sources.md.
  cookies?: readonly VendorCookie[];
  // Deleted when the visitor switches the vendor's group off (consent.ts). Deleting a cookie that
  // isn't there does nothing, so this list may be wider than `cookies`.
  withdraw?: readonly (string | RegExp)[];
};

const GTM = 'https://www.googletagmanager.com';
const GA_COOKIES = 'https://support.google.com/analytics/answer/11397207';

export const VENDORS: readonly Vendor[] = [
  {
    id: 'gtm',
    name: 'Google Tag Manager',
    // It loads the other tags and holds none of a visitor's data itself (07 §2: GTM alone before consent)
    group: 'essential',
    hosts: { script: [GTM], img: [GTM], connect: [GTM, 'https://www.google.com'], frame: [GTM] },
    source: 'https://developers.google.com/tag-platform/security/guides/csp (Tag Manager without a nonce)',
  },
  {
    // Tag Assistant's preview, used by the owner's Part B tests; it loads only in a preview session.
    // Google also lists its two Google Fonts hosts, for the preview badge's typeface. They're left out:
    // no Google Fonts host appears anywhere in src/ (05 §3, lesson 1; check:tokens), and the badge works
    // in a fallback font, so a preview session logs two blocked font requests and nothing else.
    id: 'gtm_preview',
    name: 'Google Tag Manager preview',
    group: 'essential',
    hosts: {
      script: ['https://tagmanager.google.com'],
      style: [GTM, 'https://tagmanager.google.com'],
      img: ['https://ssl.gstatic.com', 'https://www.gstatic.com'],
    },
    source: 'https://developers.google.com/tag-platform/security/guides/csp (Preview mode)',
  },
  {
    // Without Google signals (the tracking guide A3.9): turning them on adds Google's ads-feature hosts
    id: 'ga4',
    name: 'Google Analytics',
    group: 'analytics',
    hosts: {
      script: [GTM],
      img: [GTM, 'https://*.google-analytics.com'],
      connect: [GTM, 'https://*.google-analytics.com', 'https://*.google.com'],
    },
    source: 'https://developers.google.com/tag-platform/security/guides/csp (Google Analytics without ads features)',
    cookies: [
      // PROPOSED in external-sources.md at C4; shown once the owner approves the row
      { name: '_ga', lifetimeMonths: 24, source: GA_COOKIES, approved: false },
      { name: '_ga_<container-id>', lifetimeMonths: 24, source: GA_COOKIES, approved: false },
    ],
    withdraw: ['_ga', /^_ga_/],
  },
  {
    // Meta publishes no CSP list: these are the hosts its own base code loads from and sends to
    id: 'meta',
    name: 'Meta Pixel',
    group: 'marketing',
    hosts: {
      script: ['https://connect.facebook.net'],
      img: ['https://www.facebook.com'],
      connect: ['https://www.facebook.com', 'https://connect.facebook.net'],
    },
    source: 'https://www.facebook.com/business/help/1021909254506499 (the base code)',
    withdraw: ['_fbp', '_fbc'],
  },
  {
    // Microsoft publishes no CSP list: this is the host its own tag code loads from
    // ("The tag code loads //bat.bing.com/bat.js", learn.microsoft.com, hlp_ba_conc_uet_consent).
    // bat.bing.net appears only in a Microsoft Q&A answer, not in its documentation, so it's left out;
    // if C5's tests show another host, it needs an official source or the owner's OK (plan finding 11).
    id: 'microsoft',
    name: 'Microsoft Advertising (UET)',
    group: 'marketing',
    hosts: { script: ['https://bat.bing.com'], img: ['https://bat.bing.com'], connect: ['https://bat.bing.com'] },
    source: 'https://learn.microsoft.com/en-us/microsoft-advertising/entitlements/hlp_ba_conc_uet_consent (the tag code)',
    // Deleted when Marketing is switched off: the first-party names from Microsoft's consent FAQ
    // (hlp_ba_conc_uet_consentfaq). No `cookies` list: Microsoft's pages give no lifetimes for them, and
    // MUID and MSPTC are Bing's own cookies, which the site can't delete anyway; Cookie settings shows a
    // vendor's cookies only once their external-sources.md row is approved (plan finding 12), so
    // Microsoft's stay hidden until an official source gives lifetimes.
    withdraw: ['_uetsid', '_uetvid', '_uetsid_exp', '_uetvid_exp'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Insight Tag',
    group: 'marketing',
    hosts: {
      script: ['https://snap.licdn.com'],
      img: ['https://px.ads.linkedin.com', 'https://px4.ads.linkedin.com', 'https://dc.ads.linkedin.com'],
      connect: [
        'https://px.ads.linkedin.com',
        'https://px4.ads.linkedin.com',
        'https://dc.ads.linkedin.com',
        'https://p.adsymptotic.com',
        'https://cdn.linkedin.oribi.io',
        'https://gw.linkedin.oribi.io',
        'https://sjs.bizographics.com',
      ],
    },
    source: 'https://www.linkedin.com/help/lms/answer/a425696 (the domains not to block)',
    withdraw: ['li_fat_id'],
  },
];

// A visitor's groups: the cookies to delete when each is switched off (every vendor, used or not).
export const withdrawnCookies = (group: Exclude<ConsentGroup, 'essential'>) =>
  VENDORS.filter((vendor) => vendor.group === group).flatMap((vendor) => vendor.withdraw ?? []);

// The vendors in use: GTM (and its preview) when the site loads GTM; the rest when their ID is set and
// GTM is there to load them.
export function vendorsInUse({ gtm }: { gtm: boolean }, ids: Accounts): Vendor[] {
  if (!gtm) return [];
  const set: Record<VendorId, boolean> = {
    gtm: true,
    gtm_preview: true,
    ga4: ids.ga4MeasurementId !== null,
    meta: ids.metaDatasetId !== null,
    microsoft: ids.microsoftUetTagId !== null,
    linkedin: ids.linkedinPartnerId !== null,
  };
  return VENDORS.filter((vendor) => set[vendor.id]);
}
