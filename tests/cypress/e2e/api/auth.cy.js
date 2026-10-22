// F01 – Xác thực và phân quyền (API). Kết quả mong đợi theo SRS / file Test Case, không theo code.
const LOGIN_FAIL = 'Sai tên đăng nhập hoặc mật khẩu';
const NEW_STAFF = { username: 'nv_moi', password: '123456', full_name: 'NV Mới' };

describe('F01 – Xác thực (API)', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-AUTH-01 – Đăng nhập thành công với tài khoản Quản lý', () => {
    cy.api('POST', '/api/auth/login', { username: 'admin', password: 'admin123' }).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.token).to.be.a('string').and.not.be.empty;
      expect(res.body.user.role).to.eq('quan_ly');
    });
  });

  it('TC-AUTH-02 – Sai mật khẩu', () => {
    cy.api('POST', '/api/auth/login', { username: 'admin', password: 'sai123' }).then(res => {
      expect(res.status).to.eq(401);
      expect(res.body.error).to.eq(LOGIN_FAIL);
      expect(res.body).not.to.have.property('token');
    });
  });

  it('TC-AUTH-03 – Tên đăng nhập không tồn tại, thông báo không lộ thông tin', () => {
    cy.api('POST', '/api/auth/login', { username: 'khongton', password: 'admin123' }).then(res => {
      expect(res.status).to.eq(401);
      expect(res.body.error).to.eq(LOGIN_FAIL);
      expect(res.body).not.to.have.property('token');
    });
  });

  it('TC-AUTH-04 – Thiếu username', () => {
    cy.api('POST', '/api/auth/login', { password: 'admin123' }).then(res => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Thiếu thông tin');
    });
  });

  it('TC-AUTH-05 – Thiếu password', () => {
    cy.api('POST', '/api/auth/login', { username: 'admin' }).then(res => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Thiếu thông tin');
    });
  });

  it('TC-AUTH-06 – Username khác chữ hoa/thường', () => {
    cy.api('POST', '/api/auth/login', { username: 'ADMIN', password: 'admin123' }).then(res => {
      expect(res.status).to.eq(401);
    });
  });

  it('TC-AUTH-07 – Mật khẩu được lưu dạng băm bcrypt', () => {
    cy.task('db:query', { sql: `SELECT password FROM users WHERE username = 'admin'` }).then(rows => {
      expect(rows).to.have.length(1);
      expect(rows[0].password).to.match(/^\$2[ab]\$/);
      expect(rows[0].password).not.to.eq('admin123');
    });
  });

  it('TC-AUTH-08 – Gọi API không có header Authorization', () => {
    cy.api('GET', '/api/repair-orders').then(res => {
      expect(res.status).to.eq(401);
      expect(res.body.error).to.eq('Chưa đăng nhập');
    });
  });

  it('TC-AUTH-09 – Token sai chữ ký', () => {
    cy.api('GET', '/api/repair-orders', null, 'abc.def.ghi').then(res => {
      expect(res.status).to.eq(401);
      expect(res.body.error).to.eq('Token không hợp lệ');
    });
  });

  it('TC-AUTH-10 – Header thiếu tiền tố Bearer', () => {
    cy.apiLogin('quan_ly').then(token => {
      cy.request({
        method: 'GET',
        url: Cypress.env('apiUrl') + '/api/repair-orders',
        headers: { Authorization: token },
        failOnStatusCode: false,
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq('Chưa đăng nhập');
      });
    });
  });

  it('TC-AUTH-11 – Thời hạn token đúng 12 giờ theo SRS', () => {
    cy.apiLogin('quan_ly').then(token => {
      cy.task('jwt:decode', token).then(payload => {
        expect(payload.exp - payload.iat, 'exp − iat (giây)').to.eq(43200);
      });
    });
  });

  it('TC-AUTH-12 – Token đã hết hạn bị từ chối', () => {
    cy.task('jwt:sign', { payload: { id: 1, username: 'admin', role: 'quan_ly' }, expiresIn: -1 }).then(token => {
      cy.api('GET', '/api/repair-orders', null, token).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq('Token không hợp lệ');
      });
    });
  });
});

describe('F01 – Phân quyền (API, bảng quyết định)', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-AUTH-13 – Quy tắc R1: Lễ tân thêm nhân viên', () => {
    cy.apiLogin('nhan_vien_le_tan').then(token => {
      cy.api('POST', '/api/users', NEW_STAFF, token).then(res => {
        expect(res.status).to.eq(403);
        expect(res.body.error).to.eq('Không có quyền');
      });
    });
  });

  it('TC-AUTH-14 – Quy tắc R2: Quản lý thêm nhân viên', () => {
    cy.apiLogin('quan_ly').then(token => {
      cy.api('POST', '/api/users', NEW_STAFF, token).then(res => {
        expect(res.status).to.eq(200);
      });
      cy.api('GET', '/api/users', null, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.map(u => u.username)).to.include('nv_moi');
      });
    });
  });

  it('TC-AUTH-15 – Quy tắc R3: Lễ tân thêm dịch vụ', () => {
    cy.apiLogin('nhan_vien_le_tan').then(token => {
      cy.api('POST', '/api/services', { name: 'Kiểm tra phanh', price: 100000 }, token).then(res => {
        expect(res.status).to.eq(403);
      });
    });
  });

  it('TC-AUTH-16 – Quy tắc R4: Lễ tân thêm phụ tùng vào kho', () => {
    cy.apiLogin('nhan_vien_le_tan').then(token => {
      cy.api('POST', '/api/parts', { name: 'Gạt mưa', price: 90000 }, token).then(res => {
        expect(res.status).to.eq(403);
      });
    });
  });

  it('TC-AUTH-17 – Quy tắc R5: Lễ tân nhập kho', () => {
    cy.apiLogin('nhan_vien_le_tan').then(token => {
      cy.api('POST', '/api/parts/1/restock', { qty: 5 }, token).then(res => {
        expect(res.status).to.eq(403);
      });
    });
  });

  it('TC-AUTH-18 – Quy tắc R6: Lễ tân xem danh sách nhân viên', () => {
    cy.apiLogin('nhan_vien_le_tan').then(token => {
      cy.api('GET', '/api/users', null, token).then(res => {
        expect(res.status).to.eq(403);
      });
    });
  });

  it('TC-AUTH-19 – Quản lý tự xoá tài khoản của mình', () => {
    cy.apiLogin('quan_ly').then(token => {
      cy.api('DELETE', '/api/users/1', null, token).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq('Không thể xóa chính mình');
      });
    });
  });
});
