// First-party funnel events in Vercel logs. Never log form answers or contact data.
const EVENTS = new Set(['automation_started', 'automation_step_1_completed', 'automation_step_2_completed',
  'automation_step_3_completed', 'automation_step_4_completed', 'automation_calculation_completed', 'automation_lead_submitted']);
const limits = new Map();
export default {
  async fetch(request) {
    const reply = (status) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
    if (request.method !== 'POST') return reply(405);
    if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return reply(403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415);
    const now = Date.now();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    for (const [key, value] of limits) if (now > value.until) limits.delete(key);
    const limit = limits.get(ip) || { count: 0, until: now + 600000 };
    limits.set(ip, limit);
    if (++limit.count > 60 || limits.size > 10000) return reply(429);
    try {
      if (Number(request.headers.get('content-length')) > 1500) return reply(413);
      const raw = await request.text();
      if (new TextEncoder().encode(raw).byteLength > 1500) return reply(413);
      const data = JSON.parse(raw);
      if (!data || !EVENTS.has(data.event) || !/^[a-f0-9-]{36}$/.test(data.journey || '')) return reply(422);
      // Campaigns are classified, not copied verbatim from untrusted query strings.
      console.info(JSON.stringify({ type: 'automation_funnel', event: data.event, journey: data.journey,
        source: data.leanked === true ? 'Leanked Newsletter #01' : 'website_automation', at: new Date().toISOString() }));
      return reply(204);
    } catch { return reply(400); }
  }
};
