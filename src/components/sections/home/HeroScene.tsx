import { Glyph } from '@/components/ui/Glyph';
import { heroScene } from '@/content/en/home';

// The hero's scene, from message to booking (message-to-booking; home.md §01; Figma 50:215 desktop,
// 56:956 mobile). An example, labelled as one (10 §3.6): a lead arrives on WhatsApp, the agent
// replies, the slot locks in the calendar and the CRM record fills. Every line is real HTML text.
// - The server renders the final state, so without JavaScript, under Reduce effects and for crawlers
//   the whole story is there. src/lib/fx/home/scene.ts pins it while the visitor scrolls (~150 vh),
//   steps it through 01 Message → 02 Reply → 03 Booked → 04 CRM and lets the phone be dragged ±25°
//   (CSS 3D, with real depth on its edge). The scrubber's steps are buttons, so the story also runs by
//   keyboard.
// - Decorative to a screen reader beyond its text: the cards are a figure with a caption.

export function HeroScene() {
  const { phone, booking, calendar, crm, notification } = heroScene;
  const bookedAt = `${booking.day} ${booking.time}`;
  return (
    <figure className="dz-scene" data-step="4" aria-label={heroScene.label}>
      <div className="dz-scene-frame">
        <p className="dz-scene-chip">
          <span aria-hidden="true" className="size-2 rounded-xs bg-on-color" />
          {heroScene.label}
        </p>

        {/* The lead notification stack (KokonutUI CD-08): three cards, the front one readable */}
        <div className="dz-scene-stack" data-scene-part="1">
          <span aria-hidden="true" className="dz-scene-note dz-scene-note-back" />
          <span aria-hidden="true" className="dz-scene-note dz-scene-note-mid" />
          <div className="dz-scene-note">
            <span aria-hidden="true" className="size-10 shrink-0 rounded-md bg-action" />
            <span className="grid gap-0.5 text-start text-caption">
              <span className="text-ink">{notification.title}</span>
              <span className="text-ink-secondary">{notification.text}</span>
            </span>
          </div>
        </div>

        {/* The phone: its screen is HTML; its edge gives it depth when it turns */}
        <div className="dz-phone-stage" data-scene-drag="">
          <div className="dz-phone">
            <span aria-hidden="true" className="dz-phone-edge" />
            <div className="dz-phone-body">
              <div className="dz-phone-screen">
                <div className="dz-phone-top">
                  <span aria-hidden="true" className="dz-phone-island" />
                  <div className="flex w-full items-center gap-2.5">
                    <span aria-hidden="true" className="dz-phone-avatar" />
                    <span className="grid text-start">
                      <span className="dz-phone-name">{phone.business}</span>
                      <span className="dz-phone-status">
                        <span aria-hidden="true" className="dz-phone-online" />
                        {phone.status}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="dz-phone-chat">
                  <span className="dz-phone-label">{heroScene.label}</span>
                  <p className="dz-bubble dz-bubble-own" data-scene-part="1">
                    {phone.customer}
                  </p>
                  <p className="dz-bubble" data-scene-part="2">
                    {phone.agent}
                  </p>
                  <p className="dz-phone-booked" data-scene-part="3">
                    <span aria-hidden="true" className="size-2.5 rounded-full bg-(image:--dz-grad-pillar-ai)" />
                    {phone.booked} · {bookedAt}
                  </p>
                </div>
                <div className="dz-phone-input" aria-hidden="true">
                  <span className="dz-phone-field">{phone.input}</span>
                  <span className="dz-phone-send">
                    <Glyph name="send" className="size-4.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="dz-scene-drag" aria-hidden="true">
          {heroScene.drag}
        </p>

        {/* Booking Automation System: the slot locks when the agent confirms (example) */}
        <div className="dz-mock dz-mock-calendar" data-scene-part="3">
          <p className="flex items-center justify-between">
            <span className="dz-mock-title">{calendar.title}</span>
            <span className="dz-mock-label">{calendar.week}</span>
          </p>
          {calendar.days.map((day) => (
            <p key={day.day} className="flex items-center gap-2">
              <span className="dz-mock-day">{day.day}</span>
              {day.slots.map((slot) => {
                const locked = day.day === calendar.days[1].day && slot === booking.time;
                return (
                  <span key={slot} className={locked ? 'dz-slot dz-slot-locked' : 'dz-slot'}>
                    {locked ? `${slot} · ${calendar.locked}` : slot}
                  </span>
                );
              })}
            </p>
          ))}
        </div>

        {/* CRM Setup & Automation: the lead record updates itself (example) */}
        <div className="dz-mock dz-mock-crm" data-scene-part="4">
          <p className="dz-mock-label">{crm.label}</p>
          <p className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-7 shrink-0 rounded-full bg-action" />
            <span className="dz-mock-title">{crm.title}</span>
          </p>
          <dl className="grid gap-2.5 text-caption">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-secondary">{crm.status}</dt>
              <dd className="font-medium text-ink">{phone.booked}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-secondary">{crm.booking}</dt>
              <dd className="font-medium text-ink">{bookedAt}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-secondary">{crm.next}</dt>
              <dd className="text-end font-medium text-ink">{crm.nextValue}</dd>
            </div>
          </dl>
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-soft px-2.5 py-1.5 text-caption text-violet">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent-online" />
            {crm.notified}
          </p>
        </div>

        {/* The scrubber (C diagram language): scroll-driven, and each step a button */}
        <div className="dz-scene-scrub">
          <p className="dz-mock-label">{heroScene.scrub}</p>
          <ol className="dz-scrubber" data-scrubber="">
            {heroScene.steps.map((step, index) => (
              <li key={step}>
                <button type="button" className="dz-scrub-step" data-scrub-step={index + 1}>
                  <span aria-hidden="true" className="dz-scrub-dot" />
                  <span>
                    <span className="dz-num" data-num={String(index + 1).padStart(2, '0')} /> {step}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </figure>
  );
}
