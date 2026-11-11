'use strict';

const path = require('node:path');
const { spawn } = require('node:child_process');
const { ROOT, loadTestEnv } = require('./environment');

function startBackend(coverage = false) {
  const server = path.resolve(ROOT, '../backend/server.js');
  const args = ['-r', path.join(ROOT, 'scripts/exit-on-signal.js'), server];
  if (coverage) args.unshift(require.resolve('c8/bin/c8.js'), '--reporter=html', '--reporter=text',
    '--allowExternal', '--include=**/backend/server.js', '--reports-dir', path.join(ROOT, 'coverage'), process.execPath);
  return spawn(process.execPath, args, {
    cwd: ROOT, env: { ...process.env, ...loadTestEnv() }, stdio: 'inherit',
  });
}

module.exports = { startBackend };
if (require.main === module) {
  const child = startBackend(process.argv.includes('--coverage'));
  child.on('error', error => { console.error(error.message); process.exitCode = 1; });
  child.on('exit', code => { process.exitCode = code ?? 1; });
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}
