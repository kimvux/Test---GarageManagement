'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const frontend = path.resolve(__dirname, '../../frontend');
const files = { '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/script.js': ['script.js', 'text/javascript; charset=utf-8'] };
const server = http.createServer((req, res) => {
  const route = new URL(req.url, 'http://localhost').pathname;
  const file = files[route];
  if (!file || !['GET', 'HEAD'].includes(req.method)) { res.writeHead(404); res.end(); return; }
  fs.readFile(path.join(frontend, file[0]), (error, contents) => {
    if (error) { res.writeHead(500); res.end(error.message); return; }
    res.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : contents);
  });
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(5500, () => console.log('Frontend test sẵn sàng: http://localhost:5500'));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
