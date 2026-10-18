import type { Tier1Name } from '@/components/icons/registry';
import { auditHref } from '@/components/ui/CtaButton';
import { Glyph, glyphFor } from '@/components/ui/Glyph';
import { demoStub } from '@/content/en/demos';
import { shellContent } from '@/content/en/shell';

// A demo's trigger (07 §4: the live demos come in P7). A button: the lazy demo enhancement
// (src/lib/fx/demo.ts) clones the page's one panel template after it and fires demo_open when it
// opens (09 §3). Each trigger is its own lazy region (data-fx-lazy="demo"), so the enhancement loads
// on the first pointer, focus or click on it. The panel says honestly that the demo isn't live yet and offers
// the audit.

export type DemoStubProps = {
  /** The demo's id in the taxonomy (demo_open's demo_id) */
  demoId: string;
  /** The trigger's label */
  label: string;
  /** The trigger's glyph, by the content's interface name */
  icon?: Tier1Name;
  /** The button's look (05 §7): Secondary on white, On colour over the stage (border only, C85), or
      Inverse (ink, the final CTA's test card) */
  tone?: 'secondary' | 'onColor' | 'inverse';
  className?: string;
};

const LOOK = {
  secondary: 'min-h-14 border-line-strong bg-surface px-6 text-button-l text-ink',
  onColor: 'min-h-14 border-line-on-color px-6 text-button-l text-on-color',
  inverse: 'min-h-11 border-transparent bg-action-inverse px-5 text-button-m text-on-color',
} as const;

export function DemoStub({ demoId, label, icon = 'arrow', tone = 'secondary', className }: DemoStubProps) {
  const glyph = glyphFor(icon);
  return (
    <button
      type="button"
      className={['dz-press inline-flex items-center gap-2 rounded-full border', LOOK[tone], className]
        .filter(Boolean)
        .join(' ')}
      data-demo={demoId}
      data-fx-lazy="demo"
    >
      {tone === 'inverse' ? label : null}
      {glyph ? <Glyph name={glyph} className={tone === 'inverse' ? 'size-4.5' : 'size-5'} /> : null}
      {tone === 'inverse' ? null : label}
    </button>
  );
}

// The demo stubs' panel, once per page: hidden until a trigger clones it.
export function DemoPanelTemplate() {
  return (
    <div hidden data-demo-template="">
      <div
        className="rounded-lg border border-line bg-surface p-6 text-ink shadow-2"
        role="dialog"
        aria-modal="false"
        aria-label={demoStub.title}
      >
        <h3 className="text-h4">{demoStub.title}</h3>
        <p className="mt-2 max-w-measure text-small text-ink-secondary">{demoStub.line}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            className="dz-press inline-flex min-h-11 items-center rounded-full bg-action px-5 text-button-m text-on-color"
            href={auditHref()}
            data-cta="page"
            data-cta-id="book_audit"
          >
            {shellContent.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
