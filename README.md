# Vouga Agency Website

Website for Vouga Agency, a systems-led transformation and product company. The public pages are static; `/api/contact` is a Vercel Function backed by Supabase.

## Structure

```text
index.html
ai-knowledge-demo.html
privacy.html
terms.html
assets/
  css/main.css
  js/main.js
  img/
  video/
api/
  contact.mjs
supabase/
  migrations/
docs/
  site-documentation.md
_headers
llms.txt
robots.txt
sitemap.xml
site.webmanifest
```

## Local Development

For page-only work, run a static server from the project root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

If port `8000` is busy, use another port.

For the complete contact flow, configure the environment variables from `.env.example`, apply the Supabase migration and run the project with `vercel dev`. See `docs/contact-backend.md`.

## Deployment

The committed browser assets need no production build step. Deploy the repository root to Vercel so the contact Function in `/api` is available. Run `bun run build:phone` only after changing `src/contact-phone.js`.

Recommended production checks:

- Confirm the production domain is `https://www.vouga-agency.pt/` or update canonical URLs, `sitemap.xml`, `robots.txt`, `llms.txt` and documentation.
- Confirm `_headers` is supported by the host or translate those headers to the host's config format.
- Confirm `privacy.html` and `terms.html` match the final legal entity and have legal review.
- Test social previews with LinkedIn, X/Twitter and WhatsApp-compatible preview tools.
- Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- Confirm contact flow works on desktop and mobile.
- Test `ai-knowledge-demo.html` on desktop and mobile.

## Important Notes

- `docs/site-documentation.md` is the living source of truth for design, content, SEO, accessibility and technical decisions.
- Update that document after each meaningful iteration.
- The contact form requires the Vercel and Supabase setup documented in `docs/contact-backend.md`.
