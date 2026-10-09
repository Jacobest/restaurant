// Public: a clinic asks for a proposal ("Yes, this is for me!"). Saved in KV under "proposal:". The owner reads them in /admin.
import { json } from '../_auth.js';

const clean = (s, n) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const JOURNEYS = ['booking', 'reschedule', 'support'];

export async function onRequestPost({ request, env }) {
  if (!env.USERS) return json({ error: 'The request form is not connected yet. Please contact us directly.' }, 500);
  let b;
  try { b = await request.json(); } catch { return json({ error: 'Something went wrong. Please try again.' }, 400); }
  if (b && b.website) return json({ ok: true }); // hidden field: only bots fill it in

  const clinic = clean(b.clinic, 120), name = clean(b.name, 120), cell = clean(b.cell, 30), email = clean(b.email, 120).toLowerCase(), note = clean(b.note, 1000);
  const journeys = (Array.isArray(b.journeys) ? b.journeys : []).filter(j => JOURNEYS.includes(j));
  if (!clinic || !name) return json({ error: 'Please add the clinic name and your name.' }, 400);
  if (cell.replace(/\D/g, '').length < 9) return json({ error: 'Please add a cell number we can reach you on.' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'Please add a valid email address.' }, 400);

  // At most 5 requests per visitor per hour.
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rl = 'rl:proposal:' + ip + ':' + Math.floor(Date.now() / 3600000);
  const used = parseInt((await env.USERS.get(rl)) || '0', 10);
  if (used >= 5) return json({ error: 'Too many requests. Please try again later.' }, 429);
  await env.USERS.put(rl, String(used + 1), { expirationTtl: 3700 });

  const id = Date.now() + '-' + [...crypto.getRandomValues(new Uint8Array(4))].map(x => x.toString(16).padStart(2, '0')).join('');
  await env.USERS.put('proposal:' + id, JSON.stringify({ clinic, name, cell, email, note, journeys, created: Date.now() }));
  return json({ ok: true });
}
