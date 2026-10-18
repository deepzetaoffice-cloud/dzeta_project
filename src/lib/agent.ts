// Whether the WhatsApp AI agent answers visitors live (header.md: the status island renders only while
// it does, never a fake "online"). The agent's go-live after the owner's full test
// (docs/owner/n8n-automation-setup-guide.md) sets it to true; until then the island is absent from the
// HTML, and only the review page shows it, so its design can be checked.
export const AGENT_LIVE = false;
