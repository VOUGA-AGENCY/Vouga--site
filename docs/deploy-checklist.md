# Deploy Checklist

Use this checklist before publishing Vouga Agency to production.

## Domain and SEO

- [ ] Confirm final production domain.
- [ ] Update canonical URLs in `index.html`, `privacy.html` and `terms.html`.
- [ ] Update `sitemap.xml`.
- [ ] Update `robots.txt`.
- [ ] Update `llms.txt`.
- [ ] Test Open Graph image and title.
- [ ] Submit sitemap to search engines.

## Legal

- [ ] Confirm legal entity name, address and NIF.
- [ ] Review `privacy.html`.
- [ ] Review `terms.html`.
- [ ] Confirm the contact form note and consent text.
- [ ] Confirm whether analytics/cookies are added; if yes, update privacy/cookie notices.

## Accessibility

- [ ] Test keyboard navigation from top to footer.
- [ ] Open each service overlay with keyboard.
- [ ] Confirm Tab and Shift+Tab stay inside the modal.
- [ ] Confirm Escape closes the modal and returns focus.
- [ ] Test reduced-motion mode.
- [ ] Check contrast in light and dark themes.

## Performance

- [ ] Confirm hero imagery and ASCII overlay load without blocking interaction.
- [ ] Run Lighthouse or WebPageTest after deploy.

## Hosting

- [ ] Confirm `_headers` is applied or ported to host config.
- [ ] Confirm HTTPS is active.
- [ ] Confirm assets use long cache headers.
- [ ] Confirm HTML and legal pages revalidate.
- [ ] Confirm 404 behavior.

## Contact Flow

- [ ] Verify the Resend sending domain and its SPF/DKIM records.
- [ ] Configure `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` in Vercel.
- [ ] Confirm enquiries arrive at `hello@vouga-agency.pt` in PT and EN.
- [ ] Confirm replying to an enquiry uses the visitor address from `Reply-To`.
- [ ] Confirm spam protection.
- [ ] Confirm no sensitive data is requested.
