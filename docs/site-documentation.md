# Vouga Agency Site Documentation

Last updated: 2026-06-14

This document is the living reference for the Vouga Agency website. Every meaningful iteration on copy, design, SEO, performance, accessibility, deployment or technical structure should update this file.

## Company Positioning

Vouga Agency is positioned as an applied intelligence and product development company for businesses.

Primary market:
- Companies that want to deploy AI inside real workflows.
- Business teams with scattered knowledge, slow processes, repetitive operations or underused AI licenses.
- Founders and companies that need MVPs, prototypes and go-to-market software built end to end.

Primary offer:
- Enterprise AI services.
- AI workflow automation.
- AI knowledge systems.
- AI sales copilots.
- Meeting-to-execution agents.
- AI governance audits.
- AI enablement and training.
- MVP and prototype development.
- Go-to-market product builds.

Core message:
Vouga does not sell generic AI tools. Vouga redesigns real company work around intelligence and builds the systems, prototypes and products needed to make that change operational.

## Site Content

The site is a single-page company website with anchored sections:

- Hero: "AI, built around the business" introduces applied AI as business infrastructure.
- Why: explains the gap between AI curiosity and operational change.
- Services: lists the agency's AI operating-system services.
- Service detail overlay: expands each AI service with problem, deployment model and KPIs.
- AI Knowledge System demo: a dedicated product-style page where a manager turns a stuck commercial decision into a cited decision packet with owner, risk, reply and tasks. It is accessible directly from the services list through a small floating demo action.
- Method: explains the engagement model: operating sprint, pilot build and operating partner.
- Proof: presents example outcomes and measurable operational improvements.
- About: describes the team philosophy and systems-thinking approach.
- Foundation: introduces Vouga Foundation, the build arm for MVPs, prototypes and product handover.
- Contact: email and lightweight contact form.
- Privacy Policy: explains enquiry data, purposes, retention, rights and contact details.
- Terms: basic website terms, confidentiality warning and no automatic engagement language.
- Footer: office, contact, social links, NIF and brand mark.

## Design System

The site is intentionally minimal, editorial and high-trust. It avoids generic SaaS cards and heavy decoration. The visual language should feel like a focused AI/product studio rather than a loud marketing page.

Principles:
- Minimal layout with strong typography.
- Large editorial headings.
- Restrained color palette.
- High whitespace.
- Thin dividers.
- Motion used as atmosphere, not distraction.
- No decorative clutter.
- Business-first copy.

Colors:
- Light background: `#edeae2`
- Light surface: `#e7e2d8`
- Primary text: `#1a1813`
- Dim text: `#615e54`
- Divider: `#dcd7ca`
- Accent amber: `#c97800`
- Dark background: `#15140f`
- Dark surface: `#1d1b16`
- Foundation green light/dark: `#0d4a1a`, `#1d8a35`, `#3db85a`, `#90e8a0`

Typography:
- Display font: Instrument Serif from Google Fonts.
- Sans font: system UI stack.
- Mono font: system monospace stack.

Visual assets:
- `assets/img/poster.jpg`: 1920x1080 poster and social preview image.
- `assets/img/logo_vouga.png`: official Vouga logo used as the structured-data organization logo and source brand asset.
- `assets/img/favicon.png`: 512x512 favicon derived from the official logo for browser tabs, bookmarks and Apple touch icons.
- Navigation wordmark: the inline SVG logo inherits `currentColor`; in light mode the logo and "Agency" text render black.
- Navigation color behavior: the symbol, "Vouga" and "Agency" all inherit the same `.logo` color and transition together when the theme changes.
- `assets/video/vouga.mp4`: hero video sampled into a halftone canvas effect.

Motion and effects:
- The hero uses a hidden video and canvas sampling to create a dotted halftone field.
- The hero video is requested immediately with `src`, `autoplay` and `preload="auto"` so the halftone canvas has video frames available from the first viewport.
- The video/canvas effect is still disabled when `prefers-reduced-motion` is active.
- If video sampling fails, the hero falls back to drifting dots.
- The why section uses canvas-drawn guide lines around the Vouga mark.
- Content reveals on scroll through IntersectionObserver.
- Motion respects `prefers-reduced-motion`.
- Theme preference is stored in `localStorage`.
- The AI Knowledge System demo uses interaction state and motion to show a before/after management workflow: scattered sources visually converge into a packet, then produce citations, owner, draft reply and generated tasks. It is a front-end simulation only, designed to communicate deployment value without requiring a backend.

## Technical Structure

Current structure:

```text
index.html
ai-knowledge-demo.html
assets/
  css/
    main.css
    knowledge-demo.css
  js/
    main.js
    knowledge-demo.js
  img/
    poster.jpg
  video/
    vouga.mp4
docs/
  site-documentation.md
llms.txt
robots.txt
site.webmanifest
sitemap.xml
```

Responsibilities:
- `index.html`: page structure, semantic content, metadata, JSON-LD structured data and external asset references.
- `ai-knowledge-demo.html`: dedicated AI Knowledge System demo page with product-style motion and glass interface.
- `privacy.html`: privacy policy for enquiry and website data.
- `terms.html`: basic website terms.
- `assets/css/main.css`: visual system, responsive layout, themes and motion styling.
- `assets/js/main.js`: theme switching, scroll progress, reveal animation, canvas effects, service overlay, ASCII footer mark and contact form behavior.
- `assets/img/`: image assets and social preview assets.
- `assets/video/`: video assets.
- `docs/`: project documentation and iteration history.
- `_headers`: production security and cache headers for hosts that support Netlify-style headers.

The site is static and does not currently require a build step, package manager or backend.

## SEO Strategy

Primary SEO intent:
- AI services for companies.
- Enterprise AI agency.
- AI workflow automation.
- AI knowledge systems.
- AI sales copilot.
- AI governance audit.
- AI enablement.
- MVP development.
- Prototype development.
- Go-to-market product development.

Implemented in this iteration:
- Stronger `<title>` and meta description.
- Search-oriented keywords meta tag.
- Canonical URL: `https://vouga.agency/`.
- Open Graph tags for LinkedIn, WhatsApp and social previews.
- Twitter card metadata.
- Large social image using `assets/img/poster.jpg`.
- Robots directives for normal search crawlers.
- `robots.txt` with access for search and AI crawlers.
- `sitemap.xml` with homepage and primary anchored sections.
- `llms.txt` to summarize the business, services and best-fit searches for LLM-oriented retrieval.
- JSON-LD structured data using `Organization`, `WebSite`, `ProfessionalService` and `ItemList`.

Important assumption:
The canonical domain is currently assumed to be `https://vouga.agency/`. If the production domain changes, update it in:
- `index.html`
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- this documentation

## LLM and Chatbot Discoverability

The site is prepared for AI search and answer engines through:
- Clear company positioning in natural language.
- Explicit service catalog in structured data.
- `llms.txt` with concise service descriptions and use cases.
- Robots access for common search and AI crawlers.
- Repeated but natural terms around enterprise AI, workflow automation, MVPs and prototypes.

Editorial rule:
Do not stuff invisible keywords or add spammy copy. LLM and search visibility should come from clear, specific, crawlable descriptions of what Vouga does.

## Deployment Notes

The site can be deployed as a static site to:
- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- Any static host or CDN

Recommended next production files:
- Real contact form endpoint.

## Known Gaps

To improve before final production launch:
- Encode smaller production video variants; current MP4 is loaded immediately for stronger first-viewport visual impact.
- Add a WebM version and fallback source list when a media pipeline such as `ffmpeg` is available.
- Replace `mailto:` contact form with a reliable submission endpoint.
- Review privacy/legal pages with legal counsel before final launch.
- Confirm production host applies `_headers` or port them to host-specific configuration.
- Add analytics only if privacy-conscious and legally documented.
- Validate final domain and social preview image after deployment.

## Iteration Log

### 2026-06-14

- Split single-file site into scalable structure with external CSS and JS.
- Moved poster and video into `assets/img/` and `assets/video/`.
- Added SEO, social sharing and crawler metadata.
- Added JSON-LD structured data for organization, website and services.
- Added `site.webmanifest`, `robots.txt`, `sitemap.xml` and `llms.txt`.
- Created this living documentation file.

### 2026-06-14 - Brand asset correction

- Replaced the provisional SVG favicon reference with brand assets derived from `assets/img/logo_vouga.png`.
- Updated the manifest, Apple touch icon and JSON-LD organization logo to use the official logo image.
- Generated `assets/img/favicon.png`, a square favicon variant derived from the official logo for crisper browser-tab rendering.

### 2026-06-14 - Hero video performance

- Restored eager hero video loading after visual testing showed the lazy strategy could make the hero feel delayed or partially cut.
- The video now uses direct `src`, `autoplay`, `preload="auto"` and `poster` again.
- Kept the drifting-dots fallback for cases where playback or frame sampling fails.
- Increased the video sampling cell size from 10px to 12px to reduce per-frame canvas work.
- Documented that codec-level compression and a WebM variant remain a future media-pipeline task.

### 2026-06-14 - Legal, accessibility, headers and deploy hygiene

- Added `privacy.html` with controller, enquiry data, purpose, legal basis, retention, rights, security and contact sections.
- Added `terms.html` with basic website terms, confidentiality guidance and no automatic client-engagement language.
- Added required name, email, message and privacy acknowledgement fields to the contact form.
- Added footer links to Privacy and Terms.
- Improved the service overlay with `aria-labelledby`, dynamic title id, focus trapping, Escape handling and background inerting for keyboard users.
- Added `_headers` with security headers, CSP, permissions policy and cache-control rules for static hosting.
- Added `.gitignore`, `README.md` and `docs/deploy-checklist.md`.
- Updated `sitemap.xml` and `llms.txt` with legal pages.

### 2026-06-14 - Light theme and legal page branding

- Adjusted the light theme to a more muted dirty white: `#edeae2`, with surface `#e7e2d8`.
- Changed the navigation "Agency" wordmark color to inherit the current theme text color instead of staying white.
- Replaced the PNG logo in `privacy.html` and `terms.html` with the inline currentColor SVG mark, matching the main page light-mode branding.

### 2026-06-14 - AI Knowledge System demo

- Added a floating demo button directly in the services list for the AI Knowledge System row.
- Moved the demo out of the service overlay and into `ai-knowledge-demo.html`.
- Removed the demo button from the service detail overlay; the demo is now linked only from the services list.
- Rebuilt the demo into a three-step management workflow: operational chaos, source convergence and a final decision packet.
- Focused the story on a concrete manager pain: discount approval stuck across email, pricing rules, CRM and old proposals.
- Added visual before/after metrics, cited evidence, owner/risk/deadline, draft reply and generated tasks.
- Reduced explanatory text so the value is carried by the interface and the output, not by copy.
- Added dedicated demo CSS and JS for glass cards, source convergence, central packet motion and progressive output actions.
- Corrected the navigation wordmark so "Agency", "Vouga" and the logo mark transition color together.
- Adjusted the services-list demo action so the standard service arrow remains centered in the right action column, with the Demo button aligned underneath it.
