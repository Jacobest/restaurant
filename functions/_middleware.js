// Gate every page except the login page behind a password cookie.
export async function token(password) {
  const data = new TextEncoder().encode('whatsapp-demo:' + password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (url.pathname === '/login' || url.pathname === '/logout') return next();

  const expected = env.DEMO_PASSWORD ? await token(env.DEMO_PASSWORD) : null;
  const cookie = request.headers.get('Cookie') || '';
  const ok = expected && cookie.split(/;\s*/).includes('demo_auth=' + expected);

  if (url.pathname === '/') return ok ? Response.redirect(url.origin + '/uc/', 302) : next();
  if (ok) return next();
  return Response.redirect(url.origin + '/', 302);
}
