// Gate every page behind a login, except the few public pages below.
import { getSession } from './_auth.js';

const PUBLIC = new Set([
  '/login', '/logout', '/invite', '/api/accept-invite', '/api/me', '/favicon.png',
]);
// Every use case's live chat demo is public so it can be shared with customers.
const CHAT_RE = /^\/uc\/[a-z0-9-]+\/chat(\.html)?$/;

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : url.pathname;
  if (PUBLIC.has(path) || CHAT_RE.test(path)) return next();

  const session = await getSession(request, env);

  if (path === '/') return session ? Response.redirect(url.origin + '/uc/', 302) : next();
  if (!session) {
    return path.startsWith('/api/') ? new Response('Unauthorized', { status: 401 }) : Response.redirect(url.origin + '/?next=' + encodeURIComponent(path + url.search), 302);
  }
  if ((path === '/admin' || path.startsWith('/admin/') || path.startsWith('/api/admin/')) && session.role !== 'owner') {
    return Response.redirect(url.origin + '/uc/', 302);
  }
  return next();
}
