// Các truy vấn chỉ đọc dùng để xác minh tác động thực tế trong PostgreSQL test.
function expectStock(id, quantity) {
  return cy.task('db:query', { sql: 'SELECT stock_qty FROM parts WHERE id=$1', params: [id] }).then(rows => {
    expect(rows, `P${id} tồn tại`).to.have.length(1);
    expect(rows[0].stock_qty, `tồn kho P${id}`).to.eq(quantity);
  });
}
function expectOrder(id, status, total) {
  return cy.task('db:query', { sql: 'SELECT status, total_amount FROM repair_orders WHERE id=$1', params: [id] }).then(rows => {
    expect(rows, `O${id} tồn tại`).to.have.length(1);
    if (status !== undefined) expect(rows[0].status, `trạng thái O${id}`).to.eq(status);
    if (total !== undefined) expect(Number(rows[0].total_amount), `tổng tiền O${id}`).to.eq(total);
  });
}
function expectCount(table, count, where = '', params = []) {
  const allowed = ['parts', 'repair_orders', 'order_parts', 'order_services', 'invoices'];
  if (!allowed.includes(table)) throw new Error(`Bảng không được hỗ trợ: ${table}`);
  return cy.task('db:query', { sql: `SELECT COUNT(*)::int AS n FROM ${table} ${where}`, params }).then(rows => {
    expect(rows[0].n, `số bản ghi ${table} ${where}`).to.eq(count);
  });
}
function expectRejected(response) {
  expect(response.status, 'dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx').to.be.within(400, 499);
  expect(response.body.error, 'thông báo lỗi').to.be.a('string').and.not.be.empty;
}
module.exports = { expectStock, expectOrder, expectCount, expectRejected };
