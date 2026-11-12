const ACCOUNTS = {
  quan_ly: { username: 'admin', password: 'admin123' },
  nhan_vien_le_tan: { username: 'letan1', password: 'letan123' },
};

// Gọi API backend local. Không tự fail theo mã trạng thái để test tự kiểm tra 4xx/5xx.
Cypress.Commands.add('api', (method, url, body, token) => {
  if (!url.startsWith('/api/')) throw new Error('cy.api chỉ nhận đường dẫn /api/... của backend local.');
  return cy.request({
    method,
    url: Cypress.env('apiUrl') + url,
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    failOnStatusCode: false,
  });
});

// Đăng nhập qua API, trả về token. role: 'quan_ly' | 'nhan_vien_le_tan'.
Cypress.Commands.add('apiLogin', (role = 'quan_ly') => {
  const acc = ACCOUNTS[role];
  if (!acc) throw new Error(`Vai trò không hỗ trợ: ${role}`);
  return cy.api('POST', '/api/auth/login', acc).then(res => {
    expect(res.status, 'đăng nhập seed').to.eq(200);
    expect(res.body.token, 'JWT seed').to.be.a('string').and.not.be.empty;
    return res.body.token;
  });
});

// Chuyển mọi request frontend gửi tới Render về backend local. Gọi trong beforeEach của test UI.
Cypress.Commands.add('useLocalApi', () => {
  const remote = Cypress.env('remoteApi');
  const local = Cypress.env('apiUrl');
  return cy.intercept({ url: `${remote}/**` }, req => {
    req.url = req.url.replace(remote, local);
    // Chuyển tiếp đến Express thật; không trả response giả.
    const pathname = new URL(req.url).pathname;
    if (req.method === 'POST' && pathname === '/api/auth/login') req.alias = 'localLogin';
    if (req.method === 'GET' && pathname === '/api/reports/dashboard') req.alias = 'localDashboard';
    if (req.method === 'GET' && pathname === '/api/customers') req.alias = 'localCustomers';
    if (req.method === 'GET' && pathname === '/api/services') req.alias = 'localServices';
    if (req.method === 'GET' && pathname === '/api/parts') req.alias = 'localParts';
    if (req.method === 'GET' && pathname === '/api/users') req.alias = 'localUsers';
  }).as('api');
});

Cypress.Commands.add('loginLocal', (role = 'quan_ly') => {
  const account = ACCOUNTS[role];
  if (!account) throw new Error(`Vai trò không hỗ trợ: ${role}`);
  return cy.api('POST', '/api/auth/login', account).then(res => {
    expect(res.status, 'đăng nhập seed cho UI').to.eq(200);
    cy.visit('/', { onBeforeLoad(win) {
      win.localStorage.setItem('autocare_token', res.body.token);
      win.localStorage.setItem('autocare_user', JSON.stringify(res.body.user));
    } });
    cy.wait('@localDashboard').its('response.statusCode').should('eq', 200);
    cy.wait(['@localCustomers', '@localServices', '@localParts', '@localUsers']);
    cy.get('#app').should('have.class', 'visible');
  });
});
