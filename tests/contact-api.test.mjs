import assert from 'node:assert/strict';
import test from 'node:test';
import contactHandler from '../api/contact.mjs';

const originalFetch = globalThis.fetch;
const originalUrl = process.env.SUPABASE_URL;
const originalSecret = process.env.SUPABASE_SECRET_KEY;
const originalLegacySecret = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
  process.env.SUPABASE_URL = 'https://project.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_value';
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

test.after(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = originalUrl;
  if (originalSecret === undefined) delete process.env.SUPABASE_SECRET_KEY;
  else process.env.SUPABASE_SECRET_KEY = originalSecret;
  if (originalLegacySecret === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = originalLegacySecret;
});

test('normalises and submits a valid contact request', async () => {
  let inserted;
  let headers;
  globalThis.fetch = async (_url, options) => {
    inserted = JSON.parse(options.body);
    headers = options.headers;
    return new Response(null, { status: 201 });
  };

  const response = await contactHandler.fetch(request(validPayload()));
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.ok, true);
  assert.match(body.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(inserted.email, 'nome@exemplo.com');
  assert.equal(inserted.phone_e164, '+351912345678');
  assert.equal(inserted.phone_country, 'PT');
  assert.equal(inserted.consent, true);
  assert.match(inserted.ip_hash, /^[a-f0-9]{64}$/);
  assert.equal(headers.apikey, 'sb_secret_test_value');
  assert.equal(headers.Authorization, undefined);
});

test('rejects a number that is invalid for its country code', async () => {
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(null, { status: 201 });
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
    return new Response(null, { status: 201 });
  };

  const response = await contactHandler.fetch(request(validPayload({ email: 'nomeexemplo.com' })));
  const body = await response.json();

  assert.equal(response.status, 422);
  assert.equal(body.field, 'email');
  assert.equal(body.code, 'invalid_email');
  assert.equal(called, false);
});

test('requires every field except phone', async () => {
  globalThis.fetch = async () => new Response(null, { status: 201 });

  const withoutPhone = await contactHandler.fetch(request(validPayload({ phone: '' })));
  assert.equal(withoutPhone.status, 201);

  const withoutCompany = await contactHandler.fetch(request(validPayload({ company: '' })));
  const body = await withoutCompany.json();
  assert.equal(withoutCompany.status, 422);
  assert.equal(body.field, 'company');
});

test('silently accepts honeypot submissions without writing data', async () => {
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(null, { status: 201 });
  };

  const response = await contactHandler.fetch(request(validPayload({ website: 'spam.example' })));
  assert.equal(response.status, 202);
  assert.equal(called, false);
});

test('supports a legacy service role JWT only on the server request', async () => {
  delete process.env.SUPABASE_SECRET_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'legacy.service.role.jwt';
  let headers;
  globalThis.fetch = async (_url, options) => {
    headers = options.headers;
    return new Response(null, { status: 201 });
  };

  const response = await contactHandler.fetch(request(validPayload()));

  assert.equal(response.status, 201);
  assert.equal(headers.apikey, 'legacy.service.role.jwt');
  assert.equal(headers.Authorization, 'Bearer legacy.service.role.jwt');
});
