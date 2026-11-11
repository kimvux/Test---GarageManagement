'use strict';

const { spawnSync } = require('node:child_process');
const { Client } = require('pg');
const { setTimeout: delay } = require('node:timers/promises');
const { loadTestEnv } = require('./environment');
const CONTAINER = 'autogara-test';

function docker(args, optional = false) {
  const result = spawnSync('docker', args, { encoding: 'utf8', windowsHide: true });
  if (!optional && (result.error || result.status !== 0)) {
    throw new Error(`Docker chưa sẵn sàng. Mở Docker Desktop rồi chạy lại.\n${result.error?.message || result.stderr || result.stdout}`);
  }
  return result;
}

async function waitDatabase(databaseUrl) {
  let lastError;
  for (let i = 0; i < 60; i++) {
    const client = new Client({ connectionString: databaseUrl, connectionTimeoutMillis: 1000 });
    try {
      await client.connect();
      await client.query('SELECT 1');
      return;
    } catch (error) { lastError = error; }
    finally { await client.end().catch(() => {}); }
    await delay(500);
  }
  throw new Error(`Không kết nối được autogara_test:5433. ${lastError?.message}`);
}

async function up() {
  const env = loadTestEnv();
  docker(['info', '--format', '{{.ServerVersion}}']);
  const existing = docker(['inspect', '--type', 'container', CONTAINER], true);
  if (existing.status === 0) {
    const info = JSON.parse(existing.stdout)[0];
    const binding = info.HostConfig.PortBindings?.['5432/tcp'];
    if (info.Config.Image !== 'postgres:16' ||
        !info.Config.Env.includes('POSTGRES_DB=autogara_test') ||
        !info.Config.Env.includes('POSTGRES_PASSWORD=postgres') ||
        !binding?.some(p => p.HostPort === '5433')) {
      throw new Error('Container autogara-test hiện có khác cấu hình yêu cầu (postgres:16, autogara_test, cổng 5433). Không tự xóa dữ liệu.');
    }
    if (!info.State.Running) docker(['start', CONTAINER]);
  } else {
    docker(['run', '--name', CONTAINER, '-e', 'POSTGRES_PASSWORD=postgres', '-e', 'POSTGRES_DB=autogara_test',
      '-p', '127.0.0.1:5433:5432', '-d', 'postgres:16']);
  }
  await waitDatabase(env.DATABASE_URL);
  console.log('PostgreSQL test sẵn sàng: localhost:5433/autogara_test');
}

module.exports = { up, waitDatabase };
if (require.main === module) {
  const action = process.argv[2];
  if (action === 'stop') {
    try { docker(['stop', CONTAINER]); } catch (error) { console.error(error.message); process.exitCode = 1; }
  } else if (action === 'up') {
    up().catch(error => { console.error(error.message); process.exitCode = 1; });
  } else { console.error('Dùng npm run db:up hoặc npm run db:stop.'); process.exitCode = 1; }
}
