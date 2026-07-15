# Vouga Agency Website

Last updated: 2026-07-14

This document describes the current public website. It is a reference for content, design, URLs, frontend behaviour, SEO and deployment. Historical changes belong in Git and in the active Vouga build loop, not in this file.

## Product status

The website is the first public version of Vouga Agency. It presents Vouga as a systems-led transformation and product company, shows selected concepts, explains the active capabilities and routes commercial enquiries to a dedicated contact form.

The website is independent from Vouga OS. Changes here must not alter Vouga OS product code or documentation.

## Positioning

Primary positioning:

> Vouga is a systems-led transformation and product company. We find the source of complex business problems and deliver the right change through strategy, software, AI and execution.

The site should communicate four ideas consistently:

- The business is read as a connected system before a solution is chosen.
- Vouga owns progress through delivery instead of stopping at recommendations.
- AI is used when it creates leverage, not as the default answer.
- UI and UX make complex systems understandable, usable and adoptable.

The three capability names are:

- **Vouga Intelligence:** AI systems integrated into real operational work.
- **Vouga Engineering:** validation, product design, software engineering, internal tools and integrations, with or without AI.
- **Vouga Academy:** a future applied-learning capability currently in development.

Do not reintroduce the former `Foundations` name, a standalone diagnosis offer, the former `How We Work` section or positioning centred on generic AI services and MVP development.

## Information architecture

### Homepage

The homepage order is:

1. Hero
2. Why Vouga
3. Selected Work
4. Capabilities
5. How Systems Change
6. Footer

The primary navigation is:

- `Our Approach` / `Como Pensamos` -> `#why-vouga`
- `Use Cases` / `Casos de Uso` -> `#use-cases`
- `Capabilities` / `Áreas` -> `#pillars`
- `Contact us` / `Falar connosco` -> the contact page

`How Systems Change` is intentionally not present in the navbar.

### Selected Work

The rail contains five concept cards, ordered as follows:

1. Strategic knowledge system
2. Energy optimization product
3. Employee portal with a copilot
4. Voice agent with contextual memory
5. Performance review workspace

The front of each card shows the visual, title and classification. Hover introduces `Learn more`; click or keyboard activation flips the card. The back contains problem, intervention, expected result, capability signature and target impact.

All five current entries are explicitly classified as `Concept`. Their figures are target impacts, not verified client results. Never rewrite them as measured outcomes without evidence.

### Capability pages

`intelligence.html` contains:

- Hero and Vouga Intelligence identity
- What we build
- How it works
- Solutions
- When to choose Intelligence

`foundations.html` is the physical source file for **Vouga Engineering** and contains:

- Hero and Vouga Engineering identity
- What we build
- How it works
- Solutions
- When to choose Engineering
- Final contact CTA

`academy.html` is intentionally incomplete. It keeps the Academy hero, blurred future content and a `Still loading...` message that types when the lower stage enters the viewport.

### Contact and legal pages

`contact.html` contains a bilingual contact form. It sends enquiries to the same-origin `/api/contact` endpoint; it does not open the visitor's email client and does not store submissions in a website database.

`privacy.html` and `terms.html` are English-only legal pages. They must be reviewed whenever the contact flow, tracking, providers, legal entity or data-retention practice changes.

## URL behaviour

The production domain is:

```text
https://www.vouga-agency.pt/
```

The physical static files remain part of the implementation:

```text
/intelligence.html
/foundations.html
/academy.html
/contact.html
```

Client-side navigation loads those files and then normalises the visible browser URL with `history.replaceState`:

```text
/#intelligence
/#engineering
/#academy
/#contact
```

The logo always returns to `/#top`. Intelligence, Engineering and Contact also include a fixed minimal back control. It uses browser history when a referrer exists and falls back to `/#top` for direct entry.

Current canonical behaviour is not identical for every page:

- Homepage: `/`
- Contact: `/#contact`
- Intelligence: `/intelligence.html`
- Engineering: `/foundations.html`
- Academy: `/academy.html`
- Privacy: `/privacy.html`
- Terms: `/terms.html`

Do not change file names, visible aliases, canonical tags, structured data, sitemap entries or internal route interception independently. They form one URL contract and must be reviewed together.

## Language

The public homepage and capability pages use English as the default language. Portuguese is available through the `PT/EN` segmented control. The selected value is stored under `vouga-lang` in `localStorage` and is shared across pages.

Current exceptions:

- A direct visit to `contact.html` starts in Portuguese when no preference exists.
- Privacy and Terms are English only.
- Search engines receive the static metadata in the HTML; runtime language changes update metadata only on pages that implement that behaviour.

Visible copy changes must be made in both languages. Keep `data-i18n`, `data-en` / `data-pt` and `data-contact-i18n` values aligned with their JavaScript dictionaries.

## Visual system

The website is dark-only. Theme switching and the stored `vouga-theme` preference were removed. `site-preferences.js` enforces `data-theme="dark"` and clears any obsolete theme value.

Core tokens from `assets/css/main.css`:

```text
Background          #141412
Surface             #1d1b16
Selected-work tail  #0c0c0a
Primary text        #ece8de
Dim text            #a9a496
Faint text          #6b665b
Divider             #2c2a23
Primary accent      #c97800
```

Capability accents:

- Intelligence: amber, orange and purple.
- Engineering: green gradient.
- Academy: blue gradient.

Contact uses a darker dedicated surface based on `#070808`.

Typography:

- Display: Instrument Serif.
- Interface and body: Inter, with system fallbacks.
- Technical labels and ASCII: system monospace stack.

The site supports viewports from 320 px upward and uses `clamp()`, grid, safe-area insets and dedicated mobile compositions. Font sizes do not scale directly with viewport width outside bounded `clamp()` rules.

## Motion and interaction

Active motion includes:

- First-load homepage preloader.
- Hero image with a sparse, animated ASCII contour canvas.
- Gradual blur transition between Hero and Why Vouga.
- IntersectionObserver content reveals.
- Horizontal Selected Work rail with controls, keyboard access and card flips.
- Play-once Capabilities orbit choreography that resolves into three cards.
- `sessionStorage` key `vouga-pillars-cards-ready` so returning from a capability page shows the cards without replaying the orbit.
- Mutating ASCII symbols in How Systems Change, capability cards, detail heroes and footer signatures.
- Academy `Still loading...` typing sequence.

Motion must respect `prefers-reduced-motion`. Essential content must remain visible and usable when animation is disabled or JavaScript is unavailable.

## Technical structure

There is no general frontend build step. HTML, CSS, JavaScript and images are committed as deployable assets. The only server runtime is the Vercel Function used by the contact form.

```text
index.html
contact.html
intelligence.html
foundations.html
academy.html
privacy.html
terms.html
api/
  contact.mjs
assets/
  css/
    main.css
    pillar-pages.css
  js/
    main.js
    pillar-pages.js
    contact.js
    contact-phone.js
    gradual-blur.js
    site-back.js
    site-preferences.js
  img/
src/
  contact-phone.js
tests/
  contact-api.test.mjs
docs/
  site-documentation.md
  contact-backend.md
  deploy-checklist.md
_headers
.env.example
llms.txt
robots.txt
sitemap.xml
site.webmanifest
package.json
```

Key responsibilities:

- `main.js`: homepage language, preloader, navigation, hero ASCII, reveal effects, Selected Work, Capabilities choreography, systems ASCII and footer behaviour.
- `pillar-pages.js`: capability-page language, navigation, Academy typing and detail ASCII rendering.
- `contact.js`: contact-page language, navigation, client validation, submission and contact ASCII signature.
- `contact-phone.js`: browser bundle for international phone parsing.
- `src/contact-phone.js`: editable source for the phone helper.
- `site-preferences.js`: dark-only and persisted-language bootstrapping before render.
- `site-back.js`: history-based back control for selected internal pages.
- `gradual-blur.js`: reusable layered backdrop blur used at page transitions.
- `api/contact.mjs`: validation and Resend delivery for contact enquiries.

CSS and JavaScript references use manual `?v=` query strings for cache invalidation. Update the query when changing an asset that may otherwise remain cached.

## Contact architecture

The contact path is:

```text
Browser form -> POST /api/contact -> Vercel Function -> Resend -> hello@vouga-agency.pt
```

No Supabase project, contact table or migration is required. Resend and the destination mailbox are the operational records. See `docs/contact-backend.md` for validation rules, environment variables and production verification.

## SEO and discoverability

Primary search themes are:

- Systems-led business transformation
- Product strategy and product engineering
- Software engineering and internal tools
- Applied AI systems and workflow intelligence
- Knowledge systems, operational copilots and decision support
- Business process redesign and execution

The implementation currently includes:

- Canonical domain `www.vouga-agency.pt`.
- English-first homepage title and description.
- Open Graph and Twitter Card metadata on primary acquisition pages.
- `vouga_logos_canva.png` as the social preview image.
- Homepage JSON-LD for `Organization`, `WebSite`, `ProfessionalService` and `ItemList`.
- `robots.txt` for search and named AI crawlers.
- `sitemap.xml` for the homepage, primary anchors, Intelligence, Engineering and legal pages.
- `llms.txt` for concise business and capability context.

Academy and Contact are currently omitted from the sitemap. Academy is intentionally in development; Contact is canonically represented by the homepage hash.

Do not return to keyword lists focused on being an “AI agency” or “MVP agency”. SEO copy and structured data must remain aligned with the systems-led positioning.

## Security and privacy

- The public site currently includes no analytics, advertising pixels or behavioural tracking.
- Contact submissions are validated in the browser and again on the server.
- The contact endpoint accepts same-origin JSON POST requests only, limits the body to 16 KB and includes a honeypot.
- Submitted HTML is escaped before email rendering.
- No website contact database is used.
- `_headers` contains security and caching rules for hosts that support Netlify-style header files. Vercel does not automatically guarantee that format; equivalent production headers must be configured and verified on the selected host.

## Local development

Static page work:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. The static server cannot execute `/api/contact`.

Full contact flow:

```sh
bun install
vercel dev
```

Create a local `.env.local` from `.env.example` when testing real delivery. Environment files are ignored by Git; never commit a Resend key.

Commands:

```sh
bun test
bun run build:phone
```

Run `build:phone` only after changing `src/contact-phone.js`.

## Launch dependencies and known gaps

- Verify `send.vouga-agency.pt` in Resend with the required SPF and DKIM records.
- Configure the three contact environment variables in Vercel and perform real PT and EN submissions.
- Decide whether Contact should also default to English on direct entry.
- Review the visible hash aliases against canonical and reload behaviour before final URL freeze.
- Port and verify `_headers` rules in the actual Vercel configuration.
- Review Privacy and Terms with legal counsel and confirm the final legal entity details.
- Validate navigation, card interaction, animation and layout on current Chrome, Safari, Firefox, Edge, iOS and Android.
- Run Lighthouse against production and optimise large imagery only when quality can be preserved.
- Validate the final social preview and submit the sitemap after production DNS is active.

Use `docs/deploy-checklist.md` for release sign-off.
