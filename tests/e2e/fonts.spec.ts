import { expect, test, type Page } from '@playwright/test';

// The fallback swap (docs/plans/2026-09-30-p2-layout-shell.md, section D3; decision 0015 §5).
// Montserrat uses display: swap, so a slow connection first paints the text in a local fallback,
// sized per weight in src/styles/font-fallbacks.css. One size per weight can't make every line break
// the same, because single letters differ by up to ±4% between the fonts. So the test checks what
// visitors see and what the faces control (the owner's choice, 2026-10-01):
// 1. Home's real swap, at 360 and 1280 px: the per-weight faces paint first, and the swap moves the
//    page by a CLS under 0.01.
// 2. A sweep over fixed site copy in each text style: the swap changes a block's line count at no
//    more than 8% of the widths. Measured 2026-10-01: these faces 1.0–6.9%; next/font's single Arial
//    face, before the fix, 10.7–19.7% at 360 px.
// It runs with the Arial family: Arial on Windows and macOS, Liberation Sans (its metric twin) on
// Linux and the CI runner. The Roboto family is checked on an Android phone (the owner checklist).
// Each test prints its measurements as a GitHub `::notice` line: a plain line locally, and a public
// annotation on CI, where the job logs need admin rights.
const MONTSERRAT = /montserrat[^/]*\.woff2/;
const ARIAL = { regular: ['ArialMT', 'LiberationSans'], bold: ['Arial-BoldMT', 'LiberationSans-Bold'] };
const MAX_CHANGE_RATE = 0.08;

// Fixed site copy: service names from the Services Catalogue for the headings, and paragraphs from
// the catalogue and the legal drafts for the body text. Fixed, so the rates don't move with edits.
const HEADINGS: string[] = [
  'Free AI Automation Audit',
  'AI Readiness Assessment (paid, in-depth)',
  'Website & AI Search Health Check',
  'WhatsApp AI Agent',
  'AI Voice Receptionist',
  'AI Outbound Calling Agent',
  'Website AI Chat Agent',
  'Omnichannel Inbox AI',
  'Internal Knowledge Assistant',
  'Custom AI Agents',
  'Speed-to-Lead System',
  'AI Lead Qualification & Scoring',
  'Automated Quotation & Quote Tracking System',
  'Proposal Automation',
  'Sales Follow-Up & Nurture Sequences',
  'CRM Setup & Automation',
  'AI Sales Prospecting & Outreach',
  'Booking Automation System',
  'Appointment Reminder & No-Show Reduction',
  'Viewing & Site-Visit Scheduling',
  'Event & Webinar Registration Automation',
  'Table & Reservation Automation',
  'AI Customer Support Automation',
  'Ticketing & Complaint Tracking System',
  'Review & Reputation Automation',
  'Loyalty, Renewal & Win-Back Automation',
  'Customer Onboarding Automation',
  'Job & Work-Order Management Automation',
  'Maintenance Contract & Preventive Maintenance Scheduling',
  'Inventory & Stock Automation',
  'Procurement & Supplier Automation',
  'Delivery & Logistics Tracking',
  'Task & Approval Workflows',
  'Invoicing & Payment Collection Automation',
  'UAE E-Invoicing Readiness & Integration',
  'Document & Invoice Data Extraction (AI OCR)',
  'Expense & Receipt Automation',
  'Accounting Sync & Reconciliation',
  'Contract Generation & E-Signature',
  'Recruitment Automation',
];
const PARAGRAPHS: string[] = [
  'Custom-coded, high-performance websites. Every site is hand-coded for the client. No page builders, no pre-designed templates, no plugin bloat. Fast by default.',
  'Search and AI ranking built into development. SEO, GEO (Generative Engine Optimisation) and AI ranking are part of how we build a website, not a service added afterwards. Every site is ready to rank on Google and to be cited by ChatGPT, Gemini, Perplexity and Google AI Overviews from launch day.',
  "Purpose-built agents that carry out multi-step tasks across the client's systems (for example: read an email, check stock, create an order, update the CRM, reply to the customer).",
  'Websites are a main deepzeta service and the base for most client growth. Every website we build, whatever its type, follows the same standard: custom code, high performance, and SEO, GEO and AI ranking built in during development.',
  'GEO and AI ranking setup: llms.txt, AI-readable content structure, direct-answer sections and FAQs, so ChatGPT, Gemini, Perplexity and Google AI Overviews can understand and cite the business',
  'Healthcare: follow UAE health-data rules (DHA in Dubai, DoH in Abu Dhabi, MOHAP elsewhere) and the federal law on health data. Do not refer to HIPAA, which is a US law.',
  'We handle personal data in line with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (the "PDPL") and the other UAE laws that apply to us.',
  'We build custom-coded websites, AI automations and growth systems for businesses in the UAE and the GCC. For the personal data described here, we are the controller: we decide why and how it is used.',
  "We collect the smallest amount of personal data that does the job. We don't ask for sensitive data (such as health, religion or biometric data) and ask you not to send it to us.",
  'From your public website: when you ask the Website & AI Search Health Check to review a web address, we read that public page. We never log in or collect personal data from it.',
  "AI agent demo: a demonstration. What you type is sent to our AI provider (DeepSeek) to generate replies. Please don't share personal or sensitive information in it. We don't keep demo conversations in our records.",
  'Social Media Content Planner: your answers about your business are sent to our AI provider to write your plan. If you ask for the full plan, we also receive your email address.',
  'Website & AI Search Health Check: checks the public page at the address you give, using Google PageSpeed Insights and our own checks. If you ask for the full report, we receive your email address.',
  'We use a small number of service providers to run this website and our services. They process data on our behalf, for the purposes in this policy only.',
  'Some of our providers store or process data outside the UAE, for example in the European Union, the United States or China. When that happens, we transfer it only as the PDPL allows, and we choose providers that commit to protecting it.',
  'We keep personal data only as long as we need it for the purpose you gave it for, or as long as the law requires. Then we delete it or make it anonymous.',
  "Our services are for businesses. We don't knowingly collect personal data from anyone under 18. If you think a child has sent us personal data, contact us and we'll delete it.",
  "This site links to other websites, such as our social profiles and official sources. They have their own privacy policies, and we're not responsible for them.",
  'When we change how we handle personal data, we update this page and its "Last updated" date. If a change is significant, we\'ll also tell clients by email.',
  'No. We never sell or rent your personal data, and we never give it to other companies for their own marketing. Service providers such as our hosting and email companies process it only to run our services for you.',
  "Your name, business name, email, phone or WhatsApp number, the service you're interested in and your message. If you arrived from a link or an ad, we also save the campaign tag. We use this only to prepare and schedule your audit.",
  'Yes. Essential cookies keep the site secure and working. Analytics and marketing cookies stay off until you allow them, and you can change your choice at any time from "Cookie settings" at the bottom of every page.',
  'Our main service providers are Vercel (hosting), Google (email, customer records and, with consent, analytics), n8n (automation), DeepSeek (AI demos), Cloudflare (spam protection), Upstash (abuse limits), Cal.com (booking) and Meta (WhatsApp). Section 7 lists what each one does.',
  'Not always. Some of our providers store or process data outside the UAE, for example in the European Union, the United States or China. We transfer data only as the UAE PDPL allows and choose providers that commit to protecting it.',
];

// Each text style as the tokens set it (docs/ai/05 §3), with the platform face its weight's fallback
// uses. Headings balance their lines, as the base style does.
const STYLES = {
  h1: {
    face: ARIAL.bold,
    texts: HEADINGS,
    css: 'font:700 var(--dz-text-h1)/var(--dz-text-h1-leading) var(--dz-font-sans);letter-spacing:var(--dz-text-h1-tracking);text-wrap:balance',
  },
  display: {
    face: ARIAL.bold,
    texts: HEADINGS,
    css: 'font:800 var(--dz-text-display)/var(--dz-text-display-leading) var(--dz-font-sans);letter-spacing:var(--dz-text-display-tracking);text-wrap:balance',
  },
  body: {
    face: ARIAL.regular,
    texts: PARAGRAPHS,
    css: 'font:400 var(--dz-text-body)/var(--dz-text-body-leading) var(--dz-font-sans)',
  },
  small: {
    face: ARIAL.regular,
    texts: PARAGRAPHS,
    css: 'font:500 var(--dz-text-small)/var(--dz-text-small-leading) var(--dz-font-sans)',
  },
};
// The block widths swept at each viewport (the viewport sets the fluid type sizes).
const SWEEP = { 360: { from: 240, to: 340, step: 2 }, 1280: { from: 400, to: 1140, step: 8 } };

// Holds the Montserrat request until `release` is called, so the fallback paints first.
async function holdMontserrat(page: Page) {
  let release = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route(MONTSERRAT, async (route) => {
    await held;
    await route.continue();
  });
  return () => release();
}

// The platform font Chromium used for an element's text, by PostScript name ("a+b" if it used more
// than one), so a check can ask for exactly one of the expected faces.
const platformFont = async (page: Page, selector: string) => (await platformFonts(page, selector)).join('+');

async function platformFonts(page: Page, selector: string) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
  const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
  await cdp.detach();
  return fonts.map((font) => (font.isCustomFont ? 'web font' : font.postScriptName));
}

const montserratLoaded = (page: Page) =>
  page.evaluate(() =>
    [...document.fonts].some(
      (face) => /montserrat/i.test(face.family) && !/fallback/i.test(face.family) && face.status === 'loaded',
    ),
  );

// Two frames, so layout and any layout-shift entry of the last change are done.
const settle = (page: Page) =>
  page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

async function swapMontserrat(page: Page, release: () => void) {
  release();
  await expect.poll(() => montserratLoaded(page)).toBe(true);
  await settle(page);
}

test.describe('Fonts: the fallback swap (plan D3)', () => {
  for (const width of [360, 1280] as const) {
    test(`at ${width}px, Home paints the per-weight fallbacks first and the swap moves nothing`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await context.newPage();
      await page.addInitScript(() => {
        const shifts: number[] = [];
        Object.assign(window, { __shifts: shifts });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[])
            if (!entry.hadRecentInput) shifts.push(entry.value);
        }).observe({ type: 'layout-shift', buffered: true });
      });
      const release = await holdMontserrat(page);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.locator('h1').waitFor();
      await settle(page);
      expect(await montserratLoaded(page), 'Montserrat is still held back').toBe(false);
      // Arial Bold for the 700 heading and Arial for the 400 body, never a synthesised bold. Soft, so a
      // wrong face still reports what the swap did.
      const faces = { h1: await platformFont(page, 'main h1'), p: await platformFont(page, 'main p') };
      expect.soft(ARIAL.bold, 'main h1: fallback face').toContain(faces.h1);
      expect.soft(ARIAL.regular, 'main p: fallback face').toContain(faces.p);

      await swapMontserrat(page, release);
      expect(await platformFonts(page, 'main h1')).toEqual(['web font']);
      const cls = await page.evaluate(() =>
        (window as unknown as { __shifts: number[] }).__shifts.reduce((sum, value) => sum + value, 0),
      );
      console.log(`::notice title=Fonts, Home swap at ${width}px::h1 ${faces.h1}, p ${faces.p}, CLS ${cls.toFixed(4)}`);
      expect(cls).toBeLessThan(0.01);
      await context.close();
    });

    test(`at ${width}px, the swap changes the line count of site copy at no more than 8% of widths`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await context.newPage();
      const release = await holdMontserrat(page);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.locator('h1').waitFor();

      // The copy, one block per text and style, out of the page's flow.
      await page.evaluate((styles) => {
        const lab = document.createElement('div');
        lab.id = 'font-lab';
        lab.style.cssText = 'position:absolute;inset-block-start:0;inset-inline-start:0';
        for (const [name, style] of Object.entries(styles))
          for (const text of style.texts) {
            const block = document.createElement('div');
            block.dataset.style = name;
            block.style.cssText = style.css;
            block.textContent = text;
            lab.append(block);
          }
        document.body.append(lab);
      }, STYLES);
      await settle(page);
      const faces: Record<string, string> = {};
      for (const [name, style] of Object.entries(STYLES)) {
        faces[name] = await platformFont(page, `#font-lab [data-style="${name}"]`);
        expect.soft(style.face, `${name}: fallback face`).toContain(faces[name]);
      }

      const { from, to, step } = SWEEP[width];
      const widths = Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
      // Each block's line count at each width: its height over its explicit line-height.
      const sweep = () =>
        page.evaluate((widths) => {
          const blocks = [...document.querySelectorAll<HTMLElement>('#font-lab > div')].map((el) => ({
            el,
            style: el.dataset.style ?? '',
            lines: [] as number[],
          }));
          for (const w of widths) {
            for (const block of blocks) block.el.style.width = `${w}px`;
            for (const block of blocks)
              block.lines.push(
                Math.round(block.el.getBoundingClientRect().height / parseFloat(getComputedStyle(block.el).lineHeight)),
              );
          }
          return blocks.map(({ style, lines }) => ({ style, lines }));
        }, widths);
      const before = await sweep();
      await swapMontserrat(page, release);
      const after = await sweep();

      const rates = Object.keys(STYLES).map((name) => {
        let samples = 0;
        let changed = 0;
        before.forEach((block, i) => {
          if (block.style !== name) return;
          block.lines.forEach((lines, j) => {
            samples += 1;
            if (after[i]?.lines[j] !== lines) changed += 1;
          });
        });
        return { name, samples, rate: changed / samples };
      });
      const summary = rates.map(({ name, rate }) => `${name} ${faces[name]} ${(rate * 100).toFixed(1)}%`);
      console.log(`::notice title=Fonts, copy sweep at ${width}px::${summary.join(' · ')}`);
      for (const { name, samples, rate } of rates) {
        expect(samples, name).toBeGreaterThan(0);
        expect.soft(rate, `${name}: share of widths where the line count changed`).toBeLessThanOrEqual(MAX_CHANGE_RATE);
      }
      await context.close();
    });
  }
});
