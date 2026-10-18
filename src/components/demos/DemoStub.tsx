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
  /** On the stage: the On colour button style (05 §7) */
  onColor?: boolean;
  className?: string;
};

export function DemoStub({ demoId, label, icon = 'arrow', onColor = false, className }: DemoStubProps) {
  const glyph = glyphFor(icon);
  const look = onColor ? 'border-line-on-color text-on-color' : 'border-line-strong bg-surface text-ink';
  return (
    <button
      type="button"
      className={[
        'dz-press inline-flex min-h-14 items-center gap-2 rounded-full border px-6 text-button-l',
        look,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-demo={demoId}
      data-fx-lazy="demo"
    >
      {glyph ? <Glyph name={glyph} className="size-5" /> : null}
      {label}
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
