import { describe, expect, it } from 'vitest';
import {
  checkRuns,
  FIRST_LOAD_LIMIT,
  FIRST_PARTY_JS_LIMIT,
  firstLoadBytes,
  jsLimitFor,
  limitFor,
  partyBytes,
  REVIEW_FIRST_LOAD_LIMIT,
  THIRD_PARTY_LIMITS,
  thirdPartyLimitFor,
} from '../../scripts/check-page-weight.mjs';

// The page-weight gate (07 §2; decisions 0014 and 0021; C54, C57): first-party bytes only, from each
// run's list of requests, against each page's limits.

type Request = { url: string; resourceType: string; transferSize: number };

// A Lighthouse result with only the parts the gate reads: the page's address and its requests.
function lhr(requests: Request[], url = 'http://localhost:3000/') {
  return { finalDisplayedUrl: url, audits: { 'network-requests': { details: { items: requests } } } };
}
const own = (resourceType: string, transferSize: number, path = '/x', origin = 'http://localhost:3000'): Request => ({
  url: `${origin}${path}`,
  resourceType,
  transferSize,
});
const page = (document: number, stylesheet: number, script: number, extra: Request[] = [], url?: string) => {
  const origin = url ? new URL(url).origin : undefined;
  return lhr(
    [
      own('Document', document, '/', origin),
      own('Stylesheet', stylesheet, '/x', origin),
      own('Script', script, '/y', origin),
      ...extra,
    ],
    url,
  );
};

describe('check:page-weight', () => {
  it('adds the own origin’s HTML, CSS and JS, and leaves fonts, images and data: URLs out', () => {
    const result = page(3000, 3500, 140000, [
      own('Font', 38000),
      own('Image', 9000),
      { url: 'data:image/png;base64,AAAA', resourceType: 'Image', transferSize: 0 },
    ]);
    expect(firstLoadBytes(result)).toBe(146500);
  });

  it('counts other origins as third party, never against the first-party limits', () => {
    const gtm = {
      url: 'https://www.googletagmanager.com/gtm.js?id=GTM-X',
      resourceType: 'Script',
      transferSize: 90000,
    };
    const result = page(3000, 3500, 140000, [gtm]);
    expect(partyBytes(result)).toEqual({
      first: { document: 3000, stylesheet: 3500, script: 140000 },
      third: { bytes: 90000, script: 90000, requests: 1 },
    });
    expect(checkRuns([{ name: 'r', lhr: result }]).pass).toBe(true);
  });

  it('passes a run exactly at the page-weight limit and fails one 1 byte over', () => {
    const script = jsLimitFor('http://localhost:3000/');
    const atLimit = { name: 'at', lhr: page(1000, FIRST_LOAD_LIMIT - 1000 - script, script) };
    const over = { name: 'over', lhr: page(1000, FIRST_LOAD_LIMIT - 999 - script, script) };
    expect(checkRuns([atLimit]).pass).toBe(true);
    const result = checkRuns([atLimit, over]);
    expect(result.pass).toBe(false);
    expect(result.rows.find((row) => !row.pass)?.name).toBe('over');
  });

  it('fails first-party JavaScript over the baseline + its growth + our own code (0014)', () => {
    const review = 'http://localhost:3000/shell-review';
    const atLimit = { name: 'at', lhr: page(1000, 1000, FIRST_PARTY_JS_LIMIT, [], review) };
    const over = { name: 'over', lhr: page(1000, 1000, FIRST_PARTY_JS_LIMIT + 1, [], review) };
    expect(checkRuns([atLimit]).pass).toBe(true);
    expect(checkRuns([over]).pass).toBe(false);
    expect(FIRST_PARTY_JS_LIMIT).toBe(139_668 + 5 * 1024 + 11_077);
  });

  it('holds Home to the baseline + its 11 KB cap (0021), and the campaign profile too', () => {
    expect(jsLimitFor('http://localhost:3000/')).toBe(139_668 + 11 * 1024);
    expect(jsLimitFor('http://127.0.0.1:3000/?utm_source=lhci&gclid=test')).toBe(139_668 + 11 * 1024);
    expect(jsLimitFor('http://localhost:3000/shell-review')).toBe(FIRST_PARTY_JS_LIMIT);
    const atCap = { name: 'at', lhr: page(1000, 1000, 139_668 + 11 * 1024) };
    const overCap = { name: 'over', lhr: page(1000, 1000, 139_668 + 11 * 1024 + 1) };
    expect(checkRuns([atCap]).pass).toBe(true);
    expect(checkRuns([overCap]).pass).toBe(false);
  });

  it('fails when there are no results, or a result has no requests or no own document', () => {
    expect(checkRuns([]).problems).toContainEqual(expect.stringContaining('no Lighthouse results'));
    const broken = checkRuns([{ name: 'lhr-1.json', lhr: { audits: {} } }]);
    expect(broken.pass).toBe(false);
    expect(broken.problems[0]).toMatch(/lhr-1\.json: no network-requests audit/);
    const empty = checkRuns([{ name: 'lhr-2.json', lhr: lhr([]) }]);
    expect(empty.problems[0]).toMatch(/no document from http:\/\/localhost:3000/);
  });

  it('caps third-party requests and bytes per region profile (07 §2, C5’s measurement)', () => {
    // Europe: 2, not 1 — gtm.js plus, in some runs, GTM's own telemetry pixel (59 B)
    expect(THIRD_PARTY_LIMITS.europe).toEqual({ requests: 2, bytes: 160 * 1024 });
    expect(THIRD_PARTY_LIMITS.row).toEqual({ requests: 4, bytes: 350 * 1024 });
    expect(thirdPartyLimitFor('http://localhost:3000/')).toBe(THIRD_PARTY_LIMITS.europe);
    expect(thirdPartyLimitFor('http://localhost:3000/shell-review')).toBe(THIRD_PARTY_LIMITS.europe);
    expect(thirdPartyLimitFor('http://127.0.0.1:3000/?utm_source=lhci&gclid=test')).toBe(THIRD_PARTY_LIMITS.row);
    // Europe: gtm.js with GTM's telemetry pixel passes; a third request (the Google tag before
    // consent) fails
    const gtm = {
      url: 'https://www.googletagmanager.com/gtm.js?id=GTM-X',
      resourceType: 'Script',
      transferSize: 133_405,
    };
    const gtmPing = { url: 'https://www.googletagmanager.com/a?v=3&t=l', resourceType: 'Image', transferSize: 59 };
    const gtag = {
      url: 'https://www.googletagmanager.com/gtag/js?id=G-X',
      resourceType: 'Script',
      transferSize: 100_000,
    };
    const eu = { name: 'eu', lhr: page(1000, 1000, 150_000, [gtm, gtmPing]) };
    const euOver = { name: 'euOver', lhr: page(1000, 1000, 150_000, [gtm, gtmPing, gtag]) };
    expect(checkRuns([eu]).pass).toBe(true);
    expect(checkRuns([euOver]).pass).toBe(false);
    expect(checkRuns([euOver]).rows[0]!.third.requests).toBe(3);
    // The UAE profile: GTM + the Google tag + a collect pass; a 350 KB run fails on bytes
    const collect = { url: 'https://region1.google-analytics.com/g/collect', resourceType: 'Ping', transferSize: 200 };
    const row = {
      name: 'row',
      lhr: page(1000, 1000, 150_000, [gtm, gtag, collect], 'http://127.0.0.1:3000/?gclid=test'),
    };
    expect(checkRuns([row]).pass).toBe(true);
    const fat = { ...gtag, transferSize: 350 * 1024 };
    const rowOver = {
      name: 'rowOver',
      lhr: page(1000, 1000, 150_000, [gtm, fat, collect], 'http://127.0.0.1:3000/?gclid=test'),
    };
    expect(checkRuns([rowOver]).pass).toBe(false);
  });

  it('uses the budget from decision 0014: the framework baseline + 50 KB', () => {
    expect(FIRST_LOAD_LIMIT).toBe(139_668 + 50 * 1024);
  });

  it('gives the review page alone its own allowance (C57), and every other page the hard limit', () => {
    expect(REVIEW_FIRST_LOAD_LIMIT).toBe(192_000);
    expect(limitFor('http://localhost:3000/shell-review')).toBe(REVIEW_FIRST_LOAD_LIMIT);
    expect(limitFor('http://localhost:3000/')).toBe(FIRST_LOAD_LIMIT);
    expect(limitFor('http://127.0.0.1:3000/')).toBe(FIRST_LOAD_LIMIT);
    expect(limitFor('http://localhost:3000/shell-review-copy')).toBe(FIRST_LOAD_LIMIT);
    const weight = 191_211 - 1000 - 140_000;
    const review = { name: 'r', lhr: page(1000, weight, 140_000, [], 'http://localhost:3000/shell-review') };
    const home = { name: 'h', lhr: page(1000, weight, 140_000) };
    expect(checkRuns([review]).pass).toBe(true);
    expect(checkRuns([home]).pass).toBe(false);
  });
});
