// Validated environment (docs/ai/02 §2.5, docs/ai/08 §1, conflict C27).
// next.config.ts calls env(), so `next dev`, `next build` and `next start` stop at once with a
// clear message when a value is missing or malformed. Variable names are listed in .env.example.
//
// Imported by next.config.ts through Node's own TypeScript loader: keep relative imports with
// explicit `.ts` extensions and type-only syntax in this file.

export type SiteIndexing = 'on' | 'off';
export type VercelEnv = 'production' | 'preview' | 'development';

export type Env = {
  // The site's origin, with no trailing slash, e.g. https://deepzeta.ai
  siteUrl: string;
  siteIndexing: SiteIndexing;
  // Set by Vercel on its builds; undefined on the owner's machine and in CI.
  vercelEnv: VercelEnv | undefined;
};

type EnvSource = Record<string, string | undefined>;

export function parseEnv(source: EnvSource): Env {
  const problems: string[] = [];
  const vercelEnv = parseVercelEnv(source.VERCEL_ENV, problems);
  const siteUrl = parseSiteUrl(source.NEXT_PUBLIC_SITE_URL, vercelEnv, problems);
  const siteIndexing = parseSiteIndexing(source.SITE_INDEXING, problems);

  if (problems.length > 0) {
    throw new Error(`Invalid environment (names and rules: .env.example):\n- ${problems.join('\n- ')}`);
  }
  return { siteUrl, siteIndexing, vercelEnv };
}

let cached: Env | undefined;

export function env(): Env {
  // Each variable is read by its literal name so Next.js can inline NEXT_PUBLIC_SITE_URL into
  // browser bundles. The other two are server-only and are undefined in the browser.
  cached ??= parseEnv({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SITE_INDEXING: process.env.SITE_INDEXING,
    VERCEL_ENV: process.env.VERCEL_ENV,
  });
  return cached;
}

function parseVercelEnv(raw: string | undefined, problems: string[]): VercelEnv | undefined {
  if (raw === undefined || raw === '') return undefined;
  if (raw === 'production' || raw === 'preview' || raw === 'development') return raw;
  problems.push(`VERCEL_ENV must be production, preview or development (got "${raw}").`);
  return undefined;
}

function parseSiteUrl(raw: string | undefined, vercelEnv: VercelEnv | undefined, problems: string[]): string {
  if (raw === undefined || raw === '') {
    problems.push('NEXT_PUBLIC_SITE_URL is missing (e.g. http://localhost:3000 on your machine).');
    return '';
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    problems.push(`NEXT_PUBLIC_SITE_URL is not a valid URL (got "${raw}").`);
    return '';
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    problems.push(`NEXT_PUBLIC_SITE_URL must use http or https (got "${raw}").`);
  }
  if (raw.endsWith('/')) {
    problems.push(`NEXT_PUBLIC_SITE_URL must not end with "/" (got "${raw}").`);
  } else if (url.origin !== raw) {
    problems.push(`NEXT_PUBLIC_SITE_URL must be a lowercase origin only, with no path, query or hash (got "${raw}").`);
  }
  if (vercelEnv === 'production') {
    if (url.protocol !== 'https:') problems.push('NEXT_PUBLIC_SITE_URL must use https in production.');
    if (url.hostname.endsWith('.vercel.app')) {
      problems.push('NEXT_PUBLIC_SITE_URL must not be a *.vercel.app host in production.');
    }
  }
  return url.origin;
}

function parseSiteIndexing(raw: string | undefined, problems: string[]): SiteIndexing {
  if (raw === undefined || raw === '' || raw === 'off') return 'off';
  if (raw === 'on') return 'on';
  problems.push(`SITE_INDEXING must be "on" or "off" (got "${raw}").`);
  return 'off';
}
