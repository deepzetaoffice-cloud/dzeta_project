import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/locales';
import { siteConfig } from '@/lib/site-config';
import { readToken } from '@/lib/tokens';

const locale = locales.en;

// The web app manifest (URL registry R177; P1 plan, B4). It's a website, not an app: `browser` keeps
// the address bar and offers no "Install app" prompt. The icons are crops of the locked logo
// (scripts/build-brand-icons.mjs), and the colours come from tokens.css (docs/ai/05 §1). Arabic gets
// its own manifest question in P11.
export default function manifest(): MetadataRoute.Manifest {
  const navy = readToken('--dz-navy');
  return {
    id: '/',
    name: siteConfig.brandName,
    short_name: siteConfig.brandName,
    description: siteConfig.positioningLine,
    start_url: '/',
    scope: '/',
    display: 'browser',
    lang: locale.lang,
    dir: locale.dir,
    theme_color: navy,
    background_color: navy,
    icons: [
      { src: '/icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
