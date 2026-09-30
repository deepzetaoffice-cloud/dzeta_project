import { notFound } from 'next/navigation';
import { shellReviewContent } from '@/content/en/shell-review';
import { env } from '@/lib/env';

// The shell review page (P2 plan, A3; registry R165): the complete shell with every item shown, for
// the owner's review on each Vercel preview and for e2e and lhci. A production build returns 404, so
// visitors never reach it; it's never linked, so it's absent from the sitemap and the llms files.
// Until the shell's step moves <main> into SiteShell, the page renders its own.
export default function ShellReviewPage() {
  if (env().vercelEnv === 'production') notFound();
  const { banner, heading, intro, sections } = shellReviewContent;
  return (
    <main>
      <p className="bg-surface px-gutter py-2 text-small text-fg-strong">{banner}</p>
      <div className="mx-auto max-w-measure px-gutter py-section">
        <h1 className="text-h1">{heading}</h1>
        <p className="mt-4">{intro}</p>
      </div>
      {sections.map((section, index) => (
        <section key={section.heading} data-theme={section.theme} aria-labelledby={`review-section-${index}`}>
          <div className="mx-auto max-w-measure px-gutter py-chapter">
            <h2 id={`review-section-${index}`} className="text-h2">
              {section.heading}
            </h2>
            <p className="mt-4">{section.body}</p>
          </div>
        </section>
      ))}
    </main>
  );
}
