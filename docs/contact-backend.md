# Contact backend

The contact form posts to the same-origin Vercel Function at `/api/contact`. The Function validates and normalises the payload, then sends it to `hello@vouga-agency.pt` through the Resend Email API. No website contact database is used.

## Resend domain

Add and verify a sending domain in Resend before production. A dedicated subdomain such as `send.vouga-agency.pt` keeps transactional sending separate from normal mailbox delivery.

Add the SPF and DKIM records provided by Resend to DNS and wait until the domain status is `verified`. The address configured in `CONTACT_FROM_EMAIL` must use that verified domain. It does not need to be a real inbox because replies use the visitor's address through `Reply-To`.

Recommended sender:

```text
Vouga Website <forms@send.vouga-agency.pt>
```

## Vercel environment

Create a Resend API key restricted to sending email. Add these variables to Production and Preview in Vercel, then redeploy:

```text
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=Vouga Website <forms@send.vouga-agency.pt>
CONTACT_TO_EMAIL=hello@vouga-agency.pt
```

Never expose `RESEND_API_KEY` in client-side JavaScript or with a public environment-variable prefix.

## Data flow

1. The browser validates required fields, email syntax and the optional international phone number.
2. `/api/contact` repeats every validation, normalises email and phone, and rejects cross-origin requests and bot honeypot submissions.
3. The Function sends text and HTML versions of the enquiry to `CONTACT_TO_EMAIL`.
4. The visitor email is set as `Reply-To`, so replying from the Vouga inbox addresses the visitor directly.
5. The mailbox and Resend delivery logs are the only operational records; no website database record is created.

The API expects JSON and returns `201` with a `requestId` on success, `422` for a field validation error, and `503` when email delivery or configuration is unavailable.

## Production verification

After deployment:

1. Submit one Portuguese and one English enquiry.
2. Confirm both arrive at `hello@vouga-agency.pt` with all fields intact.
3. Reply to each message and confirm the recipient is the visitor address, not the sender address.
4. Confirm the send appears as delivered in Resend.
5. Test an invalid phone number and confirm no email is sent.
