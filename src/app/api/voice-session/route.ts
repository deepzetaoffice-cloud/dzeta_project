// The AI receptionist demo's session route (/ai-receptionist; docs/plans/2026-10-25-ai-receptionist-demo.md).
// It mints a one-time WebRTC session token for the voice agent, so the API key stays on the server and
// the agent can stay private. Same-origin requests only: the demo page is the one caller. Never cached.
// /api/* is disallowed in robots.txt (registry R164).

export const dynamic = 'force-dynamic';

const TOKEN_ENDPOINT = 'https://api.elevenlabs.io/v1/convai/conversation/token';

function sameOrigin(request: Request): boolean {
  // Browsers send Sec-Fetch-Site on every fetch; Origin as a fallback for older ones.
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin';
  const origin = request.headers.get('origin');
  return origin !== null && origin === new URL(request.url).origin;
}

function reply(status: number, body: Record<string, string>) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request) {
  if (!sameOrigin(request)) return reply(403, { error: 'forbidden' });

  // No parameter: the receptionist (/ai-receptionist). `agent=clone`: the founder's AI twin
  // (/ai-voice-clone, docs/plans/2026-10-25-ai-voice-clone-demo.md). Anything else is refused.
  const agent = new URL(request.url).searchParams.get('agent');
  if (agent !== null && agent !== 'clone') return reply(400, { error: 'unknown' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = agent === 'clone' ? process.env.ELEVENLABS_CLONE_AGENT_ID : process.env.ELEVENLABS_AGENT_ID;
  if (!apiKey || !agentId) return reply(503, { error: 'offline' });

  try {
    const response = await fetch(`${TOKEN_ENDPOINT}?agent_id=${encodeURIComponent(agentId)}`, {
      headers: { 'xi-api-key': apiKey },
      cache: 'no-store',
    });
    if (!response.ok) return reply(502, { error: 'unavailable' });
    const data = (await response.json()) as { token?: unknown };
    if (typeof data.token !== 'string' || data.token === '') return reply(502, { error: 'unavailable' });
    return reply(200, { token: data.token });
  } catch {
    return reply(502, { error: 'unavailable' });
  }
}
