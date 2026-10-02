import { afterEach, describe, expect, it, vi } from 'vitest';
import { GTM_ORIGIN, gtmScriptSrc, loadGtm } from '@/lib/tracking/gtm';

// GTM's loader (docs/ai/09 §2.1, C56; P3 plan, H and M): the container's address, with a GTM
// environment when both of its values are set, and Google's snippet's two steps, once per document.

afterEach(() => vi.unstubAllGlobals());

describe('gtmScriptSrc', () => {
  it('names the container', () => {
    expect(gtmScriptSrc({ id: 'GTM-AB12CD3' })).toBe(`${GTM_ORIGIN}/gtm.js?id=GTM-AB12CD3`);
  });

  it('adds a GTM environment as Google’s snippet does', () => {
    expect(gtmScriptSrc({ id: 'GTM-AB12CD3', auth: 'aB_c-1', preview: 'env-5' })).toBe(
      `${GTM_ORIGIN}/gtm.js?id=GTM-AB12CD3&gtm_auth=aB_c-1&gtm_preview=env-5&gtm_cookies_win=x`,
    );
  });
});

describe('loadGtm', () => {
  function page() {
    const added: { async?: boolean; src?: string }[] = [];
    const win: { dataLayer?: unknown[] } = { dataLayer: [{ consent: 'default' }] };
    vi.stubGlobal('window', win);
    vi.stubGlobal('document', {
      querySelector: (selector: string) =>
        added.some((script) => selector.includes('gtm.js') && script.src?.startsWith(`${GTM_ORIGIN}/gtm.js`))
          ? {}
          : null,
      createElement: () => ({}),
      head: { appendChild: (script: { async?: boolean; src?: string }) => added.push(script) },
    });
    return { win, added };
  }

  it('pushes the gtm.js event after the consent defaults, then adds the script, async', () => {
    const { win, added } = page();
    loadGtm({ id: 'GTM-AB12CD3' });
    expect(win.dataLayer).toEqual([{ consent: 'default' }, { 'gtm.start': expect.any(Number), event: 'gtm.js' }]);
    expect(added).toEqual([{ async: true, src: `${GTM_ORIGIN}/gtm.js?id=GTM-AB12CD3` }]);
  });

  it('loads once per document', () => {
    const { win, added } = page();
    loadGtm({ id: 'GTM-AB12CD3' });
    loadGtm({ id: 'GTM-AB12CD3' });
    expect(added).toHaveLength(1);
    expect(win.dataLayer).toHaveLength(2);
  });
});
