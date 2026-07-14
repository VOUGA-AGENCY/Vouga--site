import { randomUUID } from 'node:crypto';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

const MAX_BODY_BYTES = 16_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function invalid(field, code) {
  return json({ ok: false, field, code }, 422);
}

function validatePhone(raw) {
  if (!raw) return { e164: null, country: null };
  const phone = parsePhoneNumberFromString(raw, { extract: false });
  if (!phone || !phone.country || !phone.isValid()) return null;
  return { e164: phone.number, country: phone.country };
}

function buildEmailText(record) {
  return [
    'New conversation from the Vouga website',
    '',
    `Request ID: ${record.requestId}`,
    `Received: ${record.submittedAt}`,
    `Language: ${record.language.toUpperCase()}`,
    '',
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    `Phone: ${record.phoneE164 || 'Not provided'}`,
    `Company: ${record.company}`,
    '',
    'Message:',
    record.message
  ].join('\n');
}

function buildEmailHtml(record) {
  const rows = [
    ['Name', record.name],
    ['Email', record.email],
    ['Phone', record.phoneE164 || 'Not provided'],
    ['Company', record.company],
    ['Language', record.language.toUpperCase()],
    ['Request ID', record.requestId]
  ].map(([label, value]) => `
    <tr>
      <td style="padding:8px 18px 8px 0;color:#777;font-size:13px;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:8px 0;color:#171713;font-size:14px;vertical-align:top">${escapeHtml(value)}</td>
    </tr>`).join('');

  return `<!doctype html>
  <html lang="en">
    <body style="margin:0;padding:32px;background:#f4f1eb;color:#171713;font-family:Inter,Arial,sans-serif">
      <main style="max-width:680px;margin:0 auto;background:#fff;padding:36px;border:1px solid #dedad1">
        <p style="margin:0 0 12px;color:#777;font-size:11px;letter-spacing:.12em;text-transform:uppercase">Vouga Agency · Website</p>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:34px;font-weight:400;line-height:1.05">New conversation.</h1>
        <table style="width:100%;margin:28px 0;border-collapse:collapse;border-top:1px solid #e6e2da;border-bottom:1px solid #e6e2da">${rows}
        </table>
        <p style="margin:0 0 10px;color:#777;font-size:11px;letter-spacing:.12em;text-transform:uppercase">Message</p>
        <p style="margin:0;color:#171713;font-size:15px;line-height:1.65;white-space:normal">${escapeHtml(record.message).replace(/\n/g, '<br>')}</p>
        <p style="margin:30px 0 0;color:#999;font-size:11px">Received ${escapeHtml(record.submittedAt)}. Reply directly to this email to contact ${escapeHtml(record.name)}.</p>
      </main>
    </body>
  </html>`;
}

async function sendContactEmail(record, env) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'vouga-contact-form/1.0'
    },
    body: JSON.stringify({
      from: env.from,
      to: [env.to],
      reply_to: record.email,
      subject: `[Vouga website] ${record.company} · ${record.name}`,
      text: buildEmailText(record),
      html: buildEmailHtml(record)
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Contact email failed', response.status, JSON.stringify(result).slice(0, 500));
    throw new Error('email_delivery_failed');
  }
  return result.id || null;
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

    const apiKey = process.env.RESEND_API_KEY;
    const from = cleanSingleLine(process.env.CONTACT_FROM_EMAIL);
    const to = cleanSingleLine(process.env.CONTACT_TO_EMAIL || 'hello@vouga-agency.pt').toLowerCase();
    if (!apiKey || !from || !EMAIL_PATTERN.test(to)) {
      console.error('Missing or invalid RESEND_API_KEY, CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL');
      return json({ ok: false, code: 'service_unavailable' }, 503);
    }

    const requestId = randomUUID();
    const record = {
      requestId,
      submittedAt: new Date().toISOString(),
      name,
      email,
      phoneE164: phone.e164,
      phoneCountry: phone.country,
      company,
      message,
      language
    };

    try {
      await sendContactEmail(record, { apiKey, from, to });
      return json({ ok: true, requestId }, 201);
    } catch {
      return json({ ok: false, code: 'service_unavailable' }, 503);
    }
  }
};
