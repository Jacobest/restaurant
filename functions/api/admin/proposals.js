// Owner only (the middleware enforces this): list and remove the proposal requests from "Yes, this is for me!".
import { json } from '../../_auth.js';

export async function onRequestGet({ env }) {
  if (!env.USERS) return json({ error: 'The USERS database is not connected yet.' }, 500);
  const items = [];
  for (const k of (await env.USERS.list({ prefix: 'proposal:' })).keys) {
    const p = JSON.parse((await env.USERS.get(k.name)) || 'null');
    if (p) items.push({ id: k.name.slice(9), ...p });
  }
  items.sort((a, b) => b.created - a.created);
  return json({ items });
}

export async function onRequestDelete({ request, env }) {
  if (!env.USERS) return json({ error: 'The USERS database is not connected yet.' }, 500);
  const id = new URL(request.url).searchParams.get('id');
  if (id) await env.USERS.delete('proposal:' + id);
  return json({ ok: true });
}
