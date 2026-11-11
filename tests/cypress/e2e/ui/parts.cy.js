const { expectStock } = require('../../support/assertions');

describe('P1 – Nhập kho (giao diện và backend thật)', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.useLocalApi();
    cy.loginLocal();
    cy.get('.nav-item[data-page="parts"]').click();
    cy.contains('#part-table tr', 'Lọc dầu').should('be.visible');
  });

  it('TC-PRT-13 – Nhập thêm 5 P1 qua giao diện, tồn kho thành 15', () => {
    cy.contains('#part-table tr', 'Lọc dầu').contains('button', 'Nhập').click();
    cy.get('#restock-qty').type('5');
    cy.contains('#modal-restock button', 'Nhập kho').click();
    cy.get('#modal-restock').should('not.have.class', 'open');
    cy.contains('#part-table tr', 'Lọc dầu').find('td').eq(4).should('have.text', '15');
    expectStock(1, 15);
  });

  it('TC-PRT-14 – Nhập 0 qua giao diện báo lỗi, tồn kho không đổi', () => {
    cy.contains('#part-table tr', 'Lọc dầu').contains('button', 'Nhập').click();
    cy.get('#restock-qty').type('0');
    cy.contains('#modal-restock button', 'Nhập kho').click();
    cy.contains('#toast-container .toast.error', 'Số lượng không hợp lệ').should('be.visible');
    cy.get('#modal-restock').should('have.class', 'open');
    expectStock(1, 10);
  });

  it('TC-PRT-10 – Hiển thị trạng thái theo từng ngưỡng tồn kho', () => {
    cy.contains('#part-table tr', 'Lọc dầu').should('contain', 'Còn hàng');
    cy.contains('#part-table tr', 'Má phanh').should('contain', 'Sắp hết');
    cy.contains('#part-table tr', 'Bugi').should('contain', 'Hết hàng');
    cy.contains('#part-table tr', 'Dầu nhớt').should('contain', 'Còn hàng');
  });
});
