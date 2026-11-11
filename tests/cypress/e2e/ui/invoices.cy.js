const { expectStock, expectOrder, expectCount } = require('../../support/assertions');

function openInvoice() {
  cy.get('.nav-item[data-page="repair-orders"]').click();
  cy.contains('#order-table tr', 'PS0002').contains('button', 'HĐ').click();
  cy.get('#modal-invoice').should('have.class', 'open');
  cy.get('#inv-order-id').should('have.value', '2');
}

describe('P1 – Hóa đơn (giao diện và backend thật)', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.useLocalApi();
    cy.loginLocal();
  });

  it('TC-INV-02 – Lập hóa đơn giảm 50000, thu 450000 qua giao diện', () => {
    openInvoice();
    cy.get('#inv-svc-total').should('contain', '200.000');
    cy.get('#inv-parts-total').should('contain', '300.000');
    cy.get('#inv-discount').clear().type('50000').blur();
    cy.get('#inv-grand-total').should('contain', '450.000');
    cy.get('#inv-payment').select('chuyen_khoan');
    cy.contains('#modal-invoice button', 'Xuất hóa đơn').click();
    cy.get('#modal-invoice').should('not.have.class', 'open');
    cy.contains('#toast-container .toast.success', '450.000').should('be.visible');
    expectOrder(2, 'da_thanh_toan', 500000);
    expectStock(1, 10);
    expectCount('invoices', 2);
    cy.task('db:query', { sql: 'SELECT total, discount, payment_method FROM invoices WHERE repair_order_id=2' }).then(rows => {
      expect(rows).to.have.length(1);
      expect(Number(rows[0].total)).to.eq(450000);
      expect(Number(rows[0].discount)).to.eq(50000);
      expect(rows[0].payment_method).to.eq('chuyen_khoan');
    });
  });

  it('TC-INV-13 – Xem hóa đơn seed qua giao diện', () => {
    cy.get('.nav-item[data-page="invoices"]').click();
    cy.contains('#invoice-table tr', 'HĐ0001').should('contain', '50.000').click();
    cy.get('#modal-invoice-detail').should('have.class', 'open');
    cy.get('#inv-detail-title').should('contain', 'HĐ0001');
    cy.get('#inv-detail-body').should('contain', 'Trần Thị B').and('contain', 'Rửa xe').and('contain', '50.000');
  });

  it('TC-INV-17 – Giao diện phải có phương thức thanh toán Thẻ theo SRS', () => {
    openInvoice();
    cy.get('#inv-payment option').then(options => {
      expect(Array.from(options, option => option.value), '3 phương thức theo SRS').to.include.members(['tien_mat', 'chuyen_khoan', 'the']);
    });
  });
});
