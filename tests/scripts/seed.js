// Reset CSDL test và nạp dữ liệu theo mục 5 của HANDOFF_KIEM_THU_AUTOGARA.md.
// Chèn đúng thứ tự, không ghi id, để id khớp ký hiệu (C1 = 1, O3 = 3...).
// Dùng được theo 2 cách: `node --env-file=.env.test scripts/seed.js` hoặc task `db:seed` của Cypress.
'use strict';

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const TABLES = [
  'invoices', 'order_parts', 'order_services', 'appointments', 'repair_orders',
  'parts', 'services', 'vehicles', 'customers', 'users',
];

async function seed(databaseUrl = process.env.DATABASE_URL) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const { rows } = await client.query(
      `SELECT COUNT(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1)`,
      [TABLES]
    );
    if (rows[0].n < TABLES.length) {
      throw new Error('Chưa có bảng. Hãy khởi động backend ít nhất một lần để initDB() tạo bảng.');
    }

    await client.query('BEGIN');
    await client.query(`TRUNCATE ${TABLES.join(', ')} RESTART IDENTITY CASCADE`);

    const adminHash = await bcrypt.hash('admin123', 10);
    const letanHash = await bcrypt.hash('letan123', 10);
    await client.query(
      `INSERT INTO users (username, password, full_name, role) VALUES
         ('admin',  $1, 'Quản lý',  'quan_ly'),
         ('letan1', $2, 'Lễ tân 1', 'nhan_vien_le_tan')`,
      [adminHash, letanHash]
    );

    await client.query(`INSERT INTO customers (name, phone) VALUES
      ('Nguyễn Văn A', '0901234567'),
      ('Trần Thị B',   '0912345678')`);

    await client.query(`INSERT INTO vehicles (customer_id, plate, brand, model) VALUES
      (1, '51A-123.45', 'Toyota', 'Vios'),
      (2, '59B-678.90', 'Honda',  'City')`);

    await client.query(`INSERT INTO services (name, price, active) VALUES
      ('Thay dầu', 200000, TRUE),
      ('Rửa xe',    50000, TRUE),
      ('Sơn dặm',  300000, FALSE)`);

    await client.query(`INSERT INTO parts (name, price, stock_qty, min_stock) VALUES
      ('Lọc dầu',   150000, 10, 5),
      ('Má phanh',  400000,  5, 5),
      ('Bugi',       80000,  0, 3),
      ('Dầu nhớt',  120000,  6, 5)`);

    // O3 có hoá đơn: dùng S2 × 1 (50.000) để hoá đơn có nội dung; không ảnh hưởng tồn kho.
    await client.query(`INSERT INTO repair_orders (customer_id, vehicle_id, status, total_amount) VALUES
      (1, 1, 'tiep_nhan',      0),
      (1, 1, 'hoan_thanh',     500000),
      (2, 2, 'da_thanh_toan',  50000),
      (2, 2, 'huy',            0),
      (2, 2, 'dang_sua',       400000)`);

    await client.query(`INSERT INTO order_services (order_id, service_id, qty, price_at_time) VALUES
      (2, 1, 1, 200000),
      (3, 2, 1,  50000)`);

    await client.query(`INSERT INTO order_parts (order_id, part_id, qty, price_at_time) VALUES
      (2, 1, 2, 150000),
      (5, 2, 1, 400000)`);

    await client.query(`INSERT INTO invoices (repair_order_id, service_total, parts_total, discount, total, payment_method, created_by)
      VALUES (3, 50000, 0, 0, 50000, 'tien_mat', 1)`);

    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    await client.end();
  }
}

module.exports = { seed };

if (require.main === module) {
  seed()
    .then(() => console.log('✅ Seed xong'))
    .catch(e => { console.error('❌ Seed lỗi:', e.message); process.exit(1); });
}
