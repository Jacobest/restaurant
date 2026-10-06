// Owner only (the middleware enforces this): list the team, create invites, remove people.
import { cleanEmail, isOwner, json } from '../../_auth.js';

const noStore = env => !env.USERS && json({ error: 'The USERS database is not connected yet.' }, 500);

export async function onRequestGet({ env }) {
  if (noStore(env)) return noStore(env);
  const users = [], invites = [];
  for (const k of (await env.USERS.list({ prefix: 'user:' })).keys) {
    const u = JSON.parse((await env.USERS.get(k.name)) || 'null');
    if (u) users.push({ email: k.name.slice(5), created: u.created });
  }
  for (const k of (await env.USERS.list({ prefix: 'invite:' })).keys) {
    const i = JSON.parse((await env.USERS.get(k.name)) || 'null');
    if (i) invites.push({ token: k.name.slice(7), email: i.email, created: i.created });
  }
  return json({ users, invites });
}

export async function onRequestPost({ request, env }) {
  if (noStore(env)) return noStore(env);
  const { email: raw } = await request.json().catch(() => ({}));
  const email = cleanEmail(raw);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'Enter a valid email address.' }, 400);
  if (isOwner(env, email)) return json({ error: 'That is the owner account.' }, 400);
  if (await env.USERS.get('user:' + email)) return json({ error: 'That person is already on the team.' }, 400);

  const token = [...crypto.getRandomValues(new Uint8Array(24))].map(b => b.toString(16).padStart(2, '0')).join('');
  await env.USERS.put('invite:' + token, JSON.stringify({ email, created: Date.now() }), { expirationTtl: 7 * 24 * 3600 });
  return json({ link: new URL(request.url).origin + '/invite/?t=' + token, email });
}

export async function onRequestDelete({ request, env }) {
  if (noStore(env)) return noStore(env);
  const p = new URL(request.url).searchParams;
  if (p.get('email')) await env.USERS.delete('user:' + cleanEmail(p.get('email')));
  if (p.get('invite')) await env.USERS.delete('invite:' + p.get('invite'));
  return json({ ok: true });
}
