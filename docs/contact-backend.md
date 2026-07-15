# Contact delivery

Last updated: 2026-07-14

The website contact form delivers enquiries by email. It does not use Supabase or any other website contact database.

## Architecture

```text
contact.html
  -> assets/js/contact.js
  -> POST /api/contact
  -> api/contact.mjs on Vercel
  -> Resend Email API
  -> hello@vouga-agency.pt
```

The browser and server both validate the submission. The Vercel Function is the security boundary; browser validation is only user feedback.

## Form fields

| Field | Required | Server rule |
| --- | --- | --- |
| `name` | Yes | 2-100 characters after whitespace normalisation |
| `email` | Yes | Valid address structure, maximum 254 characters, normalised to lowercase |
| `phone` | No | When supplied, must be valid for its international country code |
| `company` | Yes | 2-120 characters after whitespace normalisation |
| `message` | Yes | 10-5000 characters, line breaks preserved |
| `language` | Yes | `en` or `pt`; any other value falls back to `pt` |
| `consent` | Yes | Boolean `true` |
| `website` | No | Honeypot; a non-empty value is silently accepted without sending |

The browser also includes `source: website_contact`. The current server does not persist or use that value.

The phone helper is built from `src/contact-phone.js` with `libphonenumber-js/max`:

```sh
bun run build:phone
```

Run this only after changing the source helper.

## Endpoint contract

`POST /api/contact`

Requirements:

- Same-origin request when an `Origin` header is present.
- `Content-Type: application/json`.
- Body no larger than 16 KB when `Content-Length` is available.
- JSON payload following the field rules above.

Responses:

| Status | Meaning |
| --- | --- |
| `201` | Email accepted by Resend; response contains `ok: true` and a generated `requestId` |
| `202` | Honeypot submission silently accepted; no email sent |
| `400` | Invalid JSON |
| `403` | Cross-origin request rejected |
| `405` | Method other than POST; `Allow: POST` is returned |
| `413` | Declared payload is larger than 16 KB |
| `415` | Content type is not JSON |
| `422` | Field validation failed; response includes `field` and `code` |
| `503` | Resend configuration is missing/invalid or email delivery failed |

All responses use `Cache-Control: no-store`.

## Email contents

The Function sends both plain-text and HTML versions. The email includes:

- Request ID and received timestamp
- Selected website language
- Name, email, optional E.164 phone and company
- Message

The subject format is:

```text
[Vouga website] Company · Name
```

The visitor address is set as `Reply-To`, so replying from the Vouga inbox addresses the visitor directly. User-provided HTML is escaped before the HTML email is built.

## Resend setup

Create and verify a dedicated sending subdomain in Resend, recommended:

```text
send.vouga-agency.pt
```

Add the SPF and DKIM records provided by Resend to DNS and wait for the domain status to become `verified`.

Recommended sender:

```text
Vouga Website <forms@send.vouga-agency.pt>
```

The sender does not need to be a mailbox because replies use the visitor's email through `Reply-To`.

Create a Resend API key with only the permission needed to send email.

## Environment variables

Required server-side configuration:

```text
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=Vouga Website <forms@send.vouga-agency.pt>
CONTACT_TO_EMAIL=hello@vouga-agency.pt
```

`CONTACT_TO_EMAIL` defaults to `hello@vouga-agency.pt` in code, but it should still be configured explicitly in production.

In the Vercel dashboard:

1. Open the website project.
2. Go to `Settings` -> `Environment Variables`.
3. Add each variable separately.
4. Enable at least `Production` and `Preview`; add `Development` when using `vercel dev` with pulled variables.
5. Redeploy after changing a variable.

Enter the raw value in Vercel. Do not add shell quotes around `CONTACT_FROM_EMAIL` in the dashboard.

For local development, create `.env.local` from `.env.example`. `.env`, `.env.local` and other environment files are ignored by Git. Never expose `RESEND_API_KEY` in browser JavaScript or with a public environment-variable prefix.

## Local development

Install dependencies and run the Vercel runtime:

```sh
bun install
vercel dev
```

A static server such as `python3 -m http.server` can render the form but cannot execute `/api/contact`.

Run the automated API suite:

```sh
bun test
```

The tests currently cover:

- Successful delivery and email payload
- HTML escaping
- International phone validation
- Email validation
- Required and optional fields
- Honeypot behaviour
- Missing configuration
- Resend delivery failure

Tests mock Resend and do not send real email.

## Abuse controls

Current controls:

- Browser and server validation
- Same-origin check
- JSON-only endpoint
- 16 KB request limit
- Hidden honeypot
- No-store responses

There is currently no CAPTCHA, IP rate limit or durable abuse ledger. Add further controls only if real traffic demonstrates a need. Any new tracking or anti-abuse provider must be reflected in the Privacy Policy.

## Data handling

No website database record is created. Operational traces exist in:

- The destination mailbox
- Resend delivery logs
- Temporary Vercel function logs

Retention and access therefore depend on the mailbox, Resend and Vercel configuration. Keep the Privacy Policy aligned with those providers and practices.

## Production verification

After every contact-backend deployment:

1. Submit a Portuguese enquiry.
2. Submit an English enquiry.
3. Confirm both arrive at `hello@vouga-agency.pt` with every field intact.
4. Confirm the phone is normalised to E.164 when provided.
5. Reply to both and confirm the recipient is the visitor address.
6. Confirm delivery in the Resend dashboard.
7. Test an invalid email and invalid phone; confirm no email is sent.
8. Leave the phone empty and confirm the submission succeeds.
9. Check that no API key appears in page source, browser bundles or logs returned to the client.

## Troubleshooting

`503 service_unavailable`:

- Confirm all Vercel variables exist in the environment being tested.
- Confirm the latest deployment includes the new variables.
- Confirm the sender domain is verified in Resend.
- Check Vercel function logs and the Resend event log.

Form renders but submission fails locally:

- Confirm the site is running through `vercel dev`, not only a static HTTP server.

Email arrives but replies go to the sender:

- Inspect the Resend payload and received headers for `Reply-To`.

Phone is rejected:

- Include `+` and the international country code; validity is checked against the numbering plan for that country.
