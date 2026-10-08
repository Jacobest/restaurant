// Per use case: words for the page, the example numbers, and which bot messages are business-started templates
// (sent after the 24-hour window has closed). Every other bot message is a service message (a free-form reply inside
// the window). The person's own messages are always free.
// templates: [{ step: step title, n: which bot message in that step (0 = first), kind: 'utility' | 'marketing' | 'feedback', label }]
// 'feedback' is a survey template. Meta may review it as utility or as marketing, so the page has a switch. ⚠
import { MORE } from './costs-more.mjs';
const BASE_COSTS = {
  'doctors-appointment': {
    who: 'patient', whoPlural: 'patients', bizNoun: 'practice', unit: 'appointment',
    journeyText: 'Booking, reminder, change of time and follow-up',
    templateExample: 'an appointment reminder',
    windowNote: 'The first message from the patient opens a 24-hour window. Inside it the bot may reply freely. The reminder goes out the day before, when the window has closed, so it has to be an approved template. When the patient answers, a new 24-hour window opens. The follow-up after the visit is again a template.',
    templates: [
      { step: 'Reminders', n: 0, kind: 'utility', label: 'Appointment reminder, sent the day before (template)' },
      { step: 'After the visit', n: 0, kind: 'feedback', label: 'Feedback request, sent after the visit (template)' },
    ],
    roi: {
      fee: 650, feeLabel: 'Average consultation fee (rand) — example', nsLabel: 'Share of appointments that are no-shows today — example', nsDefault: 12,
      redLabel: 'No-shows prevented — S10U’s reported result for one healthcare client: 28%', redDefault: 28,
      note: 'The 28% comes from S10U’s own healthcare case study (missed consultations down 28%, reminders on WhatsApp). It is S10U’s claim for a different client, not a promise for this practice. ⚠ Also count reception time saved on phone calls: it is not included above.',
      lead: 'Reminders and easy rescheduling cut no-shows. Try the practice’s own numbers. The starting fee and no-show rate are examples, not facts.',
      valueLabel: 'fees recovered per month', meetingLine: 'one consultation fee',
    },
    privacyTitle: 'Health information (POPIA)',
    privacy: [
      'Health information is special personal information. The bot collects booking details only: name, time, reason for the visit in broad terms. It gives no clinical advice.',
      'The practice is the responsible party. S10U, the AI provider and Meta are operators and need written agreements. Overseas AI is a cross-border transfer: tell patients.',
      'Add a short privacy notice and a “stop” option at booking. Get legal sign-off before going live. This is not legal advice.',
    ],
    startTip: 'Start with reminders. They cost one cheap template each and bring the clearest saving.',
    moreCosts: 'Card fees on any booking fee paid by payment link (the payment gateway) are separate.',
  },
  'restaurant-booking': {
    who: 'guest', whoPlural: 'guests', bizNoun: 'restaurant', unit: 'booking',
    journeyText: 'Booking, pre-order, two reminders, the bill and an anniversary invitation',
    templateExample: 'a booking reminder',
    windowNote: 'The first message from the guest opens a 24-hour window. Inside it the bot may reply freely. The two reminders and the welcome on arrival go out days or hours later, after the window has closed, so each one is an approved template. When the guest pays by WhatsApp a new window opens. The anniversary invitation weeks later is again a template, and a marketing one, which costs about four times more.',
    templates: [
      { step: 'Reminders', n: 0, kind: 'utility', label: 'Booking reminder, sent the day before (template)' },
      { step: 'Reminders', n: 1, kind: 'utility', label: 'Two-hour reminder (template)' },
      { step: 'Dine', n: 0, kind: 'utility', label: 'Welcome on arrival (template). Meta may review it as marketing ⚠' },
      { step: 'Bill and payment', n: 0, kind: 'utility', label: 'The bill with a payment request (template)' },
      { step: 'Rewards and special days', n: 2, kind: 'marketing', label: 'Anniversary invitation, 14 days before (marketing template)' },
    ],
    roi: {
      fee: 1240, feeLabel: 'Average spend per booking (rand) — example from the demo bill', nsLabel: 'Share of bookings that are no-shows today — example', nsDefault: 12,
      redLabel: 'No-shows prevented by reminders — example only', redDefault: 15,
      note: 'S10U has not published a restaurant result. Its healthcare study reported 28% fewer missed consultations, which is a different business. Use the restaurant’s own estimate. ⚠ Also count the repeat visits from the anniversary and rewards messages: they are not included above.',
      lead: 'Reminders and easy changes cut no-shows and empty tables. Try the restaurant’s own numbers. The starting spend, no-show rate and reduction are examples, not facts.',
      valueLabel: 'spend recovered per month', meetingLine: 'one booking’s spend',
    },
    privacyTitle: 'Privacy (POPIA)',
    privacy: [
      'Dietary notes and allergies can be health information. Keep only what the kitchen needs, and do not share it with anyone else.',
      'The restaurant is the responsible party. S10U, the AI provider and Meta are operators and need written agreements. Overseas AI is a cross-border transfer: tell guests.',
      'Offers and the anniversary invitation need the guest’s opt-in, and a “stop” option on every message. This is not legal advice.',
    ],
    startTip: 'Start with the booking reminders. They cost one cheap template each and fill tables that would sit empty.',
    moreCosts: 'Card fees on the bill paid by payment link (the payment gateway) are separate.',
  },
  'salon-booking': {
    who: 'client', whoPlural: 'clients', bizNoun: 'salon', unit: 'booking',
    journeyText: 'Booking, deposit, a reminder, a late-arrival reply and the thank-you',
    templateExample: 'a booking reminder',
    windowNote: 'The first message from the client opens a 24-hour window. Inside it the bot replies freely, including the deposit link. The reminder the day before goes out after that window has closed, so it is an approved template. When the client answers, a new window opens: the 1-hour reminder, the late-arrival reply and the thank-you after the visit all fall inside it, so they are normal replies. A rebooking nudge weeks later would be a template again.',
    templates: [
      { step: 'Reminders', n: 0, kind: 'utility', label: 'Booking reminder, sent the day before (template)' },
    ],
    roi: {
      fee: 970, feeLabel: 'Average value of a booking (rand) — example from the demo: R850 colour plus R120 blow-dry', nsLabel: 'Share of bookings that are no-shows or late cancellations today — example', nsDefault: 10,
      redLabel: 'No-shows prevented by reminders and the deposit — example only', redDefault: 20,
      note: 'S10U has not published a salon result. Its healthcare study reported 28% fewer missed consultations, which is a different business. Use the salon’s own estimate. ⚠ Not counted: rebooking messages and the time saved on answering messages one by one.',
      lead: 'A reminder and a small deposit protect the stylist’s time. Try the salon’s own numbers. The starting value, no-show rate and reduction are examples, not facts.',
      valueLabel: 'booking value recovered per month', meetingLine: 'one booking’s value',
    },
    privacyTitle: 'Privacy (POPIA)',
    privacy: [
      'Keep to what the stylist needs: name, number, service and time. Notes about allergies or skin conditions can be health information, so store only what is needed.',
      'The salon is the responsible party. S10U, the AI provider and Meta are operators and need written agreements. Overseas AI is a cross-border transfer: tell clients.',
      'Rebooking offers need the client’s opt-in, and a “stop” option on every message. This is not legal advice.',
    ],
    startTip: 'Start with reminders and a deposit. A cheap reminder and a small deposit protect the stylist’s time.',
    moreCosts: 'Card fees on the R100 deposit (the payment gateway) are separate.',
  },
  'lead-capture': {
    who: 'lead', whoPlural: 'leads', bizNoun: 'business', unit: 'lead',
    convLabel: 'Leads starting a chat on WhatsApp per month',
    freeEntry: true,
    skipSteps: ['Behind the scenes'],
    skipNote: 'The “Behind the scenes” step in the demo is what your team sees in the CRM. It is not a WhatsApp message to the lead, so it is left out of the cost.',
    journeyText: 'Ad, qualifying questions, an estimate, a booked call, a reminder and the quote',
    templateExample: 'a call reminder',
    windowNote: 'The lead’s first message opens a 24-hour window, and because it came from an ad it also opens a 72-hour free window. Here the whole conversation is quick and sits inside both windows. If the lead had come from a link or a QR code, there would be no free window, but every reply here would still fall inside a 24-hour window the lead opened, so none needs a template.',
    templates: [],
    roi: {
      fee: 80000, feeLabel: 'Average value of a sale (rand) — example', nsLabel: 'Share of leads that become sales today — example', nsDefault: 3,
      redLabel: 'Extra sales from instant replies and booked calls — example only', redDefault: 10,
      prevLabel: 'extra sales per month', valueLabel: 'extra sales value per month', meetingLine: 'one sale’s value',
      lead: 'Answering at once, asking the right questions and booking the call can lift how many leads become sales. Try the business’s own numbers. The sale value, today’s conversion and the lift are examples, not facts.',
      note: 'S10U’s case studies report gains for other clients (for example finance leads +18% in an automotive study). They are S10U’s claims for different businesses, not a promise here. ⚠ The ad spend itself is not included: add it before you compare.',
    },
    privacyTitle: 'Privacy (POPIA)',
    privacy: [
      'Keep to what the quote needs: name, suburb, roof type and bill range. A photo of an electricity bill shows an address and an account number, so ask for the bill amount instead unless the photo is truly needed.',
      'The business is the responsible party. S10U, the AI provider and Meta are operators and need written agreements. Overseas AI is a cross-border transfer: tell leads.',
      'Follow-ups and offers are direct marketing: they need the lead’s opt-in, and a “stop” option on every message. This is not legal advice.',
    ],
    startTip: 'Start with ads that open WhatsApp. The chat is free for 72 hours, so you pay for the ad and not for the messages.',
    moreCosts: 'The ad itself (paid to Meta or Google) and any e-signature or payment fees are separate.',
  },
  'customer-support': {
    who: 'customer', whoPlural: 'customers', bizNoun: 'business', unit: 'support chat',
    convLabel: 'Support chats on WhatsApp per month',
    journeyText: 'A question, an instant answer, an order lookup, a return, a hand-over to an agent and a rating',
    templateExample: 'a delivery update',
    windowNote: 'The customer’s first message opens a 24-hour window, and this whole chat happens in one sitting inside it. So every reply is a normal reply and no template is needed. Messages typed by a human agent in the inbox (Priya in the demo) are charged the same as bot replies. A template is only needed if the business writes first after the window has closed, for example “your parcel has shipped”.',
    templates: [],
    agentMessages: [{ step: 'Hand-over to a person', n: 1 }],
    replyLabel: 'Bot and agent replies',
    roi: {
      fee: 50, feeLabel: 'Cost of one agent-handled call or email (rand) — example', nsLabel: 'Share of these customers who would otherwise phone or email an agent — example', nsDefault: 80,
      redLabel: 'Share the bot resolves without a person — S10U’s call-centre study reported 20% fewer help-desk calls', redDefault: 20,
      prevLabel: 'contacts the bot handles per month', valueLabel: 'agent cost saved per month', meetingLine: 'what one agent-handled contact costs the business',
      lead: 'Every question the bot answers is one less call or email for an agent. Try the business’s own numbers. The cost per contact and the share of customers are examples, not facts.',
      note: 'The 20% is S10U’s claim for one call-centre client, not a promise here. ⚠ Not counted: faster answers outside office hours, fewer lost sales, and the cost of agent seats.',
    },
    privacyTitle: 'Privacy and safety (POPIA)',
    privacy: [
      'Ask only for what is needed to find the order: the order number, not the card or ID number. Never ask for card details, PINs or passwords in a chat.',
      'The business is the responsible party. S10U, the AI provider and Meta are operators and need written agreements. Overseas AI is a cross-border transfer: tell customers.',
      'The agent sees the full chat history after a hand-over, so tell customers who is reading. Keep a “stop” option on proactive messages. This is not legal advice.',
    ],
    startTip: 'Let the bot answer the common questions. Each solved chat costs a few rand and saves an agent contact.',
    moreCosts: 'Agent seats and any extra S10U licence fees are separate.',
  },
};

export const COSTS = { ...BASE_COSTS, ...MORE };
