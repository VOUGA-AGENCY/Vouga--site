# Vouga × Leanked

Public route: `/leanked`. Uses the existing Inter font, shared navigation styles,
contact flow (`/contact`) and persisted `vouga-lang` PT/EN preference. New page
styles are scoped to `.partnership-page`. Homepage changes are limited to the
announcement below its two hero buttons and its two translations.

Content is server-readable Portuguese HTML. `assets/js/leanked.mjs` contains
both complete language dictionaries and updates content, accessible navigation
labels and metadata when the language changes. The provided metrics refer to
Leanked's previous work, not guaranteed outcomes of the partnership.

The original `assets/img/leanked.png` is preserved. The page serves optimised
JPEG derivatives at 1200 and 3008 pixels wide with `srcset`, explicit dimensions
and high fetch priority. No crop is applied. Text uses Inter; the navigation
retains the Vouga wordmark styling. The new 3008 × 1616 image starts behind the
transparent navigation at natural aspect ratio. A masked blur blends its bottom
edge into the page. The shared photographic footer and ASCII mark are reused,
with a matching blur transition. The content omits the repeated service lists
and five-step method, and links directly to https://www.leanked.com/.

Routes are configured in `vercel.json` and the existing local dev server.
The page is included in `sitemap.xml`. No new dependencies or external services.

Browser checks: `tests/leanked-browser.mjs` uses the same Playwright environment
variables as `tests/automation-browser.mjs`. Covers five viewport widths,
PT/EN, persistence, menu keyboard dismissal, homepage links, image proportions,
font, contact CTA, overflow and JavaScript errors. No emails are submitted.
