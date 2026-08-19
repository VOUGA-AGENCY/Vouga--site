# Vouga Agency Deployment Checklist

Last updated: 2026-08-19

## Before deployment

- [ ] Review the intended diff and confirm no unrelated local work is included.
- [ ] Run `bun test`.
- [ ] Confirm `assets/js/contact-phone.js` matches `bun run build:phone` when its source changed.
- [ ] Confirm all active JavaScript bundles parse successfully.
- [ ] Check that every local `src` and `href` target exists.
- [ ] Check that homepage hashes resolve, excluding the intentional `#work/<slug>` router.

## Homepage

- [ ] Confirm section order: Hero → Why Now → Our Approach → Operating Model → Selected Work → About → Footer.
- [ ] Confirm Portuguese and English copy.
- [ ] Confirm desktop and mobile hero artwork.
- [ ] Confirm hero ASCII alignment, speed and reduced-motion behaviour.
- [ ] Confirm navigation and mobile menu.
- [ ] Confirm Selected Work rail buttons, keyboard arrows and all six routes.
- [ ] Confirm each work detail is labelled as an application example.
- [ ] Confirm external evidence links open safely in a new tab.
- [ ] Confirm target ranges are described as objectives rather than guarantees.
- [ ] Confirm the About carousel pauses off-screen and stops under reduced motion.

## Contact

- [ ] Open `/contact.html` directly and through homepage CTAs.
- [ ] Test Portuguese and English labels, placeholders and errors.
- [ ] Test required fields, optional phone and consent.
- [ ] Test a valid international phone number and an invalid number.
- [ ] Submit successfully against staging.
- [ ] Confirm the email arrives, Reply-To is correct and submitted HTML is escaped.
- [ ] Confirm missing configuration and Resend rejection show a safe user-facing error.
- [ ] Confirm same-origin enforcement, honeypot, request-size limit and rate limit.

## Responsive and accessibility

- [ ] Test at 320, 375, 390, 768, 1024, 1440 and 1920 pixels.
- [ ] Test keyboard-only navigation.
- [ ] Test visible focus states.
- [ ] Test with `prefers-reduced-motion: reduce`.
- [ ] Confirm no horizontal overflow.
- [ ] Confirm one visible H1 per route state.
- [ ] Confirm meaningful images have alt text and decorative media is hidden.
- [ ] Confirm form errors and status messages are announced.

## Performance

- [ ] Confirm the initial preloader requests only the logo and correct hero variant.
- [ ] Confirm below-the-fold images remain lazy-loaded.
- [ ] Confirm photographic assets use compressed WebP.
- [ ] Confirm no animation loop continues unnecessarily outside the viewport.
- [ ] Run Lighthouse on homepage, one work detail and contact page.
- [ ] Check Core Web Vitals and layout shift on mobile.

## SEO and content

- [ ] Confirm homepage positioning matches industrial operations, software, automation and AI.
- [ ] Validate JSON-LD.
- [ ] Confirm canonical URLs for homepage, contact, privacy and terms.
- [ ] Confirm sitemap contains only real documents and current dates.
- [ ] Confirm `robots.txt`, `llms.txt`, Open Graph and Twitter metadata.
- [ ] Test LinkedIn, WhatsApp and X/Twitter previews.
- [ ] Recheck every external statistic and source URL.
- [ ] Confirm Selected Work is presented as application examples, not client case studies.
- [ ] Review Privacy and Terms when providers, data collection or the legal entity changes.

## Production configuration

- [ ] Confirm `RESEND_API_KEY`.
- [ ] Confirm `CONTACT_FROM_EMAIL` uses a verified sender domain.
- [ ] Confirm `CONTACT_TO_EMAIL`.
- [ ] Confirm Vercel serves the security and cache headers.
- [ ] Confirm HTTPS and production-domain redirects.
- [ ] Submit the sitemap to search consoles after structural changes.
