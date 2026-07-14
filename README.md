# Vouga Agency Website

Static website for Vouga Agency, a systems-led transformation and product company.

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
docs/
  site-documentation.md
_headers
llms.txt
robots.txt
sitemap.xml
site.webmanifest
```

## Local Development

Run a static server from the project root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

If port `8000` is busy, use another port.

## Deployment

The site has no build step. Deploy the repository root to a static host such as Netlify, Cloudflare Pages, Vercel or GitHub Pages.

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
- The current contact form uses `mailto:`. Replace it with a reliable endpoint before serious lead generation.
