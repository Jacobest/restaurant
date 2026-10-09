import { crm, handover } from '../requirements.mjs';

export default {
  meta: {
    slug: 'aesthetic-reschedule',
    name: 'Aesthetic Clinic: Reschedule',
    label: 'Clinic',
    emoji: '✨',
    biz: 'Glow Aesthetic Clinic',
    who: 'client',
    journeyTitle: 'Client Journey – Reschedule an Appointment on WhatsApp',
    lead: 'The client says she wants to move her appointment. The bot finds it, offers three new times and moves it in three taps. The old slot goes back into the diary for someone else.',
    grad: '#128C7E,#53BDEB',
    icon: '<path d="M26 60a34 34 0 0 1 60-22"/><path d="M86 20v20H66"/><path d="M94 60a34 34 0 0 1-60 22"/><path d="M34 100V80h20"/>',
    card: 'Clients move an appointment in three taps. The bot finds it, offers new times and frees the old slot.',
    active: 'Naledi Khumalo',
    contacts: [
      ['Thabo Mokoena', '12 min ago', 'Can I move to the afternoon?'],
      ['Emma Clarke', '1 hour ago', 'Thanks, Monday works 👍'],
      ['Pieter Botha', 'Yesterday', 'See you next week'],
      ['Aisha Patel', 'Sep 29, 2026', 'Thank you, love my skin 💚'],
    ],
    summary: [
      'Client wants to reschedule. Next appointment found: Fri 20/11/2026 at 11:00 with Thandi.',
      'Picked Mon 23/11/2026 at 09:30. Slot held for 10 minutes.',
      'Client accepted. Appointment moved. Old slot released.',
      'Reminder sent the day before. Client confirmed.',
      'Arrival note sent on the day. Client is on the way.',
      'Rated the visit 5 out of 5.',
    ],
  },

  chat: `  const steps = [
    ['Open the chat', [chip('Today'), O('Reschedule appointment'), I('Hi Naledi 👋 Welcome to <b>Glow Aesthetic Clinic</b> ✨<br>Your next appointment is <b>Fri 20/11 at 11:00</b> with Thandi.<br>Pick a new time:'), btns(['Mon 23/11 · 09:30', 'Tue 24/11 · 14:00', 'Wed 25/11 · 10:30', 'Keep my time'])]],
    ['Pick a new time', [O('Mon 23/11 · 09:30'), I('<b>Move your appointment?</b>' + [['Was', 'Fri 20/11, 11:00'], ['Now', 'Mon 23/11, 09:30', true], ['With', 'Thandi Mokoena']].map(([a, b, bold]) => row(a, b, bold)).join('')), btns(['Accept Appointment', 'Keep my old time'])]],
    ['Accept the change', [O('Accept Appointment'), I('✅ <b>Moved!</b> Ref: AC-2026-0214<br>You’re now booked for <b>Mon 23/11 at 09:30</b>.<br>Changes are free up to 24 hours before.'), btns(['Add to calendar'])]],
    ['Reminder', [chip('Sun 22/11/2026'), I('⏰ Reminder: your appointment with <b>Thandi</b> is tomorrow at 09:30.', '16:00'), btns(['See you there', 'Reschedule']), O('See you there', '16:05')]],
    ['Day of the visit', [chip('Mon 23/11/2026'), I('Good morning Naledi 🌿 See you at 09:30. Please arrive 10 minutes early. Parking: Kloof Street garage, next door.', '08:30'), O('On my way 👍', '09:05')]],
    ['After the visit', [chip('Mon 23/11/2026'), I('Thank you for visiting <b>Glow Aesthetic Clinic</b> 💚 How was your visit? (1–5)', '11:30'), O('5 – Loved it', '11:40'), I('Thank you Naledi! Your next visit is whenever you are ready.', '11:40')]],
  ];`,

  journey: {
    lanes: ['Client (WhatsApp)', 'WhatsApp bot', 'Clinic systems', 'Clinic team'],
    stages: [['Ask and find', 0, 2], ['Pick and accept', 3, 6], ['Moved', 7, 9], ['Remind and rate', 10, 13]],
    nodes: [
      ['c1', 0, 0, 'start', 'Client asks to\nreschedule'],
      ['s1', 1, 2, 'system', 'Find her next\nappointment by\ncell number'],
      ['b1', 2, 1, 'step', 'Shows it and 3\nnew free times'],
      ['c2', 3, 0, 'step', 'Taps a new time'],
      ['d1', 4, 2, 'decision', 'Slot still free?'],
      ['b2', 5, 1, 'step', 'Shows was and now\nwith Accept button'],
      ['c3', 6, 0, 'step', 'Taps Accept\nAppointment'],
      ['s2', 7, 2, 'system', 'Move the booking\nand free the old slot'],
      ['b3', 8, 1, 'step', 'Confirms the\nnew time'],
      ['t1', 9, 3, 'human', 'Reception sees the\nchange in the diary'],
      ['b4', 10, 1, 'step', 'Day-before\nreminder'],
      ['c4', 11, 0, 'step', 'Replies: see\nyou there'],
      ['b5', 12, 1, 'step', 'Asks for a rating\nafter the visit'],
      ['c5', 13, 0, 'end', 'Rates the visit'],
    ],
    edges: [['c1', 's1'], ['s1', 'b1'], ['b1', 'c2'], ['c2', 'd1'], ['d1', 'b2', 'Yes'], ['d1', 'b1', 'No: show other times', 'back'], ['b2', 'c3'], ['c3', 's2'], ['s2', 'b3'], ['b3', 't1'], ['t1', 'b4'], ['b4', 'c4'], ['c4', 'b5'], ['b5', 'c5']],
  },

  requirements: {
    intro: 'This use case needs a diary the bot can read and change, and a client file matched by cell number. The bot must be able to move a booking, not only create one, and free the old slot. Check that with each vendor.',
    functions: [
      {
        fn: 'Diary that can move a booking', why: 'Finds the client’s next appointment, shows free times and moves the booking so the old slot is free again.',
        easy: ['Google Calendar, one calendar per person', 'Free. Works with Zapier, Make and n8n. The automation edits or recreates the event and deletes the old one.'],
        ideal: [['The booking diary inside the clinic system', 'Best, because the move is one change and the client file stays correct. Needs an API from the vendor. ⚠']],
      },
      {
        fn: 'Client file (matched by cell number)', why: 'Lets the bot find the right client and her next appointment without asking for details.',
        easy: ['A Google Sheet of clients and bookings', 'The bot looks the client up by cell number. Staff keep it up to date.'],
        ideal: [['Clinic management system', 'Examples to check for API access: Cliniko, Healthbridge, GoodX. None of these is verified for this use. ⚠']],
        note: 'Health and treatment records are special personal information. Keep only what the booking needs.',
      },
      {
        fn: 'Change rules (free up to 24 hours before)', why: 'Decides if a change is free, or needs the receptionist, for example inside 24 hours.',
        easy: ['A rule in the S10U workflow', 'Stated on S10U’s site: Workflow Builder with buttons and routing, no code. The rule compares the appointment time with now.'],
        ideal: [['The cancellation rules of the clinic system', 'Keeps one rule for the phone, the web and WhatsApp. ⚠']],
        note: 'Late changes can go to the receptionist with the hand-over rule, instead of being blocked.',
      },
      {
        fn: 'Reminders', why: 'Sends the day-before reminder for the new time and lets the client move it again.',
        easy: ['Scheduled WhatsApp template from the diary or a sheet', 'Needs an approved template and the client’s opt-in. Reset the reminder when the time changes.'],
        ideal: [['Reminder rules in the clinic system', 'Check that they can send on WhatsApp, not only SMS or email, and that they follow a moved booking. ⚠']],
        note: 'A reminder sent after 24 hours from the client’s last message must be a Meta-approved template.',
      },
      crm('Remembers each client, their visits and how often they move appointments.'),
      handover,
    ],
  },
};
