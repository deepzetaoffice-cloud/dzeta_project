// The AI receptionist demo's own headers (/ai-receptionist; docs/plans/2026-10-25-ai-receptionist-demo.md).
// The sitewide policy (security-headers.ts, unchanged) blocks the microphone and every connection off
// our origin. This one page needs both, so next.config.ts adds this rule after the sitewide one (the
// later match wins for the same header). Everything else is the sitewide value, derived, never retyped:
// - Permissions-Policy: microphone for our own origin only; the rest stays off.
// - CSP connect-src: the voice service's WebRTC signalling host (its default "us" location).
// - CSP script-src: blob:, from which the voice package loads its audio worklet.
//
// Imported by next.config.ts through Node's own TypeScript loader: keep relative imports with
// explicit `.ts` extensions and type-only syntax in this file.
import { contentSecurityPolicy, securityHeaders, type SecurityOptions } from './security-headers.ts';

export const VOICE_DEMO_PATH = '/ai-receptionist';

const EXTRA_SOURCES: Record<string, readonly string[]> = {
  'script-src': ['blob:'],
  'connect-src': ['wss://livekit.rtc.elevenlabs.io', 'https://livekit.rtc.elevenlabs.io'],
};

function voiceDemoCsp(options: SecurityOptions): string {
  return contentSecurityPolicy(options)
    .split('; ')
    .map((directive) => {
      const [name] = directive.split(' ');
      const extra = name ? EXTRA_SOURCES[name] : undefined;
      return extra ? [directive, ...extra.filter((host) => !directive.includes(` ${host}`))].join(' ') : directive;
    })
    .join('; ');
}

export function voiceDemoHeaders(options: SecurityOptions): { key: string; value: string }[] {
  const sitewide = securityHeaders(options).find((header) => header.key === 'Permissions-Policy');
  return [
    { key: 'Content-Security-Policy', value: voiceDemoCsp(options) },
    {
      key: 'Permissions-Policy',
      value: (sitewide?.value ?? '').replace('microphone=()', 'microphone=(self)'),
    },
  ];
}
