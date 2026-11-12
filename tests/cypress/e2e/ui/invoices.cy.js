// Đối chiếu TC-INV-12/17/18 trong Test Case.xlsx.pdf; dùng backend local thật.
const { expectStock, expectOrder, expectCount } = require('../../support/assertions');

function openOrder(id) {
  cy.contains('#order-table tr', `PS${String(id).padStart(4, '0')}`).click();
  cy.get('#modal-order-detail').should('have.class', 'open');
  cy.get('#order-detail-title').should('contain', `PS${String(id).padStart(4, '0')}`);
}

function openInvoice() {
  openOrder(2);
  cy.contains('#order-detail-body button', 'Lập hóa đơn').click();
  cy.get('#modal-invoice').should('have.class', 'open');
  cy.get('#inv-order-id').should('have.value', '2');
}

describe('P1 – Hóa đơn (giao diện và backend thật)', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.useLocalApi();
    cy.loginLocal('nhan_vien_le_tan');
    cy.get('.nav-item[data-page="repair-orders"]').click();
    cy.contains('#order-table tr', 'PS0002').should('be.visible');
  });

  it('TC-INV-12 – Giao diện có đủ Tiền mặt, Chuyển khoản và Thẻ', () => {
    openInvoice();
    cy.get('#inv-payment option').should(options => {
      expect(options, 'đủ ba phương thức theo SRS').to.have.length(3);
      const labels = Array.from(options, option => option.textContent).join(' ');
      expect(labels).to.include('Tiền mặt').and.include('Chuyển khoản').and.include('Thẻ');
    });
  });

  it('TC-INV-17 – Giảm 100000 qua giao diện, thu 400000 và hiện Đã thanh toán', () => {
    openInvoice();
    cy.get('#inv-svc-total').should('contain', '200.000');
    cy.get('#inv-parts-total').should('contain', '300.000');
    cy.get('#inv-discount').clear().type('100000').blur();
    cy.get('#inv-grand-total').should('contain', '400.000');
    cy.contains('#modal-invoice button', 'Xuất hóa đơn').click();
    cy.get('#modal-invoice').should('not.have.class', 'open');
    cy.contains('#toast-container .toast.success', '400.000').should('be.visible');
    cy.contains('#order-table tr', 'PS0002').should('contain', 'Đã thanh toán');
    expectOrder(2, 'da_thanh_toan', 500000);
    expectStock(1, 10);
    expectCount('invoices', 2);
    cy.task('db:query', {
      sql: 'SELECT total, discount, payment_method, created_by FROM invoices WHERE repair_order_id=$1',
      params: [2],
    }).then(rows => {
      expect(rows).to.have.length(1);
      expect(Number(rows[0].total)).to.eq(400000);
      expect(Number(rows[0].discount)).to.eq(100000);
      expect(rows[0].payment_method).to.eq('tien_mat');
      expect(rows[0].created_by).to.eq(2);
    });
  });

  it('TC-INV-18 – Chỉ phiếu Hoàn thành mới có nút Lập hóa đơn', () => {
    for (const id of [1, 5]) {
      openOrder(id);
      cy.get('#order-detail-body button[onclick^="openInvoiceModal("]').should('not.exist');
      cy.get('#modal-order-detail .btn-close').click();
      cy.get('#modal-order-detail').should('not.have.class', 'open');
    }
    openOrder(2);
    cy.contains('#order-detail-body button', 'Lập hóa đơn').should('be.visible');
  });
});
