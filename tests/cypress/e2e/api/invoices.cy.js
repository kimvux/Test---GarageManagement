// Đối chiếu TC-INV trong Test Case.xlsx.pdf (F07 – SRS 3.7).
const { expectStock, expectOrder, expectCount } = require('../../support/assertions');
const receptionist = work => cy.apiLogin('nhan_vien_le_tan').then(work);
const invoice = { repair_order_id: 2, discount: 0, payment_method: 'tien_mat' };

function checkInvoice(token, id, discount, method, createdBy = 2) {
  return cy.api('GET', `/api/invoices/${id}`, null, token).then(res => {
    expect(res.status).to.eq(200);
    expect(res.body.repair_order_id).to.eq(2);
    expect(Number(res.body.service_total)).to.eq(200000);
    expect(Number(res.body.parts_total)).to.eq(300000);
    expect(Number(res.body.discount)).to.eq(discount);
    expect(Number(res.body.total)).to.eq(500000 - discount);
    expect(res.body.payment_method).to.eq(method);
    expect(res.body.created_by).to.eq(createdBy);
    expect(res.body.services).to.have.length(1);
    expect(res.body.parts).to.have.length(1);
    expect(res.body.parts[0].qty).to.eq(2);
    expect(Number(res.body.parts[0].price_at_time)).to.eq(150000);
  });
}

function rejectInvoice(body, expectedStatus, orderId, status, message) {
  return receptionist(token => cy.api('POST', '/api/invoices', body, token).then(res => {
    expect(res.status, 'mã HTTP theo Test Case').to.eq(expectedStatus);
    if (message) expect(res.body.error).to.eq(message);
    expectCount('invoices', 1);
    if (orderId) {
      cy.api('GET', `/api/repair-orders/${orderId}`, null, token).then(order => {
        expect(order.status).to.eq(200);
        expect(order.body.status).to.eq(status);
      });
      expectOrder(orderId, status);
    }
    expectStock(1, 10);
  }));
}

describe('P1 – Hóa đơn và thanh toán (API thật)', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-INV-01 – Lập hóa đơn chuẩn cho O2, tổng 500000', () => {
    receptionist(token => {
      cy.api('POST', '/api/invoices', invoice, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.total).to.eq(500000);
        checkInvoice(token, res.body.id, 0, 'tien_mat');
      });
      cy.api('GET', '/api/repair-orders/2', null, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.status).to.eq('da_thanh_toan');
      });
      expectOrder(2, 'da_thanh_toan', 500000);
      expectCount('invoices', 2);
      expectStock(1, 10); // Xuất hóa đơn không trừ kho lần hai.
    });
  });

  it('TC-INV-02 – Giảm 100000 và chuyển khoản, tổng 400000', () => {
    receptionist(token => cy.api('POST', '/api/invoices', {
      ...invoice, discount: 100000, payment_method: 'chuyen_khoan',
    }, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.total).to.eq(400000);
      checkInvoice(token, res.body.id, 100000, 'chuyen_khoan');
      expectOrder(2, 'da_thanh_toan', 500000);
      expectStock(1, 10);
    }));
  });

  it('TC-INV-03 – Giảm đúng tổng tiền 500000, hóa đơn bằng 0', () => {
    receptionist(token => cy.api('POST', '/api/invoices', { ...invoice, discount: 500000 }, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.total).to.eq(0);
      checkInvoice(token, res.body.id, 500000, 'tien_mat');
    }));
  });

  it('TC-INV-04 – Giảm giá vượt tổng tiền một đồng bị từ chối', () => {
    rejectInvoice({ ...invoice, discount: 500001 }, 400, 2, 'hoan_thanh');
  });

  it('TC-INV-05 – Giảm giá âm -50000 bị từ chối', () => {
    rejectInvoice({ ...invoice, discount: -50000 }, 400, 2, 'hoan_thanh');
  });

  it('TC-INV-06 – Giảm giá không phải số bị từ chối', () => {
    rejectInvoice({ ...invoice, discount: 'abc' }, 400, 2, 'hoan_thanh');
  });

  it('TC-INV-07 – Phiếu O1 chưa hoàn thành không được lập hóa đơn', () => {
    rejectInvoice({ ...invoice, repair_order_id: 1 }, 400, 1, 'tiep_nhan');
  });

  it('TC-INV-08 – Phiếu O4 đã hủy không được lập hóa đơn', () => {
    rejectInvoice({ ...invoice, repair_order_id: 4 }, 400, 4, 'huy');
  });

  it('TC-INV-09 – Không được lập hóa đơn lần hai cho O3', () => {
    rejectInvoice({ ...invoice, repair_order_id: 3 }, 400, 3,
      'da_thanh_toan', 'Phiếu đã được thanh toán');
  });

  it('TC-INV-10 – Rollback giữ nguyên hóa đơn và trạng thái O3', () => {
    // Tái hiện thao tác TC-INV-09 trong chính ca này để không phụ thuộc thứ tự chạy.
    receptionist(token => {
      cy.api('GET', '/api/invoices/1', null, token).then(before => {
        expect(before.status).to.eq(200);
        cy.api('POST', '/api/invoices', { ...invoice, repair_order_id: 3 }, token);
        expectCount('invoices', 1);
        expectCount('invoices', 1, 'WHERE repair_order_id=$1', [3]);
        cy.api('GET', '/api/repair-orders/3', null, token).then(order => {
          expect(order.status).to.eq(200);
          expect(order.body.status).to.eq('da_thanh_toan');
          expect(order.body.invoice.id).to.eq(1);
        });
        cy.api('GET', '/api/invoices/1', null, token).then(after => {
          expect(after.status).to.eq(200);
          expect(after.body).to.deep.eq(before.body);
        });
        expectOrder(3, 'da_thanh_toan', 50000);
      });
    });
  });

  it('TC-INV-11 – Phương thức thanh toán bitcoin bị từ chối', () => {
    rejectInvoice({ ...invoice, payment_method: 'bitcoin' }, 400, 2, 'hoan_thanh');
  });

  it('TC-INV-13 – Phiếu không tồn tại trả 404', () => {
    rejectInvoice({ ...invoice, repair_order_id: 99999 }, 404);
  });

  it('TC-INV-14 – Body rỗng thiếu repair_order_id trả 400', () => {
    rejectInvoice({}, 400, undefined, undefined, 'Thiếu thông tin');
  });

  it('TC-INV-15 – Hóa đơn đã lập giữ nguyên giá sau khi đổi giá S1', () => {
    cy.apiLogin('quan_ly').then(token => {
      // Tạo hóa đơn như TC-INV-01 trước khi thay giá, không phụ thuộc ca trước.
      cy.api('POST', '/api/invoices', invoice, token).then(created => {
        expect(created.status).to.eq(200);
        checkInvoice(token, created.body.id, 0, 'tien_mat', 1);
        cy.api('PUT', '/api/services/1', {
          name: 'Thay dầu', price: 250000, active: true, duration_min: 60,
        }, token).its('status').should('eq', 200);
        checkInvoice(token, created.body.id, 0, 'tien_mat', 1);
      });
    });
  });

  it('TC-INV-16 – Xem hóa đơn không tồn tại trả 404', () => {
    receptionist(token => cy.api('GET', '/api/invoices/99999', null, token).then(res => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq('Không tìm thấy');
    }));
  });
});
