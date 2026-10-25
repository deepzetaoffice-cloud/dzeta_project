import type { Metadata } from 'next';
import { VoiceDemoPage } from '@/components/demos/VoiceDemoPage';
import { aiVoiceClone } from '@/content/en/ai-voice-clone';
import { pageMetadata } from '@/lib/seo/page-seo';
import { VOICE_CLONE_PATH } from '@/lib/voice-demo-headers';

// The AI voice clone demo (/ai-voice-clone, R181; docs/plans/2026-10-25-ai-voice-clone-demo.md): a live
// voice call with the founder's AI twin, speaking in his own cloned voice with his permission.
// Unlinked and noindex: the owner shares it by link. Its own headers allow the microphone (next.config.ts).
export const metadata: Metadata = {
  ...pageMetadata({
    title: aiVoiceClone.title,
    description: aiVoiceClone.description,
    path: VOICE_CLONE_PATH,
  }),
  robots: { index: false, follow: false },
};

export default function AiVoiceClonePage() {
  return <VoiceDemoPage copy={aiVoiceClone} agent="clone" />;
}
