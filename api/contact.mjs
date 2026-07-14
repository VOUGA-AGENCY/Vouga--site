import { createHash, randomUUID } from 'node:crypto';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

const MAX_BODY_BYTES = 16_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers
    }
  });
}

function cleanSingleLine(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function cleanMessage(value) {
  return String(value || '').replace(/\r\n?/g, '\n').trim();
}

function invalid(field, code) {
  return json({ ok: false, field, code }, 422);
}

function getClientIp(request) {
  return String(request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
}

function hashIp(ip, secret) {
  if (!ip) return null;
  return createHash('sha256').update(`${secret}:${ip}`).digest('hex');
}

function validatePhone(raw) {
  if (!raw) return { e164: null, country: null };
  const phone = parsePhoneNumberFromString(raw, { extract: false });
  if (!phone || !phone.country || !phone.isValid()) return null;
  return { e164: phone.number, country: phone.country };
}

async function submitToSupabase(record, env) {
  const headers = {
    apikey: env.secret,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
    'X-Client-Info': 'vouga-contact-form/1.0'
  };
  if (!env.secret.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${env.secret}`;
  }

  const response = await fetch(`${env.url.replace(/\/$/, '')}/rest/v1/contact_requests`, {
    method: 'POST',
    headers,
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('Contact submission failed', response.status, detail.slice(0, 500));
    throw new Error('database_insert_failed');
  }
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return json({ ok: false, code: 'method_not_allowed' }, 405, { Allow: 'POST' });
    }

    const requestOrigin = new URL(request.url).origin;
    const origin = request.headers.get('origin');
    if (origin && origin !== requestOrigin) {
      return json({ ok: false, code: 'origin_not_allowed' }, 403);
    }

    if (!String(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
      return json({ ok: false, code: 'invalid_content_type' }, 415);
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return json({ ok: false, code: 'payload_too_large' }, 413);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, code: 'invalid_json' }, 400);
    }

    if (cleanSingleLine(body.website)) {
      return json({ ok: true }, 202);
    }

    const name = cleanSingleLine(body.name);
    const email = cleanSingleLine(body.email).toLowerCase();
    const phoneRaw = cleanSingleLine(body.phone);
    const company = cleanSingleLine(body.company);
    const message = cleanMessage(body.message);
    const language = body.language === 'en' ? 'en' : 'pt';

    if (name.length < 2 || name.length > 100) return invalid('name', 'invalid_name');
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) return invalid('email', 'invalid_email');
    if (company.length < 2 || company.length > 120) return invalid('company', 'invalid_company');
    if (message.length < 10 || message.length > 5000) return invalid('message', 'invalid_message');
    if (body.consent !== true) return invalid('consent', 'consent_required');

    const phone = validatePhone(phoneRaw);
    if (!phone) return invalid('phone', 'invalid_phone');

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseSecret) {
      console.error('Missing SUPABASE_URL or server-side Supabase secret');
      return json({ ok: false, code: 'service_unavailable' }, 503);
    }

    const requestId = randomUUID();
    const record = {
      request_id: requestId,
      name,
      email,
      phone_e164: phone.e164,
      phone_country: phone.country,
      company,
      message,
      source: 'website_contact',
      language,
      consent: true,
      consented_at: new Date().toISOString(),
      ip_hash: hashIp(getClientIp(request), supabaseSecret),
      user_agent: cleanSingleLine(request.headers.get('user-agent')).slice(0, 500) || null
    };

    try {
      await submitToSupabase(record, { url: supabaseUrl, secret: supabaseSecret });
      return json({ ok: true, requestId }, 201);
    } catch {
      return json({ ok: false, code: 'service_unavailable' }, 503);
    }
  }
};
