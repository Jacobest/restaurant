// Gate every page behind a login, except the few public pages below.
import { getSession } from './_auth.js';

const PUBLIC = new Set([
  '/login', '/logout', '/invite', '/api/accept-invite', '/api/me', '/favicon.png',
  '/uc/restaurant-booking/chat', '/uc/restaurant-booking/chat.html',
  '/uc/doctors-appointment/chat', '/uc/doctors-appointment/chat.html',
]);

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : url.pathname;
  if (PUBLIC.has(path)) return next();

  const session = await getSession(request, env);

  if (path === '/') return session ? Response.redirect(url.origin + '/uc/', 302) : next();
  if (!session) {
    return path.startsWith('/api/') ? new Response('Unauthorized', { status: 401 }) : Response.redirect(url.origin + '/', 302);
  }
  if ((path === '/admin' || path.startsWith('/admin/') || path.startsWith('/api/admin/')) && session.role !== 'owner') {
    return Response.redirect(url.origin + '/uc/', 302);
  }
  return next();
}
