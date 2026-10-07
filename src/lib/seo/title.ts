// The one page-title format (docs/ai/08 §1): "<page title> | <brand>", with the brand added once.
// The root layout uses `titleTemplate` for every child page. Next.js doesn't apply a layout's
// template to the page in the layout's own segment (the home page), so that page sets
// `title: { absolute: brandedTitle(...) }` instead.
import { BRAND_NAME } from '../brand.ts';

export const titleTemplate = `%s | ${BRAND_NAME}`;

export function brandedTitle(pageTitle: string): string {
  // A function replacer, so "$&" or "$1" in a title is kept as text, not treated as a pattern.
  return titleTemplate.replace('%s', () => pageTitle);
}
