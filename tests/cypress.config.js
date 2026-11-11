const { defineConfig } = require('cypress');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const { seed } = require('./scripts/seed');
const { API_URL, UI_URL, loadTestEnv } = require('./scripts/environment');
const envTest = loadTestEnv();

module.exports = defineConfig({
  video: false,
  viewportWidth: 1440,
  viewportHeight: 1000,
  retries: 0,
  defaultCommandTimeout: 6000,
  requestTimeout: 10000,
  responseTimeout: 15000,
  taskTimeout: 30000,
  env: { apiUrl: API_URL, remoteApi: 'https://garagemanagement-wip3.onrender.com' },
  e2e: {
    baseUrl: UI_URL,
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    excludeSpecPattern: '**/dashboard.phase2.cy.js',
    testIsolation: true,
    setupNodeEvents(on, config) {
      if (![UI_URL, API_URL].includes(config.baseUrl) || config.env.apiUrl !== API_URL ||
          config.env.remoteApi !== 'https://garagemanagement-wip3.onrender.com') {
        throw new Error('Cypress chỉ dùng localhost:3000/5500. Xóa biến CYPRESS_baseUrl, CYPRESS_apiUrl hoặc CYPRESS_remoteApi cũ trong terminal.');
      }
      on('task', {
        'db:seed': () => seed(envTest.DATABASE_URL),
        'jwt:sign': ({ payload, expiresIn }) => jwt.sign(payload, envTest.JWT_SECRET,
          expiresIn !== undefined ? { expiresIn } : {}),
        'jwt:decode': token => jwt.decode(token),
        'db:query': async ({ sql, params = [] }) => {
          const client = new Client({ connectionString: envTest.DATABASE_URL });
          await client.connect();
          try { return (await client.query(sql, params)).rows; } finally { await client.end(); }
        },
      });
      return config;
    },
  },
});
