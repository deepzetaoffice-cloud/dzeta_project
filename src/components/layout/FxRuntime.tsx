'use client';

import { useEffect } from 'react';
import { revealOnce } from '@/lib/fx/observer';
import { startPointer } from '@/lib/fx/pointer';
import { startPreferences } from '@/lib/fx/preferences';

// The one client island for the shared effect controllers (P2 plan, G), mounted once by SiteDocument.
// A Client Component only because the controllers need the browser after hydration. It renders
// nothing: the modules in src/lib/fx/ work through delegated listeners and attributes, with no React
// state per event (docs/ai/13 §4.2), so everything else stays server-rendered.
export function FxRuntime() {
  useEffect(() => {
    startPreferences();
    revealOnce();
    startPointer();
  }, []);
  return null;
}
