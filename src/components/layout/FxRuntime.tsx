'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { startCta } from '@/lib/fx/cta';
import { startFooterFx } from '@/lib/fx/footer';
import { markCurrent, startHeader } from '@/lib/fx/header';
import { armLazyEnhancers } from '@/lib/fx/lazy';
import { startMega } from '@/lib/fx/mega';
import { startPreferences } from '@/lib/fx/preferences';
import { armScenes, stopScenes } from '@/lib/fx/scenes';
import { closeSheet, startSheet } from '@/lib/fx/sheet';

// The one client island for the shared controllers, mounted once by SiteDocument. It renders nothing:
// the modules in src/lib/fx/ work through delegated listeners and attributes, so everything else stays
// server-rendered. The listeners start once; what depends on the page (the current nav item, the lazy
// enhancements, the page's scenes, the sticky bar's hand-off, an open sheet or mega menu) runs again
// after each client navigation, and the scenes of the page left behind stop.
export function FxRuntime() {
  const pathname = usePathname();
  useEffect(() => {
    startPreferences();
    startSheet();
    startHeader();
    startMega();
    startFooterFx();
  }, []);
  useEffect(() => {
    closeSheet();
    document.querySelector<HTMLElement>('.dz-mega:popover-open')?.hidePopover();
    markCurrent(pathname);
    armLazyEnhancers();
    armScenes();
    const stopCta = startCta();
    return () => {
      stopScenes();
      stopCta();
    };
  }, [pathname]);
  return null;
}
