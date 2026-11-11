const { expectStock, expectOrder, expectCount } = require('../../support/assertions');

describe('P1 – Phiếu sửa chữa (giao diện và backend thật)', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.useLocalApi();
    cy.loginLocal();
    cy.get('.nav-item[data-page="repair-orders"]').click();
    cy.contains('#order-table tr', 'PS0001').should('be.visible');
  });

  it('TC-ORD-01 – Tạo phiếu cho C1 và V1 qua giao diện', () => {
    cy.contains('#page-repair-orders button', 'Tạo phiếu').click();
    cy.get('#ro-customer-id').select('1');
    cy.get('#ro-vehicle-id option[value="1"]').should('exist');
    cy.get('#ro-vehicle-id').select('1');
    cy.get('#ro-condition').type('Xe rung khi chạy');
    cy.get('#ro-note').type('Kiểm tra phanh');
    cy.contains('#modal-repair-order button', 'Tạo phiếu').click();
    cy.get('#modal-order-detail').should('have.class', 'open');
    cy.get('#order-detail-title').should('contain', 'PS0006');
    cy.get('#order-detail-body').should('contain', 'Xe rung khi chạy');
    expectOrder(6, 'tiep_nhan', 0);
    expectCount('repair_orders', 6);
  });

  it('TC-ORD-07 – Thêm P1 nhân 2 qua giao diện, tồn kho còn 8', () => {
    cy.contains('#order-table tr', 'PS0001').click();
    cy.get('#modal-order-detail').should('have.class', 'open');
    cy.contains('#order-detail-body .card', 'Phụ tùng sử dụng').contains('button', 'Thêm').click();
    cy.get('#add-part-id').select('1');
    cy.get('#add-part-qty').clear().type('2');
    cy.get('#quick-ok').click();
    cy.contains('#order-detail-body tbody tr', 'Lọc dầu').should('contain', '300.000');
    expectStock(1, 8);
    expectOrder(1, 'tiep_nhan', 300000);
  });

  it('TC-ORD-09 – Xóa phụ tùng O2 qua giao diện và hoàn kho', () => {
    cy.on('window:confirm', () => true);
    cy.contains('#order-table tr', 'PS0002').click();
    cy.contains('#order-detail-body tbody tr', 'Lọc dầu').find('button').click();
    cy.get('#order-detail-body').should('contain', 'Chưa có phụ tùng');
    expectStock(1, 12);
    expectOrder(2, 'hoan_thanh', 200000);
  });
});
