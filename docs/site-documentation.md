# Vouga Agency Site Documentation

Last updated: 2026-10-22

## Purpose and positioning

The website presents Vouga Agency as a partner for industrial companies that want stronger operations through systems thinking, software, automation and applied AI.

The primary promise is operational growth. The site should not drift back to generic product-company, MVP-development or AI-agency positioning unless the business strategy changes explicitly.

## Public pages

- `/` — homepage and hash-routed Selected Work details.
- `/#contact` — bilingual contact section with the Cal.com calendar in the homepage footer.
- `/contact` and `/contact.html` — permanent redirects to `/#contact`.
- `/privacy.html` — English Privacy Policy.
- `/terms.html` — English website terms.

There are no standalone Intelligence, Engineering, Foundations or Academy pages.

## Homepage structure

1. Hero
2. Why Now — `#why-vouga`
3. Our Approach — `#our-approach`
4. Operating Model — `#how-we-intervene`
5. Selected Work — `#use-cases`
6. News — `#news`
7. About — `#about`
8. Footer/contact calendar — `#contact`

The hero uses separate desktop and mobile WebP artwork plus an animated ASCII canvas. The ASCII canvas pauses when it is outside the viewport and does not animate when reduced motion is requested.

## Operating model

The three layers are:

- Visibility — positioning, websites, SEO/GEO and commercial materials.
- Operations — operational systems, integrations, dashboards and automation.
- Intelligence — knowledge systems, internal search, copilots and AI agents.

Every engagement can start in one layer and evolve into the others as the operating system becomes clearer.

## Selected Work

Selected Work remains the public section name. Its five entries are application examples, not published client case studies.

Each example contains:

- A recurring operational problem.
- A possible system and implementation structure.
- External market evidence.
- Indicators that should be measured.
- Target improvement ranges.

External evidence is not a Vouga result. Target ranges are project objectives, not guarantees. Copy must avoid implying that an example is a completed client engagement unless supporting evidence is available.

Routes use `#work/<slug>` and are rendered inside `index.html`.

## Language

The homepage, including contact-section copy, supports Portuguese and English through the language toggle. Portuguese is the default when no valid preference exists. The preference is stored as `vouga-lang` in `localStorage`. Cal.com owns the event details and booking interface inside its iframe.

Metadata is updated when the homepage language changes. Privacy and Terms are currently English-only.

## Contact flow

All contact CTAs lead to the homepage calendar at `/#contact`, including model services and Selected Work details. The calendar uses the official Cal.com inline embed for `vouga-agency/discovery-call-vouga-agency`, dark theme and month view. It loads near the footer, with loading/error states and a permanent direct booking link. Cal.com processes meeting bookings; no booking data is copied to the website API.

The old contact document is now only a redirect fallback. Vercel and the local preview redirect both old contact routes. The sitemap excludes those redirected documents.

The automation analysis form still uses `/api/contact` with the existing validation, rate limiting and Resend delivery. No environment variables or backend architecture are changed by the booking embed.

Cal.com's script and iframe origins are explicitly allowed in `vercel.json` and `_headers`. Below the calendar, the homepage ends with the original footer photograph, Inter navigation links over its blue area, and an interactive halftone “VOUGA” wordmark on an extended black base. Leanked and Automation share this footer and link to the homepage for bookings. Its dots respond to pointer movement and clicks, pause offscreen, and remain static with reduced motion enabled.

See `docs/contact-backend.md` for configuration and operational details.

## Frontend files

- `assets/css/main.css` — all active public-page styles.
- `assets/js/main.js` — homepage language, navigation, preloader, Selected Work routing, ASCII rendering, reveals and carousel behaviour.
- `assets/js/booking.js` and `assets/css/booking.css` — lazy-loaded Cal.com embed and footer layout.
- `assets/js/halftone-footer.js` and `assets/css/halftone-footer.css` — shared bilingual footer, canvas wordmark and pointer interaction.
- `assets/js/contact.js` — legacy form implementation, no longer loaded by a public page.
- `assets/js/contact-phone.js` — generated phone-validation bundle.
- `src/contact-phone.js` — source for that generated bundle.
- `assets/js/site-preferences.js` — theme, language preference and internal routing.
- `assets/js/site-back.js` — back-button behaviour.
- `assets/js/gradual-blur.js` — progressive blur enhancement.

## Images

Large photographic assets use WebP. PNG remains for assets that need transparency, icons and social-preview artwork.

When adding images:

- Use WebP or AVIF for photographic artwork.
- Provide explicit intrinsic dimensions.
- Add `loading="lazy"` below the fold.
- Avoid loading desktop and mobile variants simultaneously.
- Keep social-preview dimensions and metadata accurate.
- Do not add an image to the blocking preloader unless it is visible in the initial hero.

## Performance rules

- The preloader waits only for the logo and the correct hero variant and has a 4.5-second safety timeout.
- Continuous animations must pause outside the viewport.
- Reduced-motion preferences must disable non-essential movement.
- Selected Work card images and detail images must remain compressed.
- CSS and JavaScript should not retain code for removed sections.

## SEO

Canonical public documents are:

- `https://www.vouga-agency.pt/`
- `https://www.vouga-agency.pt/privacy.html`
- `https://www.vouga-agency.pt/terms.html`

The sitemap contains documents, not fragment URLs. Structured data and `llms.txt` must use the same industrial-operations positioning as the visible homepage.

## Accessibility

- Decorative images and ASCII canvases are hidden from assistive technology.
- Meaningful images require useful alternatives.
- Navigation controls expose labels and expanded state.
- The contact calendar has an iframe title, loading/error states and a direct booking fallback; the automation form retains explicit labels and validation.
- Motion-heavy components respect `prefers-reduced-motion`.
- Keyboard navigation must work for the menu, carousel controls, Selected Work routes and contact form.

## Maintenance

After a meaningful change:

1. Run `bun test`.
2. Confirm the browser bundles parse.
3. Check local file references and internal hashes.
4. Test desktop, mobile, Portuguese, English and reduced motion.
5. Update this document, the deployment checklist, sitemap, metadata and `llms.txt` when the site structure or positioning changes.
