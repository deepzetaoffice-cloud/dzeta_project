// The lightweight demo trigger (P5 S6; 04 §2's P5 row: "demos stubbed behind lightweight
// triggers"). A server-rendered button (data-demo="<id>") that is its own lazy region
// (data-fx-lazy="demo"): the first pointer, focus or click on it imports demo-enhance.ts, which
// opens the stub panel and fires demo_open — never at first load (07 §2). The panel is honest: it
// says the live demo arrives with the next phase and offers the audit CTA (10 §3.6 — no fake demo).
// Its markup is server-rendered once per page (DemoPanelTemplate) and cloned on use, so no React
// renderer ships to the browser (the P6 A1 audit: the old lazy chunk carried react-dom/server,
// 66.5 KB gzip).
import { auditHref } from '@/components/ui/CtaButton';
import { Icon } from '@/components/icons/Icon';
import { demoStub } from '@/content/en/demos';
import { shellContent } from '@/content/en/shell';

export type DemoStubProps = {
  /** The demo's id in the taxonomy (demo_open's demo_id): 'ai-agent', 'workflow-explorer', 'roi-calculator', 'speed-to-lead' */
  demoId: string;
  /** The trigger's label */
  label: string;
  /** The trigger's icon (Tier 1) */
  icon?: 'send' | 'arrow' | 'check' | 'globe' | 'chevron';
  className?: string;
};

// The trigger only: a real <button> (keyboard-operable, focus parity) whose panel arrives on first use
export function DemoStub({ demoId, label, icon = 'arrow', className }: DemoStubProps) {
  return (
    <button type="button" className={`dz-demo-trigger ${className ?? ''}`} data-demo={demoId} data-fx-lazy="demo">
      <Icon name={icon} size={20} />
      {label}
    </button>
  );
}

// The panel's markup, once per page that has a demo trigger: hidden (out of the layout and the
// accessibility tree) until demo-enhance.ts clones it next to the trigger that was used.
export function DemoPanelTemplate() {
  return (
    <div hidden data-demo-template="">
      <div
        className="dz-glass dz-demo-panel rounded-2xl p-6"
        role="dialog"
        aria-modal="false"
        aria-label={demoStub.title}
      >
        <h3 className="text-h4">{demoStub.title}</h3>
        <p className="mt-2 max-w-measure text-small text-fg-muted">{demoStub.line}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a className="dz-cta dz-cta--primary" href={auditHref()} data-cta="page" data-cta-id="book_audit">
            {shellContent.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
