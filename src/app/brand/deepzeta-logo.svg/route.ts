import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LOCKED_LOGO_PATH } from '@/lib/brand';

// The locked logo, served exactly as it is (docs/ai/00 §5). It's read at build and never copied, so
// the site can't drift from the locked file (P1 plan, A1 as changed at the owner's step 4 stop).
export const dynamic = 'force-static';

export function GET() {
  return new Response(readFileSync(join(process.cwd(), LOCKED_LOGO_PATH)), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
