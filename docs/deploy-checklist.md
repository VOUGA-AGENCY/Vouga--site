# Production deploy checklist

Last updated: 2026-07-14

Use this checklist for the first public release and subsequent production deployments.

## 1. Scope and repository

- [ ] Confirm the deployment contains only approved website changes.
- [ ] Confirm Vouga OS files were not changed as part of the website deploy.
- [ ] Review `git status` and the final diff.
- [ ] Run `git diff --check`.
- [ ] Confirm no `.env`, `.env.local`, API key or credential is tracked.
- [ ] Confirm manual CSS and JavaScript `?v=` query versions were updated where required.

## 2. Dependencies and tests

- [ ] Confirm the Vercel Root Directory is the repository root.
- [ ] Use the `Other` framework preset; the site has no general frontend build command or output directory.
- [ ] Confirm Vercel installs the committed dependency set needed by `api/contact.mjs`.
- [ ] Run `bun install` with the committed lockfile.
- [ ] Run `bun test`; all contact API tests must pass.
- [ ] If `src/contact-phone.js` changed, run `bun run build:phone` and verify the generated `assets/js/contact-phone.js` diff.
- [ ] Serve the static site locally and confirm every HTML, CSS, JavaScript and image request returns successfully.
- [ ] Run the full contact flow with `vercel dev` when backend behaviour changed.

## 3. Content and positioning

- [ ] Confirm the homepage order is Hero -> Why Vouga -> Selected Work -> Capabilities -> How Systems Change -> Footer.
- [ ] Confirm there is no standalone Diagnosis or former How We Work section.
- [ ] Confirm `Vouga Engineering` is used publicly; `Foundations` appears only in the physical filename and implementation identifiers where still necessary.
- [ ] Confirm Academy is clearly presented as in development on its page.
- [ ] Confirm all Selected Work cards are accurately classified.
- [ ] Confirm target impacts are labelled as targets and are not presented as verified client results.
- [ ] Review every EN and PT string for meaning, grammar and consistency.
- [ ] Confirm the footer slogan remains `understand, before building.` in both languages.

## 4. Navigation and URLs

- [ ] Test desktop and mobile navbar links from the homepage.
- [ ] Test navbar links from Intelligence, Engineering, Academy and Contact back to the correct homepage anchors.
- [ ] Confirm the logo returns to `/#top` from every page.
- [ ] Confirm all Contact CTAs open the contact page.
- [ ] Test the back control on Intelligence, Engineering and Contact with browser history and by direct entry.
- [ ] Test Selected Work previous/next controls, keyboard focus, Enter/Space card flip and touch interaction.
- [ ] Test all Capability links and browser Back behaviour.
- [ ] Confirm no visible internal URL unexpectedly exposes `.html` after client navigation.
- [ ] Test direct loads and refreshes for `/`, `/#contact`, `/#intelligence`, `/#engineering`, `/#academy` and every canonical `.html` URL.
- [ ] Confirm Privacy, Terms, email, phone and LinkedIn links work.
- [ ] Check for orphan pages and broken internal or external links.

## 5. Language and theme

- [ ] Confirm the homepage defaults to English with no stored preference.
- [ ] Confirm Intelligence, Engineering and Academy default to English with no stored preference.
- [ ] Decide and verify the intended direct-entry default for Contact; it currently starts in Portuguese without a stored preference.
- [ ] Toggle PT/EN on every bilingual page and confirm the choice persists across navigation.
- [ ] Confirm titles, descriptions, labels, placeholders, form errors and accessibility labels switch correctly.
- [ ] Confirm Privacy and Terms being English-only is acceptable for launch.
- [ ] Confirm the site remains dark-only and no theme toggle or stale light-theme surface appears.

## 6. Contact delivery

- [ ] Verify `send.vouga-agency.pt` in Resend.
- [ ] Confirm SPF and DKIM records are valid.
- [ ] Configure `RESEND_API_KEY` in Vercel.
- [ ] Configure `CONTACT_FROM_EMAIL` in Vercel.
- [ ] Configure `CONTACT_TO_EMAIL=hello@vouga-agency.pt` in Vercel.
- [ ] Apply variables to Production and Preview, then redeploy.
- [ ] Submit one PT and one EN production enquiry.
- [ ] Confirm both emails contain name, email, optional phone, company, message, language and request ID.
- [ ] Confirm direct Reply uses the visitor address.
- [ ] Test invalid email, invalid phone, missing consent and missing required fields.
- [ ] Confirm a submission without phone succeeds.
- [ ] Confirm no database or Supabase dependency is required.
- [ ] Review Vercel and Resend logs for errors without exposing personal data unnecessarily.

See `docs/contact-backend.md` for the full contract and troubleshooting steps.

## 7. SEO and social

- [ ] Confirm production domain is `https://www.vouga-agency.pt/`.
- [ ] Review title and meta description on every indexable page.
- [ ] Confirm canonical tags match the approved URL contract.
- [ ] Confirm Open Graph and Twitter Card values and image URLs.
- [ ] Test `assets/img/poster.jpg` with LinkedIn and other relevant preview validators.
- [ ] Validate homepage JSON-LD and confirm company email, phone, LinkedIn and capabilities are current.
- [ ] Review heading hierarchy and ensure every page has one clear H1.
- [ ] Confirm decorative images/ASCII are hidden from assistive technology and meaningful imagery has appropriate alternatives.
- [ ] Validate `robots.txt` and its sitemap URL.
- [ ] Validate every `sitemap.xml` URL in production and update `lastmod` when content changes materially.
- [ ] Confirm excluding Academy and Contact from the sitemap remains intentional.
- [ ] Review `llms.txt` for current positioning, capability names, contact details and URLs.
- [ ] Submit the sitemap to Google Search Console and Bing Webmaster Tools after DNS is stable.

## 8. Accessibility

- [ ] Navigate the full site using keyboard only.
- [ ] Confirm focus is visible on links, buttons, carousel controls, cards, language toggles and form fields.
- [ ] Open and close the mobile menu with keyboard; verify Escape and focus behaviour.
- [ ] Confirm Selected Work cards communicate their pressed state and do not duplicate visible headings for screen readers.
- [ ] Confirm every form error is associated with its field and announced appropriately.
- [ ] Confirm the language toggle updates the document language.
- [ ] Test at 200% browser zoom without clipped text or horizontal page scrolling.
- [ ] Test `prefers-reduced-motion`; content must remain available without required animation.
- [ ] Check contrast for normal, dim, faint, accent, error and focus states on the dark backgrounds.
- [ ] Verify touch targets on current iOS and Android devices.

## 9. Responsive and browser QA

- [ ] Test current Chrome, Safari, Firefox and Edge on desktop.
- [ ] Test iOS Safari and Android Chrome on physical devices when available.
- [ ] Test at 320, 375, 390, 768, 1024, 1440 and wide-desktop widths.
- [ ] Confirm the Hero image and ASCII contour remain aligned on desktop and mobile.
- [ ] Confirm the Hero-to-Why gradual blur has no hard edge on Windows/Edge.
- [ ] Confirm Selected Work flips without clipping or showing the mirrored front face.
- [ ] Confirm Capabilities completes smoothly, collapses excess scroll and does not replay after returning from a capability page.
- [ ] Confirm Intelligence and Engineering hero ASCII stays within its column and remains readable on mobile.
- [ ] Confirm Academy typing starts when `Still loading...` enters the viewport.
- [ ] Confirm Contact principles, form and Porto signature remain compact and aligned on mobile.

## 10. Performance

- [ ] Run Lighthouse on the production homepage, Contact, Intelligence and Engineering pages.
- [ ] Review Core Web Vitals after real hosting and CDN behaviour are active.
- [ ] Confirm below-the-fold Selected Work images remain lazy-loaded.
- [ ] Confirm preloader failure cannot leave the page permanently blocked.
- [ ] Check that ASCII animation pauses or reduces work when off-screen or reduced motion is enabled.
- [ ] Check image transfer sizes, especially hero and Selected Work assets; optimise only without visible quality loss.
- [ ] Confirm CSS and JavaScript revalidate correctly and image cache headers do not preserve obsolete assets under unchanged filenames.

## 11. Security and legal

- [ ] Port `_headers` security rules to the production host configuration; for Vercel, verify equivalent response headers explicitly.
- [ ] Confirm HTTPS and automatic HTTP-to-HTTPS redirect.
- [ ] Confirm CSP permits only the current fonts, images, scripts, styles and same-origin API calls.
- [ ] Confirm HTML and API responses containing user-specific state are not cached.
- [ ] Review Privacy Policy against Resend, Vercel, mailbox retention and any new provider.
- [ ] Review Terms and confirm legal entity name, address, NIF and contact details.
- [ ] Confirm no analytics, cookies or trackers were introduced; if they were, update consent and legal documentation before launch.
- [ ] Obtain legal review before treating Privacy and Terms as final.

## 12. Post-deploy verification

- [ ] Open production in a clean/private browser with no stored language preference.
- [ ] Repeat the critical navigation and contact journey on desktop and mobile.
- [ ] Check browser console and network panel for errors, 404s, CSP violations and mixed content.
- [ ] Confirm favicon, web manifest and social image are reachable.
- [ ] Confirm all canonical, sitemap and `llms.txt` URLs resolve on production.
- [ ] Confirm Resend delivery and Reply-To with a real message.
- [ ] Record the deployment URL and commit in the active loop or release record.
- [ ] Keep the previous production deployment available for rollback until verification is complete.
