import { getSession, json } from '../_auth.js';

export async function onRequestGet({ request, env }) {
  const s = await getSession(request, env);
  return json(s ? { email: s.email, role: s.role } : { role: null });
}
