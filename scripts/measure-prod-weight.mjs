#!/usr/bin/env node
// A page's real first load as a visitor's browser receives it (07 §2; C65's method; the P6 part A
// plan, S2). No dependencies. The lab's page-weight gate (check-page-weight.mjs) measures
// `next start`, which compresses with gzip. Production (Vercel) sends Brotli and its own headers,
// so the hard limit is checked here too:
// - the page with `Accept-Encoding: br`, then every stylesheet and every async script it lists
//   (the `noModule` polyfill excluded: modern browsers skip it);
// - each response counted as its header block plus its body bytes as sent (compressed).
// Usage: node scripts/measure-prod-weight.mjs [url] [--cookie "<name=value>"]
//   url defaults to https://www.deepzeta.ai/. A protected preview needs its share cookie
//   (`_vercel_share=…` or `_vercel_jwt=…`).

import https from 'node:https';
import http from 'node:http';
import { pathToFileURL } from 'node:url';

export const HARD_LIMIT = 190_868; // 07 §2: the framework baseline + 50 KB (decision 0014)
export const HOME_TARGET = 189_800; // the P6 part A plan: about 1 KB under the hard limit

// The first-load stylesheets and scripts a page's HTML lists, as absolute URLs, in order, unique.
export function firstLoadAssets(html, pageUrl) {
  const assets = [];
  for (const match of html.matchAll(/<(link|script)\b([^>]*)>/g)) {
    const [, tag, attributes] = match;
    const isStylesheet = tag === 'link' && /\brel="stylesheet"/.test(attributes);
    const isScript = tag === 'script' && /\bsrc="/.test(attributes) && !/\bnoModule\b/i.test(attributes);
    if (!isStylesheet && !isScript) continue;
    const ref = (attributes.match(/\b(?:href|src)="([^"]+)"/) || [])[1];
    if (!ref) continue;
    const url = new URL(ref.replaceAll('&amp;', '&'), pageUrl);
    // First party only (C54): another origin's script has its own caps
    if (url.origin !== new URL(pageUrl).origin) continue;
    if (!assets.some((asset) => asset.url === url.href))
      assets.push({ url: url.href, type: isStylesheet ? 'css' : 'js' });
  }
  return assets;
}

// The size of an HTTP/1.1 header block as it travels: the status line, each header line, the blank line.
export function headerBytes(statusLine, rawHeaders) {
  let size = Buffer.byteLength(`${statusLine}\r\n`);
  for (let i = 0; i < rawHeaders.length; i += 2)
    size += Buffer.byteLength(`${rawHeaders[i]}: ${rawHeaders[i + 1]}\r\n`);
  return size + 2;
}

function get(url, cookie) {
  const client = url.startsWith('https:') ? https : http;
  return new Promise((resolve, reject) => {
    const request = client.get(
      url,
      {
        headers: {
          'Accept-Encoding': 'br',
          'User-Agent': 'dz-measure-prod-weight',
          ...(cookie ? { Cookie: cookie } : {}),
        },
      },
      (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const body = Buffer.concat(chunks);
          const statusLine = `HTTP/${response.httpVersion} ${response.statusCode} ${response.statusMessage}`;
          resolve({
            status: response.statusCode,
            location: response.headers.location,
            encoding: response.headers['content-encoding'] ?? 'identity',
            headers: headerBytes(statusLine, response.rawHeaders),
            body,
          });
        });
        response.on('error', reject);
      },
    );
    request.on('error', reject);
  });
}

async function fetchFollowing(url, cookie) {
  let current = url;
  const origin = new URL(url).origin;
  for (let hops = 0; hops < 5; hops++) {
    // The share cookie goes to the page's own origin only, never to where a redirect points
    const response = await get(current, new URL(current).origin === origin ? cookie : undefined);
    if (response.status >= 300 && response.status < 400 && response.location) {
      current = new URL(response.location, current).href;
      continue;
    }
    return { ...response, url: current };
  }
  throw new Error(`too many redirects from ${url}`);
}

async function decode(response) {
  const zlib = await import('node:zlib');
  if (response.encoding === 'br') return zlib.brotliDecompressSync(response.body).toString('utf8');
  if (response.encoding === 'gzip') return zlib.gunzipSync(response.body).toString('utf8');
  return response.body.toString('utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const cookieAt = args.indexOf('--cookie');
  const cookie = cookieAt >= 0 ? args.splice(cookieAt, 2)[1] : undefined;
  const pageUrl = args[0] ?? 'https://www.deepzeta.ai/';
  const page = await fetchFollowing(pageUrl, cookie);
  if (page.status !== 200) throw new Error(`${page.url} answered ${page.status}`);
  const rows = [
    { url: page.url, type: 'html', encoding: page.encoding, headers: page.headers, body: page.body.length },
  ];
  for (const asset of firstLoadAssets(await decode(page), page.url)) {
    const response = await get(asset.url, cookie);
    if (response.status !== 200) throw new Error(`${asset.url} answered ${response.status}`);
    rows.push({ ...asset, encoding: response.encoding, headers: response.headers, body: response.body.length });
  }
  let total = 0;
  for (const row of rows) {
    total += row.headers + row.body;
    console.log(
      `  ${row.type.padEnd(4)} ${String(row.headers).padStart(5)} + ${String(row.body).padStart(7)} B  ${row.encoding.padEnd(8)} ${new URL(row.url).pathname}`,
    );
  }
  const byType = (type) =>
    rows.filter((row) => row.type === type).reduce((sum, row) => sum + row.headers + row.body, 0);
  console.log(
    `First load ${total} B (HTML ${byType('html')}, CSS ${byType('css')}, JS ${byType('js')}; ${rows.length} responses) · ` +
      `hard limit ${HARD_LIMIT} B: ${total <= HARD_LIMIT ? `${HARD_LIMIT - total} B under` : `${total - HARD_LIMIT} B OVER`}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`measure-prod-weight: ${error.message}`);
    process.exit(1);
  });
}
