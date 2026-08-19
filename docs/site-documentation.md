# Vouga Agency Site Documentation

Last updated: 2026-08-19

## Purpose and positioning

The website presents Vouga Agency as a partner for industrial companies that want stronger operations through systems thinking, software, automation and applied AI.

The primary promise is operational growth. The site should not drift back to generic product-company, MVP-development or AI-agency positioning unless the business strategy changes explicitly.

## Public pages

- `/` — homepage and hash-routed Selected Work details.
- `/contact.html` — dedicated bilingual contact form.
- `/privacy.html` — English Privacy Policy.
- `/terms.html` — English website terms.

There are no standalone Intelligence, Engineering, Foundations or Academy pages.

## Homepage structure

1. Hero
2. Why Now — `#why-vouga`
3. Our Approach — `#our-approach`
4. Operating Model — `#how-we-intervene`
5. Selected Work — `#use-cases`
6. About — `#about`
7. Footer/contact — `#contact`

The hero uses separate desktop and mobile WebP artwork plus an animated ASCII canvas. The ASCII canvas pauses when it is outside the viewport and does not animate when reduced motion is requested.

## Operating model

The three layers are:

- Visibility — positioning, websites, SEO/GEO and commercial materials.
- Operations — operational systems, integrations, dashboards and automation.
- Intelligence — knowledge systems, internal search, copilots and AI agents.

Every engagement can start in one layer and evolve into the others as the operating system becomes clearer.

## Selected Work

Selected Work remains the public section name. Its six entries are application examples, not published client case studies.

Each example contains:

- A recurring operational problem.
- A possible system and implementation structure.
- External market evidence.
- Indicators that should be measured.
- Target improvement ranges.

External evidence is not a Vouga result. Target ranges are project objectives, not guarantees. Copy must avoid implying that an example is a completed client engagement unless supporting evidence is available.

Routes use `#work/<slug>` and are rendered inside `index.html`.

## Language

The homepage and contact page support Portuguese and English through the language toggle. Portuguese is the default when no valid preference exists. The preference is stored as `vouga-lang` in `localStorage`.

Metadata is updated when the homepage language changes. Privacy and Terms are currently English-only.

## Contact flow

The homepage routes contact CTAs to `contact.html`. The form sends JSON to the same-origin `/api/contact` endpoint.

The form collects:

- Name
- Email
- Optional phone
- Company
- Message
- Consent
- Hidden honeypot

The endpoint validates, normalises, rate-limits and escapes submissions before sending them through Resend. It does not store submissions in a website database.

See `docs/contact-backend.md` for configuration and operational details.

## Frontend files

- `assets/css/main.css` — all active public-page styles.
- `assets/js/main.js` — homepage language, navigation, preloader, Selected Work routing, ASCII rendering, reveals and carousel behaviour.
- `assets/js/contact.js` — contact-page language, form validation and submission.
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
- `https://www.vouga-agency.pt/contact.html`
- `https://www.vouga-agency.pt/privacy.html`
- `https://www.vouga-agency.pt/terms.html`

The sitemap contains documents, not fragment URLs. Structured data and `llms.txt` must use the same industrial-operations positioning as the visible homepage.

## Accessibility

- Decorative images and ASCII canvases are hidden from assistive technology.
- Meaningful images require useful alternatives.
- Navigation controls expose labels and expanded state.
- The contact form has explicit labels, errors, consent and a live status region.
- Motion-heavy components respect `prefers-reduced-motion`.
- Keyboard navigation must work for the menu, carousel controls, Selected Work routes and contact form.

## Maintenance

After a meaningful change:

1. Run `bun test`.
2. Confirm the browser bundles parse.
3. Check local file references and internal hashes.
4. Test desktop, mobile, Portuguese, English and reduced motion.
5. Update this document, the deployment checklist, sitemap, metadata and `llms.txt` when the site structure or positioning changes.
