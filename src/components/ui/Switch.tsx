// A display switch (P2 plan, C4): a <button role="switch"> with a visible label. preferences.ts owns
// its state: it sets aria-checked (and aria-disabled, while a device setting decides Reduce effects)
// on every copy at once, and handles the click. Until hydration it shows off; the switches sit in
// menus and the footer, never above the fold. touch-snap: the thumb overshoots a little (effects.css).

export type SwitchProps = {
  kind: 'theme' | 'effects';
  label: string;
  /** The id of a note that explains a locked state, for aria-describedby */
  describedBy?: string;
};

export function Switch({ kind, label, describedBy }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked="false"
      aria-describedby={describedBy}
      data-dz-switch={kind}
      className="dz-switch inline-flex min-h-11 w-full items-center justify-between gap-4 rounded-md text-start text-fg-strong"
    >
      <span>{label}</span>
      <span aria-hidden="true" className="dz-switch-track">
        <span className="dz-switch-thumb" />
      </span>
    </button>
  );
}
