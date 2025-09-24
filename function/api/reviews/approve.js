export async function onRequestPost({ env, request }) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || token !== env.ADMIN_PASSWORD) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response('id required', { status: 400 });

  const res = await env.DB.prepare(
    `UPDATE reviews SET status='approved' WHERE id=?1`
  ).bind(id).run();

  if (!res.success || (res.meta?.changes ?? res.changes) === 0) {
    return new Response('not found', { status: 404 });
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
