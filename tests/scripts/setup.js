'use strict';

const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { ROOT, loadTestEnv } = require('./environment');

function run(script, args, cwd = ROOT) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd, stdio: 'inherit' });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || `Cài đặt dừng với mã ${result.status}.`);
}

try {
  if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Cần Node.js 22 trở lên.');
  loadTestEnv();
  if (!process.env.npm_execpath) throw new Error('Chạy bằng npm run setup.');
  run(process.env.npm_execpath, ['ci'], path.resolve(ROOT, '../backend'));
  const cli = path.join(path.dirname(require.resolve('cypress/package.json')), 'bin/cypress');
  run(cli, ['install']);
  run(cli, ['verify']);
  console.log('Cài đặt xong. Mở Docker Desktop rồi chạy npm test tại tests/.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
