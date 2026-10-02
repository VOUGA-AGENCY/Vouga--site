// Local preview with the same API handlers as Vercel. No mock success or email bypass.
import contact from '../api/contact.mjs';
import events from '../api/automation-events.mjs';
import { resolve, extname } from 'node:path';
const root = resolve(import.meta.dir, '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const server = Bun.serve({
  hostname: '127.0.0.1', port: Number(process.env.PORT || 4173),
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/contact.html') return Response.redirect(new URL('/contact' + url.search, url), 308);
    if (url.pathname === '/api/contact') return contact.fetch(request);
    if (url.pathname === '/api/automation-events') return events.fetch(request);
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return new Response('Pedido inválido', { status: 400 }); }
    if (pathname === '/automation' || pathname === '/automation/') pathname = '/automation/index.html';
    if (pathname === '/') pathname = '/index.html';
    if (pathname === '/leanked' || pathname === '/leanked/') pathname = '/leanked/index.html';
    if (pathname === '/contact' || pathname === '/contact/') pathname = '/contact.html';
    // Serve only public documents and assets, never env files, sources, tests or .git.
    if (!(pathname.startsWith('/assets/') || /^\/[\w-]+\.html$/.test(pathname) || pathname === '/automation/index.html' || pathname === '/leanked/index.html' ||
        ['/robots.txt', '/sitemap.xml', '/llms.txt', '/site.webmanifest'].includes(pathname)) || pathname.split('/').some(part => part.startsWith('.'))) {
      return new Response('Não encontrado', { status: 404 });
    }
    const filename = resolve(root, '.' + pathname);
    if (!filename.startsWith(root + '/')) return new Response('Não encontrado', { status: 404 });
    const file = Bun.file(filename);
    if (!await file.exists()) return new Response('Não encontrado', { status: 404 });
    return new Response(file, { headers: { 'Content-Type': mime[extname(filename)] || file.type, 'Cache-Control': 'no-store' } });
  }
});
console.log(`Vouga local: ${server.url}`);
