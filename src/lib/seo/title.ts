// The one page-title format (docs/ai/08 §1): "<page title> | <brand>", with the brand added once.
// The root layout uses `titleTemplate` for every child page. Next.js doesn't apply a layout's
// template to the page in the layout's own segment (the home page), so that page sets
// `title: { absolute: brandedTitle(...) }` instead.
import { siteConfig } from '../site-config.ts';

export const titleTemplate = `%s | ${siteConfig.brandName}`;

export function brandedTitle(pageTitle: string): string {
  return titleTemplate.replace('%s', pageTitle);
}
