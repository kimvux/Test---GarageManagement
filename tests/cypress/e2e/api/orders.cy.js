// TC-ORD-01..21 theo Test Case.xlsx.pdf; TC-ORD-22 nằm trong ui/orders.cy.js.
const { expectStock, expectOrder, expectCount } = require('../../support/assertions');
const receptionist = work => cy.apiLogin('nhan_vien_le_tan').then(work);

function orderDetail(token, id, status, total) {
  return cy.api('GET', `/api/repair-orders/${id}`, null, token).then(res => {
    expect(res.status, `GET phiếu O${id}`).to.eq(200);
    expect(res.body.status, `trạng thái O${id}`).to.eq(status);
    if (total !== undefined) expect(Number(res.body.total_amount), `tổng tiền O${id}`).to.eq(total);
  });
}

function addS1Twice(token) {
  return cy.api('POST', '/api/repair-orders/1/services', { service_id: 1, qty: 2 }, token)
    .its('status').should('eq', 200);
}

describe('P1 – Phiếu sửa chữa (API thật, mã TC theo PDF)', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-ORD-01 – Tạo phiếu hợp lệ', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders', {
        customer_id: 1, vehicle_id: 1, initial_condition: 'Xe kêu khi phanh',
      }, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.id).to.be.a('number');
        cy.api('GET', `/api/repair-orders/${res.body.id}`, null, token).then(detail => {
          expect(detail.status).to.eq(200);
          expect(detail.body).to.include({ customer_id: 1, vehicle_id: 1,
            initial_condition: 'Xe kêu khi phanh', status: 'tiep_nhan' });
          expect(Number(detail.body.total_amount)).to.eq(0);
        });
      });
    });
  });

  it('TC-ORD-02 – Thiếu customer_id', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders', { vehicle_id: 1 }, token).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq('Thiếu thông tin');
      });
      expectCount('repair_orders', 5);
    });
  });

  it('TC-ORD-03 – Thiếu vehicle_id', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders', { customer_id: 1 }, token).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq('Thiếu thông tin');
      });
      expectCount('repair_orders', 5);
    });
  });

  it('TC-ORD-04 – Xe không thuộc khách hàng được chọn', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders', { customer_id: 1, vehicle_id: 2 }, token).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.error, 'thông báo xe không thuộc khách hàng').to.match(/xe.*không thuộc.*khách hàng/i);
      });
      expectCount('repair_orders', 5);
    });
  });

  it('TC-ORD-05 – customer_id không tồn tại', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders', { customer_id: 99999, vehicle_id: 1 }, token).then(res => {
        expect(res.status, 'PDF cho phép 400 hoặc 404').to.be.oneOf([400, 404]);
        expect(res.body.error, 'thông báo lỗi rõ ràng theo PDF').to.be.a('string').and.not.be.empty;
      });
      expectCount('repair_orders', 5);
    });
  });

  it('TC-ORD-06 – Chuyển hợp lệ: Tiếp nhận → Đang sửa', () => {
    receptionist(token => {
      cy.api('PUT', '/api/repair-orders/1/status', { status: 'dang_sua' }, token)
        .its('status').should('eq', 200);
      orderDetail(token, 1, 'dang_sua', 0);
    });
  });

  it('TC-ORD-07 – Chuyển hợp lệ: Đang sửa → Hoàn thành', () => {
    receptionist(token => {
      cy.api('PUT', '/api/repair-orders/5/status', { status: 'hoan_thanh' }, token)
        .its('status').should('eq', 200);
      orderDetail(token, 5, 'hoan_thanh', 400000);
    });
  });

  it('TC-ORD-08 – Chuyển hợp lệ: Tiếp nhận → Huỷ', () => {
    receptionist(token => {
      cy.api('PUT', '/api/repair-orders/1/status', { status: 'huy' }, token)
        .its('status').should('eq', 200);
      orderDetail(token, 1, 'huy', 0);
    });
  });

  it('TC-ORD-09 – Chuyển không hợp lệ: Đã thanh toán → Tiếp nhận', () => {
    receptionist(token => {
      cy.api('PUT', '/api/repair-orders/3/status', { status: 'tiep_nhan' }, token)
        .its('status').should('eq', 400);
      orderDetail(token, 3, 'da_thanh_toan', 50000);
    });
  });

  it('TC-ORD-10 – Chuyển không hợp lệ: Huỷ → Đang sửa', () => {
    receptionist(token => {
      cy.api('PUT', '/api/repair-orders/4/status', { status: 'dang_sua' }, token)
        .its('status').should('eq', 400);
      orderDetail(token, 4, 'huy', 0);
    });
  });

  it('TC-ORD-11 – Chuyển không hợp lệ: Tiếp nhận → Hoàn thành', () => {
    receptionist(token => {
      cy.api('PUT', '/api/repair-orders/1/status', { status: 'hoan_thanh' }, token)
        .its('status').should('eq', 400);
      orderDetail(token, 1, 'tiep_nhan', 0);
    });
  });

  it('TC-ORD-12 – Giá trị trạng thái không thuộc danh sách', () => {
    receptionist(token => {
      cy.api('PUT', '/api/repair-orders/1/status', { status: 'abc' }, token)
        .its('status').should('eq', 400);
      orderDetail(token, 1, 'tiep_nhan', 0);
    });
  });

  it('TC-ORD-13 – Thiếu trường status', () => {
    receptionist(token => {
      cy.api('PUT', '/api/repair-orders/1/status', {}, token).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq('Thiếu thông tin');
      });
      orderDetail(token, 1, 'tiep_nhan', 0);
    });
  });

  it('TC-ORD-14 – Huỷ phiếu có phụ tùng thì hoàn trả tồn kho', () => {
    receptionist(token => {
      expectStock(2, 5);
      cy.api('PUT', '/api/repair-orders/5/status', { status: 'huy' }, token)
        .its('status').should('eq', 200);
      orderDetail(token, 5, 'huy');
      expectStock(2, 6);
    });
  });

  it('TC-ORD-15 – Thêm dịch vụ, tính lại tổng tiền', () => {
    receptionist(token => {
      addS1Twice(token);
      cy.api('GET', '/api/repair-orders/1', null, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.services).to.have.length(1);
        expect(res.body.services[0]).to.include({ service_id: 1, qty: 2 });
        expect(Number(res.body.services[0].price_at_time)).to.eq(200000);
        expect(Number(res.body.total_amount)).to.eq(400000);
      });
    });
  });

  it('TC-ORD-16 – Thêm dịch vụ không tồn tại', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders/1/services', { service_id: 99999, qty: 1 }, token).then(res => {
        expect(res.status, 'PDF cho phép 400 hoặc 404').to.be.oneOf([400, 404]);
        expect(res.body.error).to.eq('Dịch vụ không tồn tại');
      });
      expectCount('order_services', 0, 'WHERE order_id=1');
      expectOrder(1, 'tiep_nhan', 0);
    });
  });

  it('TC-ORD-17 – Thêm dịch vụ vào phiếu đã Hoàn thành', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders/2/services', { service_id: 2, qty: 1 }, token)
        .its('status').should('eq', 400);
      orderDetail(token, 2, 'hoan_thanh', 500000);
      expectCount('order_services', 1, 'WHERE order_id=2');
    });
  });

  it('TC-ORD-18 – Thêm dịch vụ vào phiếu đã thanh toán', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders/3/services', { service_id: 2, qty: 1 }, token)
        .its('status').should('eq', 400);
      orderDetail(token, 3, 'da_thanh_toan', 50000);
      expectCount('order_services', 1, 'WHERE order_id=3');
    });
  });

  it('TC-ORD-19 – Thêm dịch vụ đã tạm ngưng', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders/1/services', { service_id: 3, qty: 1 }, token).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.match(/dịch vụ.*tạm ngưng/i);
      });
      expectCount('order_services', 0, 'WHERE order_id=1');
      expectOrder(1, 'tiep_nhan', 0);
    });
  });

  it('TC-ORD-20 – Giá trong phiếu không đổi khi đổi giá dịch vụ', () => {
    cy.apiLogin('quan_ly').then(token => {
      // Tự chuẩn bị điều kiện của TC-ORD-15 sau seed, không phụ thuộc ca đã chạy.
      addS1Twice(token);
      cy.api('PUT', '/api/services/1', { name: 'Thay dầu', price: 250000, active: true }, token)
        .its('status').should('eq', 200);
      cy.api('GET', '/api/repair-orders/1', null, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.services).to.have.length(1);
        expect(Number(res.body.services[0].price_at_time)).to.eq(200000);
        expect(Number(res.body.total_amount)).to.eq(400000);
      });
    });
  });

  it('TC-ORD-21 – Xoá dịch vụ khỏi phiếu', () => {
    receptionist(token => {
      addS1Twice(token);
      cy.api('GET', '/api/repair-orders/1', null, token).then(res => {
        expect(res.status).to.eq(200);
        const line = res.body.services.find(service => service.service_id === 1);
        expect(line, 'dòng S1 × 2').to.exist;
        cy.api('DELETE', `/api/repair-orders/1/services/${line.id}`, null, token)
          .its('status').should('eq', 200);
      });
      cy.api('GET', '/api/repair-orders/1', null, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.services).to.have.length(0);
        expect(Number(res.body.total_amount)).to.eq(0);
      });
    });
  });
});
