export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status'); // e.g., approved
  let q = `SELECT id,name,censor,role,company,projectId,quote,before,after,
                  metricLabel,metricValue,metricUnit,verified,status,createdAt
           FROM reviews`;
  const params = [];
  if (status) { q += ` WHERE status=?1`; params.push(status); }
  q += ` ORDER BY createdAt DESC LIMIT 100`;

  const { results } = await env.DB.prepare(q).bind(...params).all();
  const rows = results.map(r => ({
    id: r.id,
    name: r.name,
    censor: !!r.censor,
    role: r.role,
    company: r.company,
    projectId: r.projectId,
    quote: r.quote,
    before: r.before,
    after: r.after,
    metric: r.metricLabel ? { label: r.metricLabel, value: r.metricValue, unit: r.metricUnit } : null,
    verified: r.verified,
    status: r.status,
    createdAt: r.createdAt
  }));
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json();
    if (!body.quote && !body.after) {
      return new Response('quote or after is required', { status: 400 });
    }
    const id = crypto.randomUUID();
    const now = Date.now();
    const stmt = env.DB.prepare(
      `INSERT INTO reviews
       (id,name,censor,role,company,projectId,quote,before,after,
        metricLabel,metricValue,metricUnit,verified,status,createdAt)
       VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)`
    ).bind(
      id,
      (body.name||'').trim(),
      body.censor ? 1 : 0,
      (body.role||'').trim(),
      (body.company||'').trim(),
      (body.projectId||'').trim(),
      (body.quote||'').trim(),
      (body.before||'').trim(),
      (body.after||'').trim(),
      body.metric?.label || null,
      body.metric?.value || null,
      body.metric?.unit || null,
      'none',
      'pending',
      now
    );
    await stmt.run();
    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
}
