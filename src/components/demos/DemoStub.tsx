// The lightweight demo trigger (P5 S6; 04 §2's P5 row: "demos stubbed behind lightweight
// triggers"). A server-rendered button (data-demo="<id>"); the tracking runtime's existing lazy
// click path fires demo_open with the demo_id and the stub panel's code is imported on the first
// click — never at first load (07 §2; the P5 plan's budget rule). The panel is honest: it says
// the live demo arrives with the next phase and offers the audit CTA (10 §3.6 — no fake demo).
import { auditHref } from '@/components/ui/CtaButton';
import { Icon } from '@/components/icons/Icon';
import { demoStub } from '@/content/en/home';
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

// The trigger only: a real <button> (keyboard-operable, focus parity) whose panel arrives on
// first use. The click path (clicks.ts) fires demo_open; the panel loader lives with it.
export function DemoStub({ demoId, label, icon = 'arrow', className }: DemoStubProps) {
  return (
    <button type="button" className={`dz-demo-trigger ${className ?? ''}`} data-demo={demoId}>
      <Icon name={icon} size={20} />
      {label}
    </button>
  );
}

// The panel the lazy loader mounts after the first trigger click (imported from here, so it is
// never in the first load). Rendered into the demo region by the enhancement module (S6 wiring).
export function DemoStubPanel() {
  return (
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
  );
}
