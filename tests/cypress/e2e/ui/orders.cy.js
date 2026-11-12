const { expectOrder, expectCount } = require('../../support/assertions');

describe('P1 – Phiếu sửa chữa (giao diện và backend thật)', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.useLocalApi();
    cy.loginLocal('nhan_vien_le_tan');
    cy.get('.nav-item[data-page="repair-orders"]').click();
    cy.contains('#order-table tr', 'PS0001').should('be.visible');
  });

  it('TC-ORD-22 – Luồng tạo phiếu và đổi trạng thái qua giao diện', () => {
    cy.contains('#page-repair-orders button', 'Tạo phiếu').click();
    cy.get('#ro-customer-id').select('1');
    cy.get('#ro-vehicle-id option[value="1"]').should('contain', '51A-123.45');
    cy.get('#ro-vehicle-id').select('1');
    cy.get('#ro-condition').type('Xe kêu khi phanh');
    cy.contains('#modal-repair-order button', 'Tạo phiếu').click();
    cy.get('#modal-order-detail').should('have.class', 'open');
    cy.get('#order-detail-title').should('contain', 'PS0006').and('contain', '51A-123.45');
    cy.get('#order-detail-body .badge').should('contain', 'Tiếp nhận');
    expectOrder(6, 'tiep_nhan', 0);
    expectCount('repair_orders', 6);

    cy.get('#od-status-sel').select('dang_sua');
    cy.contains('#order-detail-body button', 'Cập nhật').click();
    cy.get('#order-detail-body .badge').should('contain', 'Đang sửa');
    cy.get('#od-status-sel').should('have.value', 'dang_sua');
    cy.contains('#order-table tr', 'PS0006').should('contain', 'Đang sửa');

    cy.contains('#order-detail-body .card', 'Dịch vụ sử dụng').contains('button', 'Thêm').click();
    cy.get('#add-svc-id').select('1');
    cy.get('#add-svc-qty').clear().type('1');
    cy.get('#quick-ok').click();
    cy.contains('#order-detail-body tbody tr', 'Thay dầu').should('contain', '200.000 đ');
    cy.get('#order-detail-body .invoice-total-row.grand').should('contain', '200.000 đ');
    expectOrder(6, 'dang_sua', 200000);
    expectCount('order_services', 1, 'WHERE order_id=6 AND service_id=1 AND qty=1');
  });
});
