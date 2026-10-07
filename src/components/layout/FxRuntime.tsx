'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { startCta } from '@/lib/fx/cta';
import { armLazyEnhancers } from '@/lib/fx/lazy';
import { markCurrent, startHeader } from '@/lib/fx/header';
import { revealOnce } from '@/lib/fx/observer';
import { startPointer } from '@/lib/fx/pointer';
import { startPreferences } from '@/lib/fx/preferences';

// The one client island for the shared effect controllers (P2 plan, G), mounted once by SiteDocument.
// A Client Component only because the controllers need the browser after hydration. It renders
// nothing: the modules in src/lib/fx/ work through delegated listeners and attributes, with no React
// state per event (docs/ai/13 §4.2), so everything else stays server-rendered. The listeners start
// once; what depends on the page (one-shot reveals, the current page, the CTA hand-off) runs again
// after each client navigation.
export function FxRuntime() {
  const pathname = usePathname();
  useEffect(() => {
    startPreferences();
    startPointer();
    startHeader();
  }, []);
  useEffect(() => {
    revealOnce();
    armLazyEnhancers();
    markCurrent(pathname);
    return startCta();
  }, [pathname]);
  return null;
}
