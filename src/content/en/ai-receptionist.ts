// The AI receptionist demo's copy (/ai-receptionist, R180; docs/plans/2026-10-25-ai-receptionist-demo.md).
// A real, live conversation with the agent that answers Deepzeta AI's own calls, so it's labelled as
// live AI and never as a recording (10 §3.6). No vendor is named anywhere on the page (owner, 2026-10-25).

export const aiReceptionist = {
  title: 'Talk to Our AI Receptionist, Live',
  description:
    'Talk to Sara, the AI receptionist that answers Deepzeta AI’s calls. Ask about our services in English or Arabic and hear how she would handle your customers.',
  eyebrow: 'Live demo · AI receptionist',
  heading: 'Talk to our AI receptionist',
  answer:
    'Sara answers Deepzeta AI’s calls and website visitors. Press start, allow your microphone and talk to her the way your customers would, in English or Arabic.',
  console: {
    name: 'Sara',
    role: 'AI receptionist · Deepzeta AI',
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
    label: 'Live AI, not a recording. It can make mistakes.',
    errors: {
      mic: 'Microphone access is blocked. Allow it from the icon in your browser’s address bar, then try again.',
      offline: 'The demo is offline right now. Message us on WhatsApp or book a free AI audit instead.',
      failed: 'The call couldn’t connect. Check your connection and try again.',
    },
  },
  tryHeading: 'Not sure what to say? Try one of these',
  tryHint: 'During a call, tap one to send it as your message.',
  prompts: [
    { text: 'I run a clinic in Dubai. Can you answer our calls after hours?', lang: 'en' },
    { text: 'What does a custom-coded website include?', lang: 'en' },
    { text: 'تقدرين تكلميني بالعربي؟ أبغى أعرف عن أتمتة الواتساب', lang: 'ar' },
    { text: 'How would an AI receptionist work for my business?', lang: 'en' },
  ],
  steps: {
    heading: 'How the demo works',
    items: [
      { title: 'Press start', body: 'Allow the microphone when your browser asks. Nothing is heard before you start.' },
      {
        title: 'Talk naturally',
        body: 'Interrupt her, change the subject or switch between English and Arabic at any point.',
      },
      {
        title: 'Ask what fits',
        body: 'Tell her about your business and she explains which service fits and how to book a free AI audit.',
      },
    ],
  },
  privacy:
    'Your voice is processed by our voice AI service to run the call, and the conversation may be kept to improve it. Please don’t share sensitive personal details.',
  privacyLink: 'Privacy policy',
  next: {
    heading: 'Want this answering your phone?',
    body: 'We build AI receptionists like Sara for UAE businesses: trained on your services, speaking your brand’s language, answering on your own number.',
  },
} as const;
