// The AI voice clone demo's copy (/ai-voice-clone, R181; docs/plans/2026-10-25-ai-voice-clone-demo.md).
// A live conversation with the founder's AI twin, in his own cloned voice, made with his permission
// (owner, 2026-10-25). Labelled as live AI and as a clone, never as the person or a recording
// (10 §3.6). No vendor is named anywhere on the page (owner, 2026-10-25). Founder: company-facts §4.
import type { VoiceDemoCopy } from '@/content/en/ai-receptionist';

export const aiVoiceClone = {
  title: 'Talk to Our Founder’s AI Voice Clone, Live',
  description:
    'Talk to the AI twin of Jamsheed Khalid, founder of Deepzeta AI, speaking in his own cloned voice. Ask about our services in English or Arabic and hear what a voice clone can do for your business.',
  eyebrow: 'Live demo · AI voice clone',
  heading: 'Talk to our founder’s AI twin',
  answer:
    'This is an AI clone of Jamsheed Khalid’s own voice, made with his permission. Press start, allow your microphone and talk to it the way your customers would, in English or Arabic.',
  console: {
    name: 'Jamsheed’s AI twin',
    role: 'AI voice clone · Deepzeta AI',
    status: {
      idle: 'Ready when you are',
      connecting: 'Connecting…',
      listening: 'Listening',
      speaking: 'Speaking',
      ended: 'Call ended',
    },
    start: 'Start the conversation',
    again: 'Talk again',
    end: 'End call',
    mute: 'Mute microphone',
    unmute: 'Unmute microphone',
    transcriptLabel: 'Live transcript',
    transcriptEmpty: 'Your conversation appears here as you talk.',
    you: 'You',
    typeLabel: 'Or type a message',
    typePlaceholder: 'Type and press Enter',
    send: 'Send',
    micHint: 'Your browser asks for the microphone once. Headphones give the clearest call.',
    label: 'Live AI in a cloned voice, not Jamsheed himself and not a recording. It can make mistakes.',
    errors: {
      mic: 'Microphone access is blocked. Allow it from the icon in your browser’s address bar, then try again.',
      offline: 'The demo is offline right now. Message us on WhatsApp or book a free AI audit instead.',
      failed: 'The call couldn’t connect. Check your connection and try again.',
    },
  },
  tryHeading: 'Not sure what to say? Try one of these',
  tryHint: 'During a call, tap one to send it as your message.',
  prompts: [
    { text: 'Are you really Jamsheed, or an AI?', lang: 'en' },
    { text: 'Could a voice clone answer calls for my business?', lang: 'en' },
    { text: 'تقدر تكلمني بالعربي؟ أبغى أعرف عن أتمتة الواتساب', lang: 'ar' },
    { text: 'I run a clinic in Dubai. Can you answer our calls after hours?', lang: 'en' },
  ],
  steps: {
    heading: 'How the demo works',
    items: [
      { title: 'Press start', body: 'Allow the microphone when your browser asks. Nothing is heard before you start.' },
      {
        title: 'Talk naturally',
        body: 'Interrupt it, change the subject or switch between English and Arabic at any point.',
      },
      {
        title: 'Ask what fits',
        body: 'Tell it about your business and it explains which service fits and how to book a free AI audit.',
      },
    ],
  },
  privacy:
    'Your voice is processed by our voice AI service to run the call, and the conversation may be kept to improve it. Please don’t share sensitive personal details.',
  privacyLink: 'Privacy policy',
  next: {
    heading: 'Want your own voice answering your phone?',
    body: 'We build AI voice agents for UAE businesses, in a voice you choose or a clone of your own made with your permission: trained on your services and answering on your own number.',
  },
} as const satisfies VoiceDemoCopy;
