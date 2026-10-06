import { token } from './_middleware.js';

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const given = String(form.get('password') || '');
  const origin = new URL(request.url).origin;
  if (!env.DEMO_PASSWORD || given !== env.DEMO_PASSWORD) {
    return Response.redirect(origin + '/?error=1', 303);
  }
  return new Response(null, {
    status: 303,
    headers: {
      Location: origin + '/uc/',
      'Set-Cookie': `demo_auth=${await token(env.DEMO_PASSWORD)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
    },
  });
}
