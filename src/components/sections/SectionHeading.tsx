import type { ReactNode } from 'react';

// A section's heading block in the C diagram language (Figma: every section's "Heading" frame): the
// mono eyebrow "[ 01 ] Label" (the number in signal orange, a marker beside its label, C80), the <h2>
// and its lede. `aside` sits at the inline end from 1,024 px, level with the heading's foot (Figma's
// heading rows: the workflow's lede, the industry rail's controls), and below it on narrow screens.
// `center` centres the block from 1,024 px; phones keep it at the start, as the mobile frames do.

export type SectionHeadingProps = {
  /** The <h2>'s id, which the section's aria-labelledby names */
  id: string;
  /** The section's place in the page's numbered sequence */
  index: number;
  eyebrow: string;
  heading: string;
  lede?: string;
  align?: 'start' | 'center';
  aside?: ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  index,
  eyebrow,
  heading,
  lede,
  align = 'start',
  aside,
  className,
}: SectionHeadingProps) {
  const centred = align === 'center';
  return (
    <div
      className={[
        'flex flex-col gap-6',
        aside ? 'lg:flex-row lg:items-end lg:justify-between lg:gap-12' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['grid gap-4', centred ? 'lg:justify-items-center lg:text-center' : ''].join(' ')}>
        <p className="flex gap-2.5 font-mono text-label uppercase">
          <span className="dz-num-bracket" data-num={String(index).padStart(2, '0')} />
          <span className="text-ink-tertiary">{eyebrow}</span>
        </p>
        <h2 id={id} className={['text-h2 text-ink', centred ? 'max-w-[81.25rem]' : 'max-w-[56rem]'].join(' ')}>
          {heading}
        </h2>
        {lede ? (
          <p className={['text-lead text-ink-secondary', centred ? 'max-w-[47.5rem]' : 'max-w-[42.5rem]'].join(' ')}>
            {lede}
          </p>
        ) : null}
      </div>
      {aside}
    </div>
  );
}
