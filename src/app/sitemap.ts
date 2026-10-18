import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';
import { absoluteUrl } from '@/lib/url';

// The sitemap (docs/ai/08 §6; decision 0033): every live, indexable page from the route registry,
// so a page joins it the moment its row turns live. No priority or changefreq (Google ignores them),
// and no lastModified until content carries real dates: a build time would be invented (02 §1.5).
// Each page's images and videos join their entry as MediaAsset entries reach the pages (08 §7, Phase D).
// check:seo asserts that these URLs equal the indexable built pages. The pre-launch noindex lock
// (0013) is a header, so the file can exist before launch.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(ROUTES)
    .filter((route) => route.live)
    .map((route) => ({ url: absoluteUrl(route.path) }));
}
