import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/locales';
import { siteConfig } from '@/lib/site-config';
import { readToken } from '@/lib/tokens';

const locale = locales.en;

// The web app manifest (URL registry R177). It's a website, not an app: `browser` keeps the address
// bar and offers no "Install app" prompt. The icons are crops of the locked logo on a dark plate
// (scripts/build-brand-icons.mjs; the logo is dark-only, C78). The colours come from tokens.css
// (docs/ai/05 §1): the v3 canvas (decision 0033). Arabic gets its own manifest question in P11.
export default function manifest(): MetadataRoute.Manifest {
  const canvas = readToken('--dz-p-ink-50');
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
    theme_color: canvas,
    background_color: canvas,
    icons: [
      { src: '/icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
