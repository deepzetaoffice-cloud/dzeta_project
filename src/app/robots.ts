import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { isIndexable, robotsRules } from '@/lib/seo/indexing';

// PROTECTED once created (docs/ai/08 §5): edits need a plan that names this file.
// The rules live in src/lib/seo/indexing.ts, where both modes are unit-tested.
export default function robots(): MetadataRoute.Robots {
  return { rules: robotsRules(isIndexable(env())) };
}
