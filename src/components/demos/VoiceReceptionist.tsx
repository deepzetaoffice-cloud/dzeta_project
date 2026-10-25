'use client';

// The AI receptionist demo's console (/ai-receptionist; docs/plans/2026-10-25-ai-receptionist-demo.md):
// a live voice call with Deepzeta AI's own receptionist, in the browser, in the site's own design.
// - The session token comes from our server (/api/voice-session); the key never reaches the browser.
// - The microphone is asked for inside the click, so the browser's prompt follows the visitor's action.
// - The orb and its ring follow the voice level only while a call is live, effects are on and the tab
//   is visible (13 §3.9); otherwise the orb's colour and the status text carry the state.
// - The transcript is a polite live region; typed messages and the prompt chips use the same session.
import { ConversationProvider, useConversation } from '@elevenlabs/react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Glyph } from '@/components/ui/Glyph';
import type { aiReceptionist } from '@/content/en/ai-receptionist';
import { FX_MEDIA } from '@/lib/fx/preferences';

type Copy = typeof aiReceptionist;
type Line = { id: number; role: 'user' | 'agent'; text: string };
type Phase = 'idle' | 'connecting' | 'live' | 'ended';
type Problem = keyof Copy['console']['errors'] | null;

const BARS = 36;
const BAR_INDEXES = Array.from({ length: BARS }, (_, index) => index);

async function fetchToken(): Promise<string | 'offline' | 'failed'> {
  try {
    const response = await fetch('/api/voice-session', { cache: 'no-store' });
    if (response.status === 503) return 'offline';
    if (!response.ok) return 'failed';
    const data = (await response.json()) as { token?: unknown };
    return typeof data.token === 'string' && data.token !== '' ? data.token : 'failed';
  } catch {
    return 'failed';
  }
}

function effectsOn(): boolean {
  return window.matchMedia(FX_MEDIA).matches && document.documentElement.dataset.effects !== 'reduced';
}

export type VoiceReceptionistProps = { copy: Copy };

export function VoiceReceptionist({ copy }: VoiceReceptionistProps) {
  return (
    <ConversationProvider>
      <Console copy={copy} />
    </ConversationProvider>
  );
}

function Console({ copy }: VoiceReceptionistProps) {
  const text = copy.console;
  const [phase, setPhase] = useState<Phase>('idle');
  const [problem, setProblem] = useState<Problem>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [muted, setMuted] = useState(false);
  const [draft, setDraft] = useState('');
  const nextId = useRef(0);
  const tokenRef = useRef<Promise<string | 'offline' | 'failed'> | null>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback((role: Line['role'], message: string) => {
    const trimmed = message.trim();
    if (trimmed === '') return;
    nextId.current += 1;
    const id = nextId.current;
    setLines((current) => [...current, { id, role, text: trimmed }]);
  }, []);

  const conversation = useConversation({
    micMuted: muted,
    onConnect: () => {
      setPhase('live');
      setProblem(null);
    },
    onDisconnect: () => setPhase((current) => (current === 'idle' ? 'idle' : 'ended')),
    onError: () => {
      setProblem('failed');
      setPhase('idle');
    },
    onMessage: ({ message, role }) => addLine(role === 'user' ? 'user' : 'agent', message),
  });
  const { startSession, endSession, sendUserMessage, isSpeaking, status } = conversation;
  const live = phase === 'live' && status === 'connected';

  // The latest controls for the animation loop, kept outside render
  const controlsRef = useRef(conversation);
  useEffect(() => {
    controlsRef.current = conversation;
  });

  // A token on the visitor's intent (pointer, focus or touch on Start), so the click starts at once
  const prefetch = useCallback(() => {
    tokenRef.current ??= fetchToken();
  }, []);

  const start = useCallback(async () => {
    setProblem(null);
    setPhase('connecting');
    setLines([]);
    const tokenPromise = tokenRef.current ?? fetchToken();
    tokenRef.current = null; // one token per call
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      for (const track of stream.getTracks()) track.stop();
    } catch {
      setProblem('mic');
      setPhase('idle');
      return;
    }
    const token = await tokenPromise;
    if (token === 'offline' || token === 'failed') {
      setProblem(token);
      setPhase('idle');
      return;
    }
    startSession({ conversationToken: token, connectionType: 'webrtc' });
  }, [startSession]);

  const end = useCallback(() => {
    endSession();
    setPhase('ended');
  }, [endSession]);

  const send = useCallback(
    (message: string) => {
      if (!live || message.trim() === '') return;
      sendUserMessage(message.trim());
      addLine('user', message);
    },
    [live, sendUserMessage, addLine],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(draft);
    setDraft('');
  };

  // Keep the newest line in view
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines]);

  // The orb and the ring follow the voice while a call is live (the proposed `voice-orb`)
  useEffect(() => {
    const orb = orbRef.current;
    const ring = barsRef.current;
    if (!live || !orb || !ring || !effectsOn()) return;
    const bars = Array.from(ring.children) as HTMLElement[];
    let frame = 0;
    const tick = () => {
      if (!document.hidden) {
        const controls = controlsRef.current;
        const level = Math.min(1, Math.max(controls.getOutputVolume(), controls.getInputVolume() * 0.8));
        orb.style.setProperty('--dz-voice-level', String(1 + level * 0.16));
        const spectrum = controls.getOutputByteFrequencyData();
        const usable = Math.max(1, Math.floor(spectrum.length * 0.45));
        bars.forEach((bar, index) => {
          const value = spectrum.length > 0 ? (spectrum[Math.floor((index / BARS) * usable)] ?? 0) / 255 : 0;
          bar.style.setProperty('--dz-voice-bar', String(0.12 + value * 0.88));
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      orb.style.removeProperty('--dz-voice-level');
      for (const bar of bars) bar.style.removeProperty('--dz-voice-bar');
    };
  }, [live]);

  const statusText = live
    ? isSpeaking
      ? text.status.speaking
      : text.status.listening
    : phase === 'connecting'
      ? text.status.connecting
      : phase === 'ended'
        ? text.status.ended
        : text.status.idle;
  const state = live ? (isSpeaking ? 'speaking' : 'listening') : phase === 'connecting' ? 'connecting' : 'idle';

  return (
    <section aria-labelledby="dz-voice-name" className="dz-voice" data-state={state}>
      <header className="flex items-center justify-between gap-4">
        <div className="grid gap-0.5">
          <h2 id="dz-voice-name" className="text-h4">
            {text.name}
          </h2>
          <p className="font-mono text-label uppercase text-ink-secondary">{text.role}</p>
        </div>
        <p className="dz-voice-status inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-caption">
          <span aria-hidden="true" className={['size-2 rounded-full', live ? 'dz-pulse' : ''].join(' ')} />
          <span aria-live="polite">{statusText}</span>
        </p>
      </header>

      <div className="dz-voice-stage" aria-hidden="true">
        <div ref={barsRef} className="dz-voice-ring">
          {BAR_INDEXES.map((index) => (
            <span key={index} style={{ '--dz-voice-i': index } as CSSProperties} />
          ))}
        </div>
        <div ref={orbRef} className="dz-voice-orb">
          <span className="dz-voice-orb-shine" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {live ? (
          <>
            <button
              type="button"
              onClick={end}
              className="dz-press inline-flex min-h-14 items-center gap-2 rounded-full bg-action-inverse px-7 text-button-l text-on-color"
            >
              <Glyph name="close" className="size-5" />
              {text.end}
            </button>
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-pressed={muted}
              className="dz-press inline-flex min-h-14 items-center rounded-full border border-line-strong bg-surface px-6 text-button-m text-ink"
            >
              {muted ? text.unmute : text.mute}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={start}
            onPointerEnter={prefetch}
            onFocus={prefetch}
            onTouchStart={prefetch}
            disabled={phase === 'connecting'}
            aria-busy={phase === 'connecting'}
            className="dz-press inline-flex min-h-14 items-center gap-2 rounded-full bg-action px-7 text-button-l text-on-color disabled:opacity-70"
          >
            <Glyph name="phone" className="size-5" />
            {phase === 'connecting' ? text.status.connecting : phase === 'ended' ? text.again : text.start}
          </button>
        )}
      </div>

      <p
        role={problem ? 'alert' : undefined}
        className={['text-center text-small', problem ? 'text-error' : 'text-ink-secondary'].join(' ')}
      >
        {problem ? text.errors[problem] : text.micHint}
      </p>

      <div className="dz-voice-log-wrap">
        <p className="font-mono text-label uppercase text-ink-secondary">{text.transcriptLabel}</p>
        <div ref={logRef} role="log" aria-live="polite" aria-label={text.transcriptLabel} className="dz-voice-log">
          {lines.length === 0 ? (
            <p className="text-small text-ink-secondary">{text.transcriptEmpty}</p>
          ) : (
            lines.map((line) => (
              <p key={line.id} className="dz-voice-line" data-role={line.role} dir="auto">
                <span className="sr-only">{line.role === 'user' ? text.you : text.name}: </span>
                {line.text}
              </p>
            ))
          )}
        </div>
        {live ? (
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <label htmlFor="dz-voice-input" className="sr-only">
              {text.typeLabel}
            </label>
            <input
              id="dz-voice-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={text.typePlaceholder}
              dir="auto"
              autoComplete="off"
              className="min-h-11 flex-1 rounded-full border border-line-field bg-surface px-4 text-small text-ink"
            />
            <button
              type="submit"
              aria-label={text.send}
              className="dz-press inline-flex size-11 items-center justify-center rounded-full bg-action text-on-color"
            >
              <Glyph name="send" className="size-5" />
            </button>
          </form>
        ) : null}
      </div>

      <div className="grid gap-3">
        <h3 className="text-button-m text-ink">{copy.tryHeading}</h3>
        <p className="text-small text-ink-secondary">{copy.tryHint}</p>
        <ul className="flex flex-wrap gap-2">
          {copy.prompts.map((prompt) => (
            <li key={prompt.text} lang={prompt.lang} dir={prompt.lang === 'ar' ? 'rtl' : 'ltr'}>
              {live ? (
                <button
                  type="button"
                  onClick={() => send(prompt.text)}
                  className="dz-press inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-4 text-start text-small text-ink"
                >
                  {prompt.text}
                </button>
              ) : (
                <span className="inline-flex min-h-11 items-center rounded-full bg-violet-soft px-4 text-small text-violet">
                  {prompt.text}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-center text-caption text-ink-tertiary">{text.label}</p>
    </section>
  );
}
