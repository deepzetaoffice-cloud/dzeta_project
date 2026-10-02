// Lighthouse CI's second region profile (P3 plan, B8; conflicts C52 and C54): Home as a visitor from
// outside Europe, with no consent banner, and, once the owner's GTM container is set, with the tags
// granted by default. The first profile (lighthouserc.cjs) sends no country, which the site treats as
// Europe: the banner shows and nothing but GTM may load.
// - It runs on 127.0.0.1 rather than localhost, so lhci keeps its runs apart from the first profile's;
//   lighthouserc.cjs' assertMatrix holds its assertions, because `lhci assert` reads that file.
// - The npm script collects this profile with --additive, after the first.
// - The server and the number of runs are lighthouserc.cjs' own (kept equal by hand: a config file
//   can't import the other here, as the lint rules forbid require()).
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      // A campaign landing: the address carries a campaign tag and a click ID, so the capture code
      // (attribution.ts) loads as it does for paid traffic, and counts in the first load.
      url: ['http://127.0.0.1:3000/?utm_source=lhci&gclid=test'],
      numberOfRuns: 5,
      // Vercel's country header; next start applies the same header rules (src/lib/tracking/region.ts).
      settings: { extraHeaders: JSON.stringify({ 'x-vercel-ip-country': 'AE' }) },
    },
  },
};
