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
function range(group, count, omit = []) {
  return Array.from({ length: count }, (_, i) => i + 1).filter(n => !omit.includes(n))
    .map(n => `TC-${group}-${String(n).padStart(2, '0')}`);
}
// Danh mục đúng 82 mã từ Test Case.xlsx.pdf, gồm 77 API + 5 E2E.
const EXPECTED = {
  'api/auth.cy.js': range('AUTH', 19),
  'api/orders.cy.js': range('ORD', 21),
  'api/parts.cy.js': range('PRT', 22),
  'api/invoices.cy.js': range('INV', 18, [12, 17, 18]),
  'ui/login.cy.js': ['TC-AUTH-20'],
  'ui/orders.cy.js': ['TC-ORD-22'],
  'ui/invoices.cy.js': ['TC-INV-12', 'TC-INV-17', 'TC-INV-18'],
  'ui/dashboard.phase2.cy.js': range('DASH', 5),
};
function check() {
  const files = [path.join(ROOT, 'cypress.config.js'), ...walk(path.join(ROOT, 'cypress')), ...walk(path.join(ROOT, 'scripts'))];
  const found = new Set();
  const ids = new Set();
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const script = new vm.Script(source, { filename: path.relative(ROOT, file) });
    if (!file.endsWith('.cy.js')) continue;
    const relative = path.relative(path.join(ROOT, 'cypress/e2e'), file).split(path.sep).join('/');
    if (!EXPECTED[relative]) throw new Error(`Spec chưa có ánh xạ Test Case: ${relative}`);
    found.add(relative);
    if (/\b(?:it|describe|context|specify)\.(?:only|skip)\s*\(/.test(source)) throw new Error(`Không dùng .only/.skip: ${file}`);
    if (/apiTestRequest|apiTestLogin|runApiReads|allowApiWrites|liveUi/.test(source)) throw new Error(`Còn cấu hình test cũ: ${file}`);
    if (/req\.reply\s*\(|fixture\s*:|forceNetworkError\s*:/.test(source)) throw new Error(`Không giả lập API: ${file}`);
    if (!source.includes("cy.task('db:seed')")) throw new Error(`Thiếu db:seed: ${file}`);
    if (relative.startsWith('ui/') && !source.includes('cy.useLocalApi()')) throw new Error(`Thiếu useLocalApi: ${file}`);
    const actual = [];
    // Chỉ đăng ký test để thu thập tiêu đề; không chạy hook hoặc thân test, không cần Cypress binary.
    const register = (title, fn) => {
      if (typeof fn !== 'function') throw new Error(`Test chưa có nội dung: ${title}`);
      const match = String(title).match(/^(TC-[A-Z]+-\d{2})\s+–\s+.+/);
      if (!match) throw new Error(`Tiêu đề không hợp lệ: ${title}`);
      if (ids.has(match[1])) throw new Error(`Mã TC bị trùng: ${match[1]}`);
      ids.add(match[1]);
      actual.push(match[1]);
    };
    script.runInNewContext({
      describe: (_title, fn) => fn(), it: register,
      beforeEach: () => {}, afterEach: () => {}, before: () => {}, after: () => {},
      require: request => {
        if (request !== '../../support/assertions') throw new Error(`Import cần kiểm tra thủ công: ${request}`);
        return require(path.join(ROOT, 'cypress/support/assertions'));
      },
    }, { timeout: 1000 });
    if (actual.slice().sort().join(',') !== EXPECTED[relative].slice().sort().join(',')) {
      throw new Error(`Sai ánh xạ ${relative}. Mong đợi ${EXPECTED[relative].join(', ')}; có ${actual.join(', ')}.`);
    }
  }
  for (const spec of Object.keys(EXPECTED)) {
    if (!found.has(spec)) throw new Error(`Thiếu spec: ${spec}`);
  }
  console.log(`Kiểm tra đạt: ${files.length} file JavaScript; đúng 82 mã PDF (77 API + 5 UI), không thiếu/trùng; 5 ca dashboard riêng.`);
  return ids.size;
}
module.exports = { check };
if (require.main === module) {
  try { check(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
