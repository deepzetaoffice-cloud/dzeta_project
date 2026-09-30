import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import GlobalError from '@/app/global-error';
import { errorContent } from '@/content/en/error';
import { siteConfig } from '@/lib/site-config';

// The branded error page (P2 plan, B5 and O). No route can make it appear in e2e, so it's rendered
// to a string here. next/font only works inside a Next.js build, so its class names are stubbed.
vi.mock('@/styles/fonts', () => ({ fontVariables: 'font-vars' }));

const error = Object.assign(new Error('test'), { digest: 'abc' });
const render = (retry = () => {}) => renderToStaticMarkup(createElement(GlobalError, { error, retry }));

// The first host element of a type in a rendered tree (the page's own elements, not its components').
function findElement(node: ReactNode, type: string): ReactElement<Record<string, unknown>> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findElement(child, type);
      if (found) return found;
    }
    return undefined;
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) return undefined;
  if (node.type === type) return node as ReactElement<Record<string, unknown>>;
  return findElement(node.props.children, type);
}

describe('the error page', () => {
  it('renders its own English document with the site fonts', () => {
    expect(render()).toMatch(/^<html lang="en" dir="ltr" class="font-vars">/);
  });

  it('has the branded title, the heading and the copy', () => {
    const html = render();
    expect(html).toContain(`<title>${errorContent.title} | ${siteConfig.brandName}</title>`);
    expect(html).toContain(`<h1 class="text-h1">${errorContent.heading}</h1>`);
    expect(html).toContain(errorContent.body);
  });

  it('shows the logo, named, in a navy header', () => {
    expect(render()).toMatch(
      new RegExp(`<header data-theme="dark"[^>]*><span[^>]*role="img" aria-label="${siteConfig.brandName}"`),
    );
  });

  it('offers "Try again" as a button and the home page as a link with 44 px targets', () => {
    const html = render();
    expect(html).toMatch(new RegExp(`<button type="button" class="min-h-11[^"]*">${errorContent.retry}</button>`));
    expect(html).toMatch(new RegExp(`<a class="inline-flex min-h-11[^"]*" href="/">${errorContent.homeLink}</a>`));
  });

  it('"Try again" calls retry once', () => {
    const retry = vi.fn();
    const button = findElement(GlobalError({ error, retry }), 'button');
    expect(button).toBeDefined();
    (button?.props.onClick as () => void)();
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
