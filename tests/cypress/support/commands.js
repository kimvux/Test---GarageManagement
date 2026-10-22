const ACCOUNTS = {
  quan_ly: { username: 'admin', password: 'admin123' },
  nhan_vien_le_tan: { username: 'letan1', password: 'letan123' },
};

// Gọi API backend local. Không tự fail theo mã trạng thái để test tự kiểm tra 4xx/5xx.
Cypress.Commands.add('api', (method, url, body, token) => {
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
    return res.body.token;
  });
});

// Chuyển mọi request frontend gửi tới Render về backend local. Gọi trong beforeEach của test UI.
Cypress.Commands.add('useLocalApi', () => {
  const remote = Cypress.env('remoteApi');
  const local = Cypress.env('apiUrl');
  cy.intercept({ url: `${remote}/**` }, req => {
    req.url = req.url.replace(remote, local);
  }).as('api');
});
