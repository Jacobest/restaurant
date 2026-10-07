# How to write a use case module

One file per use case: `tools/cases/<slug>.mjs`. The build scripts turn it into the 5 standard demos.
Check it with `node tools/validate-case.mjs <slug>` (fix every problem it lists). Do not run the other build scripts and do not edit any other file.

```js
import { reviews, crm, payments, accounting, handover } from '../requirements.mjs';   // optional shared rows

export default {
  meta: {
    slug: 'gym-classes',                 // must equal the file name
    name: 'Gym Classes',                 // title on the cards and pages
    label: 'Gym',                        // header label: "Gym Demo" (one short word)
    emoji: '🏋️',                         // phone avatar
    biz: 'Iron Peak Fitness',            // made-up CLIENT NAME, South African flavour. Shown on phone and dashboard
    who: 'member',                       // one word: guest, patient, client, customer, lead, member, parent ...
    journeyTitle: 'Member Journey – WhatsApp Class Booking',
    lead: 'Two sentences: what this use case does for the business.',
    grad: '#128C7E,#25D366',             // two colours, pick from: #075E54 #128C7E #25D366 #34B7F1 #53BDEB
    icon: '<path d="M20 60h80M30 40v40M90 40v40"/>',   // plain SVG shapes for a 120x120 box, drawn with a white 5px stroke, no fill
    card: 'One short sentence for the card on the use cases page (max 130 characters).',
    active: 'Naledi Khumalo',            // the contact who is chatting live in the dashboard
    contacts: [['Thabo Mokoena', '12 min ago', 'Short last message'], ['Emma Clarke', '1 hour ago', '...'], ['Pieter Botha', 'Yesterday', '...'], ['Aisha Patel', 'Sep 29, 2026', '...']],   // exactly 4
    summary: ['One line per chat step, in order, saying what the AI Summary should show after that step.'],  // length must equal the number of steps
  },

  chat: `  const steps = [
    ['Step title', [chip('Today'), O('Guest message'), I('Bot reply'), btns(['Button 1', 'Button 2'])]],
    ...
  ];`,

  journey: { lanes: [...4 names], stages: [[label, firstCol, lastCol], ...], nodes: [[id, col, lane, type, label], ...], edges: [[from, to, label?, 'back'?], ...] },

  requirements: { intro: 'One or two sentences.', functions: [ { fn, why, easy: [tool, note], ideal: [[tool, note], ...], note? }, ... ] },
};
```

## Rules for the conversation (`chat`)
- 7 to 10 steps. Each step is `['Title', [messages]]`. Use only these helpers: `I('bot text', 'HH:MM'?)` (bot message), `O('guest text', 'HH:MM'?)` (guest message), `btns([...])` (reply buttons under a bot message), `chip('text')` (small grey system note), `row('Label', 'Value', bold?)` (table row inside a bot message, see the booking summaries in `uc/salon-booking/chat.html`).
- Messages are HTML strings: you may use `<b>`, `<br>`. Use typographic ’ in text, never a straight apostrophe inside the single-quoted strings (it breaks the code), or escape it.
- Show the CLIENT NAME (`meta.biz`) in the welcome message and in at least one other place.
- South African flavour: rand amounts like `R1 240.00`, dates like `14/11/2026`, 24-hour times, local place names. All data is made up but must look real: NO `[Placeholders]`. Use a real-looking reference such as `GW-2026-0318` (initials of the client name, year, number).
- Start with the guest writing first, follow a believable happy path, include one or two buttons moments, a confirmation, a reminder or follow-up, and a closing rating or next step.
- No medical advice, no legal advice, no made-up prices that look like official rates.
- Keep it friendly and short. One idea per message.

## Rules for the journey diagram
- Exactly 4 lanes, top to bottom: the customer on WhatsApp, the WhatsApp bot, systems, and the team (human). Name them for this use case.
- 12 to 20 nodes. Columns left to right in time order (col 0, 1, 2 ...). Two nodes cannot share the same column AND lane.
- Types: `start` (first node), `step` (chat step), `system` (software, calendar, CRM, payment), `decision` (a yes/no check, give it two outgoing edges with labels), `human` (team member), `offline` (real-world event), `end` (last node).
- Labels: max 3 lines, each line 22 characters or fewer, lines separated with `\n`.
- Edges go forward in time. A loop back (for example "No: try again") is a `'back'` edge and may only join neighbouring lanes. Do not draw a long edge that would run straight through other nodes: the validator warns about the common cases.
- Every node must have at least one edge.

## Rules for the requirements ("What you need")
- 7 to 10 functions: the connections this use case needs. For each: `easy` (cheap or free, fast, little or no code) and one to three `ideal` options (best fit for a growing business).
- This is for South African businesses. Prefer tools that are popular in South Africa and work in rand. Use WebSearch/WebFetch to check what is actually popular and whether an API exists. If you cannot verify a claim (API access, price, availability), add ` ⚠` at the end of the note. Never invent API features or prices. Write notes in short plain English, one or two sentences.
- You may reuse shared rows: `reviews`, `crm('why text')`, `payments('why text')`, `accounting`, `handover`. Add `note` on a function for warnings.
- Do not mention S10U features that are not on its site. Stated S10U features: Workflow Builder (no code), AI chatbots trained on FAQs (11 languages) with hand-over, shared inbox, broadcasts with opt-out, in-chat payments (cards, EFT, vouchers), data on SA servers. Anything else: say the link can be made through an API or an automation tool (Make, n8n, Zapier) and should be confirmed with S10U.
- Keep health, financial and children's data sensitive: add a `note` about POPIA where it applies (see `COMMON.popia` in `tools/requirements.mjs`).
