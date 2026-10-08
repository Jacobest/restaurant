// Per use case: which bot messages are business-started templates (outside the 24-hour window).
// Every other bot message is a service message (a free-form reply inside the window). Patient messages are always free.
// templates: [{ step: step title, n: which bot message in that step (0 = first), kind: 'utility' | 'feedback', label }]
// 'feedback' is a survey template. Meta may review it as utility or as marketing, so the card has a switch. ⚠
export const COSTS = {
  'doctors-appointment': {
    who: 'patient',
    unit: 'appointment',
    fee: 650, // example consultation fee in rand for the value calculator. Replace with the practice's real fee.
    templates: [
      { step: 'Reminders', n: 0, kind: 'utility', label: 'Appointment reminder, sent the day before (template)' },
      { step: 'After the visit', n: 0, kind: 'feedback', label: 'Feedback request, sent after the visit (template)' },
    ],
    healthcareNote: true,
  },
};
