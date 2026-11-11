'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const API_URL = 'http://localhost:3000';
const UI_URL = 'http://localhost:5500';

function assertTestDatabase(databaseUrl) {
  let url;
  try { url = new URL(databaseUrl); } catch { throw new Error('DATABASE_URL test không hợp lệ. Dùng tests/.env.test.example.'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) ||
      !['localhost', '127.0.0.1'].includes(url.hostname) ||
      url.port !== '5433' || url.pathname !== '/autogara_test' || url.search) {
    throw new Error('Chỉ chạy với PostgreSQL local cổng 5433, database autogara_test; không dùng Neon hoặc DB khác.');
  }
  return databaseUrl;
}

function loadTestEnv() {
  const file = path.join(ROOT, '.env.test');
  if (!fs.existsSync(file)) fs.copyFileSync(path.join(ROOT, '.env.test.example'), file);
  // Cypress 13 chạy config trong Node 18 đi kèm Electron, dù máy cài Node 22/24.
  // Không dùng util.parseEnv / process.loadEnvFile (chưa có trong Node 18).
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  assertTestDatabase(env.DATABASE_URL);
  if (env.PORT !== '3000' || env.NODE_ENV !== 'development' || !env.JWT_SECRET) {
    throw new Error('tests/.env.test cần PORT=3000, NODE_ENV=development và JWT_SECRET. Xem .env.test.example.');
  }
  return env;
}

module.exports = { ROOT, API_URL, UI_URL, loadTestEnv, assertTestDatabase };
