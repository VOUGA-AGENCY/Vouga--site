# Vouga Agency Website

Public website for Vouga Agency, focused on stronger industrial operations through systems thinking, software, automation and applied AI.

The public pages are static. The contact form posts to a same-origin Vercel Function, which validates the submission and delivers it through Resend.

## Current structure

```text
index.html
contact.html
privacy.html
terms.html
assets/
  css/main.css
  fonts/
  img/
  js/
    main.js
    gradual-blur.js
    site-preferences.js
    contact.js
    contact-phone.js
    site-back.js
api/
  contact.mjs
src/
  contact-phone.js
tests/
  contact-api.test.mjs
docs/
  site-documentation.md
  deploy-checklist.md
  contact-backend.md
```

The homepage contains the hero, Why Now, Our Approach, Operating Model, Selected Work application examples, About and footer. Selected Work is hash-routed inside the homepage.

## Local development

For page-only work:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`.

For the complete contact flow, configure the variables described in `docs/contact-backend.md` and run `vercel dev`.

## Commands

```sh
bun test
bun run build:phone
```

Run `build:phone` only after changing `src/contact-phone.js`. The committed `assets/js/contact-phone.js` must match the generated bundle.

## Deployment

Deploy the repository root to Vercel so `/api/contact` remains available. Before production:

- Run the automated tests.
- Check the homepage and all Selected Work routes in Portuguese and English.
- Test desktop, mobile and reduced-motion behaviour.
- Submit a real contact request in staging.
- Validate metadata, structured data, social previews, sitemap and legal pages.
- Confirm the production domain and Resend sender configuration.
- Review the Privacy Policy and Terms whenever the contact flow, providers or legal entity details change.

`docs/site-documentation.md` is the source of truth for the current site. Update it after meaningful structural or content changes.
