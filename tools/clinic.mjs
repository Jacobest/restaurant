// The Aesthetic Clinic group: 3 journeys that share one landing page, one proposal form and the bottom bar
// ("Is this for me?" button + private cost). Used by build-costs.mjs and build-clinic.mjs.
export const CLINIC = {
  slug: 'aesthetic-clinic',
  biz: 'Glow Aesthetic Clinic',
  journeys: [
    { slug: 'aesthetic-booking', key: 'booking', title: 'Book an appointment', blurb: 'The shortest route: pick the doctor or the cosmetologist, tap a free time and accept. Four taps.', unit: 'booking' },
    { slug: 'aesthetic-reschedule', key: 'reschedule', title: 'Reschedule an appointment', blurb: 'Short and to the point: the bot finds the appointment, offers three new times and moves it in three taps.', unit: 'reschedule' },
    { slug: 'aesthetic-support', key: 'support', title: 'Support', blurb: 'A chatbot and an AI agent in one chat: appointments, care-protocol PDFs, FAQ answers, doctor-approved answers and an urgent hand-over to reception.', unit: 'support chat' },
  ],
};
