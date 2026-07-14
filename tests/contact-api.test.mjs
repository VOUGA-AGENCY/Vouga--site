import assert from 'node:assert/strict';
import test from 'node:test';
import contactHandler from '../api/contact.mjs';

const originalFetch = globalThis.fetch;
const originalApiKey = process.env.RESEND_API_KEY;
const originalFrom = process.env.CONTACT_FROM_EMAIL;
const originalTo = process.env.CONTACT_TO_EMAIL;

function request(body) {
  return new Request('https://www.vouga-agency.pt/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Vouga contact test',
      'X-Forwarded-For': '203.0.113.10'
    },
    body: JSON.stringify(body)
  });
}

function validPayload(overrides = {}) {
  return {
    name: 'Pedro Santos',
    email: 'nome@exemplo.com',
    phone: '+351 912 345 678',
    company: 'Empresa',
    message: 'Precisamos de transformar este processo interno.',
    language: 'pt',
    consent: true,
    website: '',
    ...overrides
  };
}

test.beforeEach(() => {
  process.env.RESEND_API_KEY = 're_test_value';
  process.env.CONTACT_FROM_EMAIL = 'Vouga Website <forms@send.vouga-agency.pt>';
  process.env.CONTACT_TO_EMAIL = 'hello@vouga-agency.pt';
});

test.after(() => {
  globalThis.fetch = originalFetch;
  if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalApiKey;
  if (originalFrom === undefined) delete process.env.CONTACT_FROM_EMAIL;
  else process.env.CONTACT_FROM_EMAIL = originalFrom;
  if (originalTo === undefined) delete process.env.CONTACT_TO_EMAIL;
  else process.env.CONTACT_TO_EMAIL = originalTo;
});

test('normalises and emails a valid contact request', async () => {
  let url;
  let options;
  globalThis.fetch = async (requestUrl, requestOptions) => {
    url = requestUrl;
    options = requestOptions;
    return Response.json({ id: 'email_test_123' }, { status: 200 });
  };

  const response = await contactHandler.fetch(request(validPayload()));
  const body = await response.json();
  const email = JSON.parse(options.body);

  assert.equal(response.status, 201);
  assert.equal(body.ok, true);
  assert.match(body.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(options.headers.Authorization, 'Bearer re_test_value');
  assert.equal(email.from, 'Vouga Website <forms@send.vouga-agency.pt>');
  assert.deepEqual(email.to, ['hello@vouga-agency.pt']);
  assert.equal(email.reply_to, 'nome@exemplo.com');
  assert.equal(email.subject, '[Vouga website] Empresa · Pedro Santos');
  assert.match(email.text, /Phone: \+351912345678/);
  assert.match(email.html, /Precisamos de transformar este processo interno\./);
});

test('escapes submitted HTML before building the email', async () => {
  let email;
  globalThis.fetch = async (_url, options) => {
    email = JSON.parse(options.body);
    return Response.json({ id: 'email_test_123' }, { status: 200 });
  };

  const response = await contactHandler.fetch(request(validPayload({
    name: 'Pedro <Admin>',
    message: 'Alterar <script>alert("x")</script> neste processo.'
  })));

  assert.equal(response.status, 201);
  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.html, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
});

test('rejects a number that is invalid for its country code', async () => {
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return Response.json({ id: 'email_test_123' });
  };

  const response = await contactHandler.fetch(request(validPayload({ phone: '+351 12' })));
  const body = await response.json();

  assert.equal(response.status, 422);
  assert.equal(body.field, 'phone');
  assert.equal(body.code, 'invalid_phone');
  assert.equal(called, false);
});

test('rejects an email without a valid address structure', async () => {
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return Response.json({ id: 'email_test_123' });
  };

  const response = await contactHandler.fetch(request(validPayload({ email: 'nomeexemplo.com' })));
  const body = await response.json();

  assert.equal(response.status, 422);
  assert.equal(body.field, 'email');
  assert.equal(body.code, 'invalid_email');
  assert.equal(called, false);
});

test('requires every field except phone', async () => {
  globalThis.fetch = async () => Response.json({ id: 'email_test_123' });

  const withoutPhone = await contactHandler.fetch(request(validPayload({ phone: '' })));
  assert.equal(withoutPhone.status, 201);

  const withoutCompany = await contactHandler.fetch(request(validPayload({ company: '' })));
  const body = await withoutCompany.json();
  assert.equal(withoutCompany.status, 422);
  assert.equal(body.field, 'company');
});

test('silently accepts honeypot submissions without sending email', async () => {
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return Response.json({ id: 'email_test_123' });
  };

  const response = await contactHandler.fetch(request(validPayload({ website: 'spam.example' })));
  assert.equal(response.status, 202);
  assert.equal(called, false);
});

test('returns unavailable when email configuration is missing', async () => {
  delete process.env.RESEND_API_KEY;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return Response.json({ id: 'email_test_123' });
  };

  const response = await contactHandler.fetch(request(validPayload()));
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.code, 'service_unavailable');
  assert.equal(called, false);
});

test('returns unavailable when Resend rejects delivery', async () => {
  globalThis.fetch = async () => Response.json({ message: 'Sender domain is not verified' }, { status: 403 });

  const response = await contactHandler.fetch(request(validPayload()));
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.code, 'service_unavailable');
});
