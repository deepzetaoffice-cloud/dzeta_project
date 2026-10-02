// A switch (P2 plan, C4): a <button role="switch"> with a visible label, in one look everywhere.
// - A display switch (`kind`): preferences.ts owns its state. It sets aria-checked on every copy at
//   once, and handles the click. While a device setting decides Reduce effects, it also sets
//   aria-disabled and points aria-describedby at the note that explains why (data-note); otherwise the
//   note is neither shown nor read. The switches show only once the runtime has started (effects.css),
//   in menus and the footer, never above the fold. Its width comes from where it sits (DisplayControls).
// - A controlled switch (`checked` and `onCheckedChange`), for a client component that owns the state:
//   Cookie settings' groups (P3 plan, E).
// touch-snap: the thumb overshoots a little (effects.css).

export type SwitchProps = {
  label: string;
  className?: string;
} & (
  | { kind: 'theme' | 'effects'; /** The id of the note that explains a locked state */ note?: string }
  | { kind?: undefined; checked: boolean; onCheckedChange: (checked: boolean) => void }
);

export function Switch(props: SwitchProps) {
  const { label, className } = props;
  const display = props.kind !== undefined;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={display ? 'false' : props.checked}
      data-note={display ? props.note : undefined}
      data-dz-switch={display ? props.kind : undefined}
      onClick={display ? undefined : () => props.onCheckedChange(!props.checked)}
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
