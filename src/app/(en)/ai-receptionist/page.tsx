import type { Metadata } from 'next';
import { VoiceDemoPage } from '@/components/demos/VoiceDemoPage';
import { aiReceptionist } from '@/content/en/ai-receptionist';
import { pageMetadata } from '@/lib/seo/page-seo';
import { VOICE_DEMO_PATH } from '@/lib/voice-demo-headers';

// The AI receptionist demo (/ai-receptionist, R180; docs/plans/2026-10-25-ai-receptionist-demo.md):
// a live voice call with the agent that answers Deepzeta AI's own calls. Unlinked and noindex: the
// owner shares it by link. The page's own headers allow the microphone here only (next.config.ts).
export const metadata: Metadata = {
  ...pageMetadata({
    title: aiReceptionist.title,
    description: aiReceptionist.description,
    path: VOICE_DEMO_PATH,
  }),
  robots: { index: false, follow: false },
};

export default function AiReceptionistPage() {
  return <VoiceDemoPage copy={aiReceptionist} />;
}
