const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const { seed } = require('./scripts/seed');

// Đọc .env.test để Cypress dùng cùng DATABASE_URL và JWT_SECRET với backend.
const envTest = Object.fromEntries(
  fs.readFileSync(path.join(__dirname, '.env.test'), 'utf8')
    .split(/\r?\n/)
    .filter(l => l.trim() && !l.trim().startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5500',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    env: {
      apiUrl: `http://localhost:${envTest.PORT || 3000}`,
      remoteApi: 'https://garagemanagement-wip3.onrender.com',
    },
    setupNodeEvents(on) {
      on('task', {
        'db:seed': () => seed(envTest.DATABASE_URL),
        // Ký token tuỳ ý, ví dụ { payload: {...}, expiresIn: -1 } để có token đã hết hạn (TC-AUTH-12).
        'jwt:sign': ({ payload, expiresIn }) =>
          jwt.sign(payload, envTest.JWT_SECRET, expiresIn !== undefined ? { expiresIn } : {}),
        'jwt:decode': token => jwt.decode(token),
        // Truy vấn trực tiếp CSDL test để kiểm tra dữ liệu (ví dụ TC-AUTH-07).
        'db:query': async ({ sql, params = [] }) => {
          const client = new Client({ connectionString: envTest.DATABASE_URL });
          await client.connect();
          try { return (await client.query(sql, params)).rows; } finally { await client.end(); }
        },
      });
    },
  },
});
