'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { startCta } from '@/lib/fx/cta';
import { armLazyEnhancers } from '@/lib/fx/lazy';
import { startPreferences } from '@/lib/fx/preferences';
import { closeSheet, startSheet } from '@/lib/fx/sheet';

// The one client island for the shared controllers, mounted once by SiteDocument. It renders nothing:
// the modules in src/lib/fx/ work through delegated listeners and attributes, so everything else stays
// server-rendered. The listeners start once; what depends on the page (the lazy enhancements, the
// sticky bar's hand-off, an open sheet) runs again after each client navigation.
export function FxRuntime() {
  const pathname = usePathname();
  useEffect(() => {
    startPreferences();
    startSheet();
  }, []);
  useEffect(() => {
    closeSheet();
    armLazyEnhancers();
    return startCta();
  }, [pathname]);
  return null;
}
