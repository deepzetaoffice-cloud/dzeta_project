import { MegaMenuPanel } from '@/components/layout/MegaMenu';

// The mega menu's full panel as a static fragment page (R179; L8, decision 0026; header.md).
// Prerendered at build from the same component the review page renders inline, so the two can't
// drift. The header's Services button fetches it on the first pointer or focus (mega-enhance.ts)
// and moves [data-mega-panel]'s content into the popover, which keeps the columns, their icons and
// the strip out of every page's first load. Never linked; noindex (the fragment root layout).
export default function MegaMenuFragment() {
  return (
    <div data-mega-panel="">
      <MegaMenuPanel review={false} />
    </div>
  );
}
