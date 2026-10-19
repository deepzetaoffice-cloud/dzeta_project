import { agentHref } from '@/components/ui/CtaButton';
import { shellContent } from '@/content/en/shell';

// The status island (header.md; Figma 34:105, KokonutUI NV-09): "Agent online" with a pulsing dot
// (status-pulse), linking to the agent (agentHref()). Callers render it only while the agent is live
// (src/lib/agent.ts), never as a fake "online".
// - `compact`, in the header: hover or focus shows its second line in a bubble under it
//   (status-expand), so the bar never reflows. The line is in the link either way, so its name is whole.
// - `expanded`, in the mobile menu: both lines, always.

export type StatusIslandProps = { variant: 'compact' | 'expanded'; className?: string };

export function StatusIsland({ variant, className }: StatusIslandProps) {
  const expanded = variant === 'expanded';
  return (
    <a
      href={agentHref()}
      className={[
        'dz-press dz-island group relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-violet-soft px-3 py-2 text-caption',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" className="dz-pulse size-2 shrink-0 rounded-full bg-accent-online" />
      <span className="grid gap-0.5">
        <span className="text-violet">{shellContent.agentStatus}</span>
        <span className={expanded ? 'text-ink-secondary' : 'dz-island-line'}>{shellContent.agentStatusLine}</span>
      </span>
    </a>
  );
}
