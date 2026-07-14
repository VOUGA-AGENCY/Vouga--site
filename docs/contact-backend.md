# Contact backend

The contact form posts to the same-origin Vercel Function at `/api/contact`. The Function validates and normalises the payload before inserting it into `public.contact_requests` in Supabase.

## Supabase

Apply `supabase/migrations/202607140001_create_contact_requests.sql` through the Supabase CLI or SQL editor. The migration enables Row Level Security and grants no access to `anon` or `authenticated`; website submissions can only be inserted by the server-side key used by the Vercel Function.

## Vercel environment

Add these variables to Production and Preview, then redeploy:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

For a project using legacy Supabase keys, `SUPABASE_SERVICE_ROLE_KEY` is also supported. Never expose either secret in client-side JavaScript or with a public environment-variable prefix.

## Data flow

1. The browser validates required fields, email syntax and the optional international phone number.
2. `/api/contact` repeats every validation, normalises email and phone, and rejects cross-origin requests and bot honeypot submissions.
3. The phone is stored in E.164 format with its ISO country code.
4. The Function stores a salted hash of the requesting IP, not the raw IP address.

The API expects JSON and returns `201` with a `requestId` on success, `422` for a field validation error, and `503` when the database is unavailable or not configured.
