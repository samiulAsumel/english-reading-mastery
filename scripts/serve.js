'use strict';

/**
 * Zero-dependency static file server for dist/. Mirrors how most static
 * hosts behave: a directory request serves its index.html, an unknown
 * path serves 404.html with a 404 status. Used for local preview
 * (`npm run serve`) and by `npm run dev`.
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const DIST = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 4000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

function safeJoin(base, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0]);
  const resolved = path.normalize(path.join(base, decoded));
  if (!resolved.startsWith(base)) return base; // path traversal guard
  return resolved;
}

function send(res, status, filePath) {
  const ext = path.extname(filePath);
  res.writeHead(status, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

function createServer() {
  return http.createServer((req, res) => {
    let filePath = safeJoin(DIST, req.url || '/');

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      const notFound = path.join(DIST, '404.html');
      if (fs.existsSync(notFound)) return send(res, 404, notFound);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    send(res, 200, filePath);
  });
}

if (require.main === module) {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ does not exist yet — run `npm run build` first.');
    process.exit(1);
  }
  createServer().listen(PORT, () => {
    console.log(`Serving dist/ at http://localhost:${PORT}`);
  });
}

module.exports = { createServer, PORT };
