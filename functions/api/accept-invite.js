// Public: a team member opens their invite link and chooses a password.
import { hashPassword, json, sessionCookie } from '../_auth.js';

const lookup = async (env, token) =>
  env.USERS && /^[0-9a-f]{48}$/.test(token || '') ? JSON.parse((await env.USERS.get('invite:' + token)) || 'null') : null;

export async function onRequestGet({ request, env }) {
  const invite = await lookup(env, new URL(request.url).searchParams.get('t'));
  return invite ? json({ email: invite.email }) : json({ error: 'This invite link is not valid any more.' }, 404);
}

export async function onRequestPost({ request, env }) {
  const { token, password } = await request.json().catch(() => ({}));
  const invite = await lookup(env, token);
  if (!invite) return json({ error: 'This invite link is not valid any more.' }, 404);
  if (String(password || '').length < 8) return json({ error: 'Use at least 8 characters.' }, 400);

  const { salt, hash } = await hashPassword(String(password));
  await env.USERS.put('user:' + invite.email, JSON.stringify({ salt, hash, created: Date.now() }));
  await env.USERS.delete('invite:' + token);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': await sessionCookie(env, invite.email) },
  });
}
