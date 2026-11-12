'use strict';
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const { spawn, execFileSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const { Client } = require('pg');
const { ROOT, API_URL, UI_URL, loadTestEnv } = require('./environment');
const { up } = require('./database');
const { startBackend } = require('./backend');
const { seed } = require('./seed');
const { check } = require('./check-tests');

const SPECS = {
  all: 'cypress/e2e/{api,ui}/*.cy.js',
  api: 'cypress/e2e/api/*.cy.js',
  ui: 'cypress/e2e/ui/*.cy.js',
  dashboard: 'cypress/e2e/ui/dashboard.phase2.cy.js',
  auth: 'cypress/e2e/api/auth.cy.js,cypress/e2e/ui/login.cy.js',
  orders: 'cypress/e2e/{api,ui}/orders.cy.js',
  parts: 'cypress/e2e/api/parts.cy.js',
  invoices: 'cypress/e2e/{api,ui}/invoices.cy.js',
};
const COUNTS = { all: 82, api: 77, ui: 5, auth: 20, orders: 22, parts: 22, invoices: 18, dashboard: 5 };
const LOCK = path.join(ROOT, '.test-run.lock');
let backend, frontend, environment, databaseReady = false, locked = false, stopping;

async function portBusy(port) {
  return new Promise(resolve => {
    const socket = net.createConnection({ host: 'localhost', port });
    let finished = false;
    const done = busy => { if (!finished) { finished = true; socket.destroy(); resolve(busy); } };
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.setTimeout(1000, () => done(false));
  });
}
async function waitBackend() {
  for (let i = 0; i < 90; i++) {
    if (backend.exitCode !== null) throw new Error('Backend dừng khi khởi động. Xem log phía trên.');
    const client = new Client({ connectionString: environment.DATABASE_URL, connectionTimeoutMillis: 1000 });
    try {
      await client.connect();
      const result = await client.query("SELECT COUNT(*)::int AS n FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('users','customers','vehicles','services','parts','repair_orders','order_services','order_parts','invoices','appointments')");
      const response = await fetch(API_URL, { signal: AbortSignal.timeout(1000) });
      if (result.rows[0].n === 10 && response.ok) return;
    } catch { /* Chờ initDB tạo đủ bảng. */ }
    finally { await client.end().catch(() => {}); }
    await delay(500);
  }
  throw new Error('Backend chưa sẵn sàng sau 45 giây. Xem kết nối PostgreSQL trong log.');
}
async function waitFrontend() {
  for (let i = 0; i < 60; i++) {
    if (frontend.exitCode !== null) throw new Error('Frontend dừng khi khởi động.');
    try {
      const response = await fetch(UI_URL, { signal: AbortSignal.timeout(1000) });
      if (response.ok && (await response.text()).includes('login-username')) return;
    } catch { /* Chờ serve mở cổng. */ }
    await delay(250);
  }
  throw new Error('Frontend chưa sẵn sàng ở localhost:5500.');
}
function lock() {
  if (fs.existsSync(LOCK)) {
    const oldPid = Number(fs.readFileSync(LOCK, 'utf8'));
    let active = true;
    try { process.kill(oldPid, 0); } catch (error) { active = error.code !== 'ESRCH'; }
    if (active) throw new Error('Một phiên test khác đang chạy. Đóng phiên đó trước để tránh seed đè nhau.');
    fs.rmSync(LOCK);
  }
  fs.writeFileSync(LOCK, String(process.pid), { flag: 'wx' });
  locked = true;
}
async function waitExit(child, timeout = 5000) {
  if (!child || child.exitCode !== null) return;
  await Promise.race([new Promise(resolve => child.once('exit', resolve)), delay(timeout)]);
  if (child.exitCode === null) child.kill();
}
async function cleanup() {
  if (stopping) return stopping;
  stopping = (async () => {
    if (frontend && frontend.exitCode === null) { frontend.kill(); await waitExit(frontend); }
    if (backend && backend.exitCode === null) {
      fs.writeFileSync(path.join(ROOT, '.stop-backend'), '');
      await waitExit(backend);
    }
    if (databaseReady) {
      try { await seed(environment.DATABASE_URL); }
      catch (error) { console.error(`Không reset được dữ liệu cuối phiên: ${error.message}`); process.exitCode = 1; }
    }
    if (locked) { fs.rmSync(LOCK, { force: true }); locked = false; }
  })();
  return stopping;
}
function writeResults(results, mode) {
  const dir = path.join(ROOT, 'reports');
  fs.mkdirSync(dir, { recursive: true });
  let sha = 'unknown';
  try { sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { /* Bản ZIP không có git. */ }
  const report = {
    date: new Date().toISOString(), mode, sourceCommit: sha, testCaseSource: 'Test Case.xlsx.pdf', node: process.versions.node,
    cypress: results.cypressVersion, database: 'PostgreSQL local / autogara_test :5433',
    total: results.totalTests, passed: results.totalPassed, failed: results.totalFailed,
    pending: results.totalPending, skipped: results.totalSkipped,
    runs: results.runs.map(run => ({ spec: run.spec.relative,
      tests: run.tests.map(test => ({ id: test.title.join(' ').match(/TC-[A-Z]+-\d{2}/)?.[0] || null, title: test.title.join(' > '), state: test.state,
        error: test.displayError || test.attempts?.find(a => a.error)?.error?.message || null })),
    })),
  };
  fs.writeFileSync(path.join(dir, 'latest-results.json'), JSON.stringify(report, null, 2) + '\n');
  const escape = value => String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  const rows = report.runs.flatMap(run => run.tests.map(t => `| ${escape(run.spec)} | ${escape(t.title)} | ${t.state} | ${escape(t.error || '')} |`));
  fs.writeFileSync(path.join(dir, 'latest-results.md'), `# Kết quả Cypress\n\n${report.date}\n\nCommit: ${sha}\n\nTổng ${report.total}; Pass ${report.passed}; Fail ${report.failed}; Pending ${report.pending}; Skipped ${report.skipped}.\n\n| Spec | Test | Kết quả | Lỗi |\n|---|---|---|---|\n${rows.join('\n')}\n`);
  const csv = value => '"' + String(value ?? '').replace(/"/g, '""') + '"';
  const csvRows = [['Mã TC', 'Spec', 'Tên test', 'Trạng thái', 'Lỗi thực tế']];
  for (const run of report.runs) {
    for (const test of run.tests) csvRows.push([test.id, run.spec, test.title,
      { passed: 'Pass', failed: 'Fail', pending: 'Pending', skipped: 'Skipped' }[test.state] || test.state, test.error]);
  }
  fs.writeFileSync(path.join(dir, 'latest-results.csv'), '\uFEFF' + csvRows.map(row => row.map(csv).join(',')).join('\n') + '\n');
  console.log('\nĐã ghi reports/latest-results.md, .json và .csv (mở bằng Excel).');
}

async function main() {
  const mode = process.argv[2] || 'all';
  if (mode !== 'open' && !SPECS[mode]) throw new Error(`Nhóm test không hợp lệ: ${mode}`);
  check();
  environment = loadTestEnv();
  lock();
  for (const name of ['latest-results.md', 'latest-results.json', 'latest-results.csv']) {
    fs.rmSync(path.join(ROOT, 'reports', name), { force: true });
  }
  const needsUI = !['api', 'parts'].includes(mode);
  for (const port of needsUI ? [3000, 5500] : [3000]) {
    if (await portBusy(port)) throw new Error(`Cổng ${port} đang được dùng. Dừng backend/frontend cũ bằng Ctrl+C rồi chạy lại cùng lệnh.`);
  }
  await up();
  backend = startBackend(true);
  backend.on('error', error => { console.error(error.message); });
  await waitBackend();
  databaseReady = true;
  await seed(environment.DATABASE_URL);
  if (needsUI) {
    frontend = spawn(process.execPath, [path.join(ROOT, 'scripts/frontend.js')],
      { cwd: ROOT, stdio: 'inherit', env: { ...process.env, NO_UPDATE_CHECK: '1' } });
    frontend.on('error', error => { console.error(error.message); });
    await waitFrontend();
  }
  // CYPRESS_* có thể thắng cả options của Module API ở Cypress 13.
  // Xóa các biến trỏ môi trường cũ rồi truyền cấu hình local tường minh.
  for (const key of Object.keys(process.env)) {
    if (key.toUpperCase().startsWith('CYPRESS_') &&
        ['baseurl', 'apiurl', 'remoteapi'].includes(key.slice(8).replace(/_/g, '').toLowerCase())) {
      delete process.env[key];
    }
  }
  const cypress = require('cypress');
  const options = { project: ROOT, configFile: path.join(ROOT, 'cypress.config.js'),
    config: { baseUrl: needsUI ? UI_URL : API_URL, excludeSpecPattern: mode === 'dashboard' ? [] : '**/dashboard.phase2.cy.js' },
    env: { apiUrl: API_URL, remoteApi: 'https://garagemanagement-wip3.onrender.com' } };
  if (mode === 'open') {
    await cypress.open(options);
  } else {
    const results = await cypress.run({ ...options, spec: SPECS[mode] });
    if (results.failures !== undefined) throw new Error(results.message || 'Cypress không khởi động được. Chạy npm run setup.');
    writeResults(results, mode);
    if (results.totalTests !== COUNTS[mode]) throw new Error(`Số test sai: cần ${COUNTS[mode]}, thực chạy ${results.totalTests}. Xem báo cáo và npm run check.`);
    process.exitCode = results.totalFailed || results.totalPending || results.totalSkipped ? 1 : 0;
  }
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => { cleanup().finally(() => process.exit(130)); });
}
main().catch(error => { console.error(`\n${error.message}`); process.exitCode = 1; }).finally(cleanup);
