// F01 – Đăng nhập qua giao diện. API được chuyển về backend local bằng cy.useLocalApi().
describe('F01 – Đăng nhập (E2E)', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.useLocalApi();
  });

  it('TC-AUTH-20 – Đăng nhập qua giao diện', () => {
    // Lần 1: đúng mật khẩu → vào Dashboard, hiện tên Quản lý
    cy.visit('/');
    cy.get('#login-username').type('admin');
    cy.get('#login-password').type('admin123');
    cy.get('#login-btn').click();
    cy.wait('@api').its('request.url').should('contain', Cypress.env('apiUrl'));
    cy.get('#app').should('have.class', 'visible');
    cy.get('#page-dashboard').should('have.class', 'active');
    cy.get('#user-display-name').should('have.text', 'Quản lý');

    // Lần 2: sai mật khẩu → #login-error hiển thị, vẫn ở trang đăng nhập
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('#login-username').type('admin');
    cy.get('#login-password').type('sai');
    cy.get('#login-btn').click();
    cy.get('#login-error').should('have.class', 'show').and('not.be.empty');
    cy.get('#login-page').should('be.visible');
    cy.get('#app').should('not.have.class', 'visible');
  });
});
