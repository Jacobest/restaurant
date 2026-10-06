import { clearCookie } from './_auth.js';

export async function onRequest({ request }) {
  return new Response(null, {
    status: 303,
    headers: { Location: new URL(request.url).origin + '/', 'Set-Cookie': clearCookie },
  });
}
