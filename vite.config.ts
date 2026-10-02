import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

function devApiPlugin() {
  return {
    name: 'dev-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: any) => {
        if (req.url && req.url.startsWith('/api/fetch-metadata')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const targetUrl = urlObj.searchParams.get('url');

            if (!targetUrl) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Thiếu tham số url.' }));
              return;
            }

            // Basic SSRF check
            const parsed = new URL(targetUrl);
            const host = parsed.hostname.toLowerCase();
            if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.startsWith('192.168.') || host.startsWith('10.')) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Truy cập dải mạng nội bộ bị từ chối (SSRF Protection).' }));
              return;
            }

            const response = await fetch(parsed.toString(), {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml'
              }
            });

            if (!response.ok) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: `Website trả về lỗi HTTP ${response.status}.` }));
              return;
            }

            const html = await response.text();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ html: html.slice(0, 2 * 1024 * 1024) }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Lỗi kết nối: ${err.message}` }));
          }
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
});
