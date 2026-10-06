import { cleanEmail, hashPassword, isOwner, same, sessionCookie } from './_auth.js';

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const email = cleanEmail(form.get('email'));
  const password = String(form.get('password') || '');
  const origin = new URL(request.url).origin;
  const fail = Response.redirect(origin + '/?error=1', 303);
  if (!env.DEMO_PASSWORD || !email) return fail;

  let ok = false;
  if (isOwner(env, email)) {
    ok = same(password, env.DEMO_PASSWORD);
  } else if (env.USERS) {
    const user = JSON.parse((await env.USERS.get('user:' + email)) || 'null');
    if (user) ok = same((await hashPassword(password, user.salt)).hash, user.hash);
  }
  if (!ok) return fail;

  return new Response(null, {
    status: 303,
    headers: { Location: origin + '/uc/', 'Set-Cookie': await sessionCookie(env, email) },
  });
}
