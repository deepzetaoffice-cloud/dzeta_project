// A display switch (P2 plan, C4): a <button role="switch"> with a visible label. preferences.ts owns
// its state: it sets aria-checked (and aria-disabled, while a device setting decides Reduce effects)
// on every copy at once, and handles the click. Until hydration it shows off; the switches sit in
// menus and the footer, never above the fold. touch-snap: the thumb overshoots a little (effects.css).
// Its width comes from where it sits (DisplayControls).

export type SwitchProps = {
  kind: 'theme' | 'effects';
  label: string;
  /** The id of a note that explains a locked state, for aria-describedby */
  describedBy?: string;
  className?: string;
};

export function Switch({ kind, label, describedBy, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked="false"
      aria-describedby={describedBy}
      data-dz-switch={kind}
      className={[
        'dz-switch inline-flex min-h-11 items-center gap-3 rounded-md text-start whitespace-nowrap text-fg-strong',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>{label}</span>
      <span aria-hidden="true" className="dz-switch-track">
        <span className="dz-switch-thumb" />
      </span>
    </button>
  );
}
