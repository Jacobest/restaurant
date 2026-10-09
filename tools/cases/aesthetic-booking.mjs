import { crm, handover } from '../requirements.mjs';

export default {
  meta: {
    slug: 'aesthetic-booking',
    name: 'Aesthetic Clinic: Book an Appointment',
    label: 'Clinic',
    emoji: '✨',
    biz: 'Glow Aesthetic Clinic',
    who: 'client',
    journeyTitle: 'Client Journey – Book an Appointment on WhatsApp',
    lead: 'The shortest way to a booking: the client picks the doctor or the cosmetologist, taps a free time and accepts. Four taps, no forms, and the diary is updated by itself.',
    grad: '#128C7E,#53BDEB',
    icon: '<path d="M60 16l8 24 24 8-24 8-8 24-8-24-24-8 24-8z"/><path d="M92 76l4 12 12 4-12 4-4 12-4-12-12-4 12-4z"/>',
    card: 'Clients choose the doctor or cosmetologist, tap a free time and accept. The shortest route to a booked appointment.',
    active: 'Naledi Khumalo',
    contacts: [
      ['Thabo Mokoena', '12 min ago', 'Thanks, see you Thursday!'],
      ['Emma Clarke', '1 hour ago', 'Can I see the doctor on Monday?'],
      ['Pieter Botha', 'Yesterday', 'Booked, thank you 💚'],
      ['Aisha Patel', 'Sep 29, 2026', 'Thanks for the reminder 👍'],
    ],
    summary: [
      'Client asked for a doctor’s appointment. Number matched to the client file.',
      'Chose the cosmetologist. Three free times found in the diary.',
      'Picked Fri 20/11/2026 at 11:00. Slot held for 10 minutes.',
      'Client accepted. Appointment booked, ref AC-2026-0214.',
      'Reminder sent the day before. Client confirmed.',
      'Arrival note sent on the day. Client is on the way.',
    ],
  },

  chat: `  const steps = [
    ['Open the chat', [chip('Today'), O('Doctor’s appointment'), I('Hi Naledi 👋 Welcome to <b>Glow Aesthetic Clinic</b> ✨<br>Who would you like to see?'), btns(['Doctor', 'Cosmetologist'])]],
    ['Choose who to see', [O('Cosmetologist'), I('Thandi Mokoena has these times free:'), btns(['Fri 20/11 · 11:00', 'Mon 23/11 · 09:30', 'Tue 24/11 · 14:00'])]],
    ['Pick a time', [O('Fri 20/11 · 11:00'), I('<b>Your appointment</b>' + [['With', 'Thandi Mokoena'], ['Visit', 'Cosmetologist consultation'], ['When', 'Fri 20/11/2026, 11:00'], ['Where', 'Glow Aesthetic Clinic, 12 Kloof Street, Gardens', true]].map(([a, b, bold]) => row(a, b, bold)).join('')), btns(['Accept Appointment', 'Change'])]],
    ['Accept the appointment', [O('Accept Appointment'), I('✅ <b>You’re booked!</b><br>Ref: AC-2026-0214<br>I’ll remind you the day before.'), btns(['Add to calendar', 'Manage booking'])]],
    ['Reminder', [chip('Thu 19/11/2026'), I('⏰ Reminder: your appointment with <b>Thandi</b> is tomorrow at 11:00.', '16:00'), btns(['See you there', 'Reschedule']), O('See you there', '16:05')]],
    ['Day of the visit', [chip('Fri 20/11/2026'), I('Good morning Naledi 🌿 See you at 11:00. Please arrive 10 minutes early. Parking: Kloof Street garage, next door.', '09:00'), O('On my way 👍', '10:20')]],
  ];`,

  journey: {
    lanes: ['Client (WhatsApp)', 'WhatsApp bot', 'Clinic systems', 'Clinic team'],
    stages: [['Ask and choose', 0, 4], ['Pick and accept', 5, 8], ['Booked', 9, 11], ['Remind', 12, 13]],
    nodes: [
      ['c1', 0, 0, 'start', 'Client asks for a\ndoctor’s appointment'],
      ['b1', 1, 1, 'step', 'Welcome by name:\nDoctor or\nCosmetologist?'],
      ['c2', 2, 0, 'step', 'Taps who she\nwants to see'],
      ['s1', 3, 2, 'system', 'Read the diary:\nnext 3 free times'],
      ['b2', 4, 1, 'step', 'Shows 3 free\ntimes as buttons'],
      ['c3', 5, 0, 'step', 'Taps a time'],
      ['d1', 6, 2, 'decision', 'Slot still free?'],
      ['b3', 7, 1, 'step', 'Shows the summary\nwith Accept button'],
      ['c4', 8, 0, 'step', 'Taps Accept\nAppointment'],
      ['s2', 9, 2, 'system', 'Book the diary and\nupdate client file'],
      ['b4', 10, 1, 'step', 'Confirms with a\nreference number'],
      ['t1', 11, 3, 'human', 'Reception sees the\nbooking in the diary'],
      ['b5', 12, 1, 'step', 'Day-before\nreminder'],
      ['c5', 13, 0, 'end', 'Replies: see\nyou there'],
    ],
    edges: [['c1', 'b1'], ['b1', 'c2'], ['c2', 's1'], ['s1', 'b2'], ['b2', 'c3'], ['c3', 'd1'], ['d1', 'b3', 'Yes'], ['d1', 'b2', 'No: show other times', 'back'], ['b3', 'c4'], ['c4', 's2'], ['s2', 'b4'], ['b4', 't1'], ['t1', 'b5'], ['b5', 'c5']],
  },

  requirements: {
    intro: 'This use case needs a diary that shows free times for the doctor and the cosmetologist, and a client file the bot can match by cell number. Many aesthetic clinics already use a practice or clinic system. Check whether it has an API before you choose.',
    functions: [
      {
        fn: 'Diary with free times (doctor and cosmetologist)', why: 'Shows the next free times for each person and holds the slot when the client taps.',
        easy: ['Google Calendar, one calendar per person', 'Free. Works with Zapier, Make and n8n. The bot reads free times and writes the booking.'],
        ideal: [['The booking diary inside the clinic system', 'Best, because bookings, client files and treatments stay in one place. Needs an API from the vendor. ⚠'], ['Microsoft 365 Bookings', 'Good if the clinic already uses Microsoft 365.']],
      },
      {
        fn: 'Client file (matched by cell number)', why: 'Lets the bot greet the client by name and keep the booking on their file.',
        easy: ['A Google Sheet of clients', 'The bot looks the client up by cell number. Staff keep it up to date.'],
        ideal: [['Clinic management system', 'Examples to check for API access: Cliniko, Healthbridge, GoodX. None of these is verified for this use. ⚠']],
        note: 'Health and treatment records are special personal information. Keep only what the booking needs. ',
      },
      {
        fn: 'Reminders', why: 'Sends the day-before reminder and lets the client reschedule from it.',
        easy: ['Scheduled WhatsApp template from the diary or a sheet', 'Needs an approved template and the client’s opt-in.'],
        ideal: [['Reminder rules in the clinic system', 'Check that they can send on WhatsApp, not only SMS or email. ⚠']],
        note: 'A reminder sent after 24 hours from the client’s last message must be a Meta-approved template.',
      },
      crm('Remembers each client, their visits and their preferences.'),
      {
        fn: 'Calendar link', why: 'Adds the appointment to the client’s own phone calendar.',
        easy: ['A calendar file (.ics) link sent by the bot', 'Free and simple. Works on Apple, Google and Outlook calendars.'],
        ideal: [['The booking page of the clinic system', 'Gives the same link and can also add the client to a waiting list. ⚠']],
      },
      handover,
    ],
  },
};
