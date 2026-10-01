# Análise de automação

Public route: `/automation`. Portuguese only, independent of the saved homepage language.
The Vercel rewrite serves `automation/index.html`; `/automation/` also works on a static preview.
Canonical URL and sitemap point to `/automation`.

## Implementation

- Existing `assets/css/main.css`, contact header, homepage footer and form components are reused.
- Page-specific rules live in `assets/css/automation.css`; no homepage styles are changed.
- `assets/js/automation.mjs` controls the five questions, validation, results and contact request.
- `assets/js/automation-math.mjs` is shared by browser and server. Annual factors are explicitly 220 working days, 44 weeks, 12 months. Equivalent days use eight hours. Only display values are rounded.
- Unknown hourly cost is `null`, not zero. The 50% comparison is illustrative, not an estimate of achievable savings.
- Answers and campaign attribution live in tab-scoped session storage, with a 24-hour expiry checked on restore. Contacts are never stored there. Clear-analysis and successful submission remove the previous answers.

## Delivery and configuration

The lead uses the existing `POST /api/contact` and Resend configuration:
`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (existing fallback: `hello@vouga-agency.pt`).
No new email service, database, public secret or paid dependency is required.

`source: website_automation` identifies this request type. The API validates the analysis and recomputes all totals using the shared calculator. `lib/automation.mjs` formats the process, inputs, annual occurrences, hours, equivalent days, optional costs and attribution into the existing plain-text/escaped-HTML email. The existing email includes contact details and an authoritative server timestamp.

UTMs `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` are preserved through back/refresh. Other query parameters are excluded from emailed URLs. Referrers are stored without query/fragment at the server boundary.

The exact campaign combination below is labelled `Leanked Newsletter #01`:

`/automation?utm_source=leanked&utm_medium=newsletter&utm_campaign=automation_01`

All other entries are labelled `website_automation`. Attribution is user-supplied context, not verified identity.

The existing consent checkbox is reused solely for responding to the analysis. No marketing opt-in is added.
Existing JSON-only, same-origin, honeypot and five-requests-per-ten-minutes IP checks remain. Actual request bytes are now checked even without Content-Length. The existing rate limit is per serverless instance, not a durable distributed limit.

## Funnel measurement

No existing analytics platform was found. The page emits `vouga:automation` DOM events and sends the same allowlisted events to `/api/automation-events`, which writes structured `automation_funnel` JSON records to Vercel runtime logs:

- `automation_started`
- `automation_step_1_completed` to `automation_step_4_completed`
- `automation_calculation_completed`
- `automation_lead_submitted` (after successful contact response)

Each event includes a random tab-journey ID, server timestamp and campaign category. It contains no answers, names, email addresses, phone numbers or arbitrary query strings. The frontend sends each event once per journey, including across refresh. Count distinct journey IDs per event to build the funnel; use `source` to filter the Leanked campaign. As with client analytics, events are indicative and can be blocked or forged. Rate limits are process-local.

These are **runtime logs, not a persistent analytics database or dashboard**. Use the project's Vercel Logs view, filtering `automation_funnel`, and export within the hosting plan's retention period. Long-term retention requires an existing log export or a separately chosen storage destination. No new analytics account was provisioned.

## Local use and checks

`bun run dev` serves the website and the real API handlers at `http://127.0.0.1:4173/`.
Bun loads locally configured environment variables. Without Resend variables the real form returns an honest unavailable error; it never simulates delivery. Stop any previous static server using the port first.

`bun test` runs contact, calculation and event-handler tests. Email transport is mocked; no real messages are sent.

Browser checks, with an installed Playwright or Playwright Core module:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs \
CHROME_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
node tests/automation-browser.mjs
```

The browser suite mocks delivery and event collection, covers 1920, 1366, 768, 390 and 320-pixel widths, and writes screenshots to `/private/tmp/vouga-automation-qa`. It verifies back-navigation, refresh, optional cost, UTM retention, rate-limit/service errors, confirmation, duplicate event prevention, and horizontal overflow.

Before the newsletter is sent, deploy to Vercel with the existing email environment configured and submit one approved live test. Confirm receipt in the configured inbox and view the corresponding funnel events in Vercel Logs. Automated local tests do not prove live email delivery.
