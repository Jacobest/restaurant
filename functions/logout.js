export async function onRequest({ request }) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(request.url).origin + '/',
      'Set-Cookie': 'demo_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}
