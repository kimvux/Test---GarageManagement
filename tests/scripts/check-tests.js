'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ROOT } = require('./environment');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith('.js') ? [file] : [];
  });
}
function check() {
  const files = [path.join(ROOT, 'cypress.config.js'), ...walk(path.join(ROOT, 'cypress')), ...walk(path.join(ROOT, 'scripts'))];
  let count = 0;
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    new vm.Script(source, { filename: path.relative(ROOT, file) });
    if (!file.endsWith('.cy.js')) continue;
    if (/\b(?:it|describe)\.(?:only|skip)\s*\(/.test(source)) throw new Error(`Không dùng .only/.skip: ${file}`);
    if (/apiTestRequest|apiTestLogin|runApiReads|allowApiWrites|liveUi/.test(source)) throw new Error(`Còn cấu hình test cũ: ${file}`);
    if (/req\.reply\s*\(|fixture\s*:|forceNetworkError\s*:/.test(source)) throw new Error(`Không giả lập API: ${file}`);
    if (file.includes(`${path.sep}ui${path.sep}`) && !source.includes('cy.useLocalApi()')) throw new Error(`Thiếu useLocalApi: ${file}`);
    for (const match of source.matchAll(/\bit\(\s*(['"`])([^'"`]+)\1/g)) {
      if (!/^TC-[A-Z]+-(?:SRS-)?\d{2}\s+–/.test(match[2])) throw new Error(`Thiếu mã TC: ${match[2]}`);
      count++;
    }
  }
  console.log(`Kiểm tra cú pháp đạt: ${files.length} file JavaScript; ${count} tiêu đề test tĩnh hợp lệ.`);
  return count;
}
module.exports = { check };
if (require.main === module) {
  try { check(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
