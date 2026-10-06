// Shared helpers: signed session cookie, password hashing, owner/member lookup.
const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');

async function hmac(key, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}

export function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function hashPassword(password, saltHex) {
  const salt = saltHex ? Uint8Array.from(saltHex.match(/../g).map(h => parseInt(h, 16))) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return { salt: hex(salt), hash: hex(bits) };
}

export const cleanEmail = e => String(e || '').trim().toLowerCase();
export const isOwner = (env, email) => !!env.OWNER_EMAIL && cleanEmail(env.OWNER_EMAIL) === email;

export async function sessionCookie(env, email) {
  const exp = Date.now() + 30 * 24 * 3600 * 1000;
  const payload = btoa(`${email}|${exp}`);
  const sig = await hmac(env.DEMO_PASSWORD, payload);
  return `session=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`;
}

export const clearCookie = 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';

// Returns { email, role: 'owner' | 'member' } or null.
export async function getSession(request, env) {
  if (!env.DEMO_PASSWORD) return null;
  const m = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) return null;
  const [payload, sig] = m[1].split('.');
  if (!payload || !sig || !same(sig, await hmac(env.DEMO_PASSWORD, payload))) return null;
  let email, exp;
  try { [email, exp] = atob(payload).split('|'); } catch { return null; }
  if (!(Number(exp) > Date.now())) return null;
  if (isOwner(env, email)) return { email, role: 'owner' };
  if (env.USERS && await env.USERS.get('user:' + email)) return { email, role: 'member' };
  return null;
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
