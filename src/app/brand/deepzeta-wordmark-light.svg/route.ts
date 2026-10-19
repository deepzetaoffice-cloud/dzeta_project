import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LIGHT_LOGO_DIR, LIGHT_WORDMARK_FILE } from '@/lib/brand-light';

// The owner's white-background wordmark (C78), served exactly as it is (docs/ai/00 §5), at a
// descriptive URL. It's read at build and never copied, so the site can't drift from the locked file.
export const dynamic = 'force-static';

export function GET() {
  // Read only at build (force-static). Without the ignore, Turbopack can't see through the path and
  // traces the whole project.
  const path = join(/*turbopackIgnore: true*/ process.cwd(), LIGHT_LOGO_DIR, LIGHT_WORDMARK_FILE);
  return new Response(readFileSync(path), { headers: { 'Content-Type': 'image/svg+xml' } });
}
