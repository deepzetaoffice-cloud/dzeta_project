import { describe, expect, it } from 'vitest';
import { firstLoadAssets, HARD_LIMIT, headerBytes, HOME_TARGET } from '../../scripts/measure-prod-weight.mjs';

// The production page-weight measurement (C65's method; the P6 part A plan, S2): its pure parts.

const PAGE = 'https://www.deepzeta.ai/';

describe('measure-prod-weight', () => {
  it('lists the stylesheets and async scripts in order, absolute and unique', () => {
    const html = [
      '<link rel="stylesheet" href="/_next/static/chunks/a.css" data-precedence="next"/>',
      '<link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/w.js"/>',
      '<script src="/_next/static/chunks/b.js" async=""></script>',
      '<script src="/_next/static/chunks/b.js" async=""></script>',
      '<script src="/_next/static/chunks/c.js" noModule=""></script>',
      '<script>self.__next_f.push([1,"x"])</script>',
      '<script type="application/ld+json">{}</script>',
      '<link rel="icon" href="/icon.png"/>',
    ].join('');
    expect(firstLoadAssets(html, PAGE)).toEqual([
      { url: 'https://www.deepzeta.ai/_next/static/chunks/a.css', type: 'css' },
      { url: 'https://www.deepzeta.ai/_next/static/chunks/b.js', type: 'js' },
    ]);
  });

  it('decodes &amp; in a URL and keeps other origins as they are', () => {
    const html = '<script src="https://cdn.example/x.js?a=1&amp;b=2" async=""></script>';
    expect(firstLoadAssets(html, PAGE)).toEqual([{ url: 'https://cdn.example/x.js?a=1&b=2', type: 'js' }]);
  });

  it('counts a header block as it travels: the status line, each header line, the blank line', () => {
    // "HTTP/1.1 200 OK\r\n" (17) + "a: b\r\n" (6) + "\r\n" (2)
    expect(headerBytes('HTTP/1.1 200 OK', ['a', 'b'])).toBe(25);
    expect(headerBytes('HTTP/1.1 200 OK', [])).toBe(19);
  });

  it('holds 07 §2’s hard limit and the plan’s Home target', () => {
    expect(HARD_LIMIT).toBe(139_668 + 50 * 1024);
    expect(HOME_TARGET).toBe(189_800);
  });
});
