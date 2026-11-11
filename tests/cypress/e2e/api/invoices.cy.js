// Mã TC-INV mới là mã tạm: xem TRACEABILITY.md. Kỳ vọng chính theo UC-03.
const { expectStock, expectOrder, expectCount, expectRejected } = require('../../support/assertions');
const manager = work => cy.apiLogin('quan_ly').then(work);
const invoice = { repair_order_id: 2, discount: 0, payment_method: 'tien_mat' };

function checkInvoice(token, id, discount, method) {
  return cy.api('GET', `/api/invoices/${id}`, null, token).then(res => {
    expect(res.status).to.eq(200);
    expect(res.body.repair_order_id).to.eq(2);
    expect(Number(res.body.service_total)).to.eq(200000);
    expect(Number(res.body.parts_total)).to.eq(300000);
    expect(Number(res.body.discount)).to.eq(discount);
    expect(Number(res.body.total)).to.eq(500000 - discount);
    expect(res.body.payment_method).to.eq(method);
    expect(res.body.created_by).to.eq(1);
    expect(res.body.services).to.have.length(1);
    expect(res.body.parts).to.have.length(1);
    expect(res.body.parts[0].qty).to.eq(2);
    expect(Number(res.body.parts[0].price_at_time)).to.eq(150000);
  });
}
function rejectsInvoice(body, orderId, status, expectedStatus) {
  return manager(token => cy.api('POST', '/api/invoices', body, token).then(res => {
    expectCount('invoices', 1);
    if (orderId) expectOrder(orderId, status);
    expectStock(1, 10);
    cy.then(() => {
      if (expectedStatus) expect(res.status).to.eq(expectedStatus);
      else expectRejected(res);
    });
  }));
}

describe('P1 – Hóa đơn và thanh toán (API thật)', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-INV-01 – Lập hóa đơn O2, tổng 500000 và chuyển Đã thanh toán', () => {
    manager(token => {
      cy.api('POST', '/api/invoices', invoice, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.total).to.eq(500000);
        checkInvoice(token, res.body.id, 0, 'tien_mat');
      });
      expectOrder(2, 'da_thanh_toan', 500000);
      expectCount('invoices', 2);
      expectStock(1, 10); // Không được trừ kho lần hai khi xuất hóa đơn.
    });
  });

  it('TC-INV-02 – Giảm 50000 trên tổng 500000, phải thu 450000', () => {
    manager(token => cy.api('POST', '/api/invoices', { ...invoice, discount: 50000 }, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.total).to.eq(450000);
      checkInvoice(token, res.body.id, 50000, 'tien_mat');
      expectStock(1, 10);
    }));
  });

  it('TC-INV-03 – Giảm đúng tổng tiền, hóa đơn bằng 0', () => {
    manager(token => cy.api('POST', '/api/invoices', { ...invoice, discount: 500000 }, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.total).to.eq(0);
      checkInvoice(token, res.body.id, 500000, 'tien_mat');
    }));
  });

  it('TC-INV-04 – Giảm giá âm phải bị từ chối', () => {
    rejectsInvoice({ ...invoice, discount: -1 }, 2, 'hoan_thanh');
  });

  it('TC-INV-05 – Giảm giá vượt tổng không được tạo hóa đơn âm', () => {
    rejectsInvoice({ ...invoice, discount: 500001 }, 2, 'hoan_thanh');
  });

  it('TC-INV-06 – Phương thức thanh toán ngoài danh sách bị từ chối', () => {
    rejectsInvoice({ ...invoice, payment_method: 'bitcoin' }, 2, 'hoan_thanh');
  });

  it('TC-INV-07 – O1 mới Tiếp nhận, chưa được xuất hóa đơn', () => {
    rejectsInvoice({ ...invoice, repair_order_id: 1 }, 1, 'tiep_nhan', 400);
  });

  it('TC-INV-08 – O5 đang sửa, chưa được xuất hóa đơn', () => {
    rejectsInvoice({ ...invoice, repair_order_id: 5 }, 5, 'dang_sua', 400);
  });

  it('TC-INV-09 – O4 đã hủy, không được xuất hóa đơn', () => {
    rejectsInvoice({ ...invoice, repair_order_id: 4 }, 4, 'huy', 400);
  });

  it('TC-INV-10 – O3 đã có hóa đơn, không tạo hóa đơn lần hai', () => {
    rejectsInvoice({ ...invoice, repair_order_id: 3 }, 3, 'da_thanh_toan', 400);
  });

  it('TC-INV-11 – Thiếu mã phiếu phải trả lỗi 400', () => {
    rejectsInvoice({ discount: 0, payment_method: 'tien_mat' }, null, null, 400);
  });

  it('TC-INV-12 – Phiếu không tồn tại phải trả lỗi 404', () => {
    rejectsInvoice({ ...invoice, repair_order_id: 99999 }, null, null, 404);
  });

  it('TC-INV-13 – Xem hóa đơn seed của O3 đúng người lập và chi tiết', () => {
    manager(token => cy.api('GET', '/api/invoices/1', null, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ repair_order_id: 3, customer_name: 'Trần Thị B',
        plate: '59B-678.90', created_by_name: 'Quản lý', payment_method: 'tien_mat' });
      expect(Number(res.body.total)).to.eq(50000);
      expect(Number(res.body.service_total)).to.eq(50000);
      expect(Number(res.body.parts_total)).to.eq(0);
      expect(res.body.services).to.have.length(1);
      expect(res.body.parts).to.have.length(0);
    }));
  });

  it('TC-INV-14 – Hóa đơn không tồn tại trả 404', () => {
    manager(token => cy.api('GET', '/api/invoices/99999', null, token).its('status').should('eq', 404));
  });

  it('TC-INV-15 – Đổi giá danh mục không làm đổi giá đã chốt trên phiếu', () => {
    manager(token => {
      cy.api('PUT', '/api/parts/1', { name: 'Lọc dầu', unit: 'cái', price: 175000, stock_qty: 10, min_stock: 5 }, token).its('status').should('eq', 200);
      cy.api('PUT', '/api/services/1', { name: 'Thay dầu', price: 250000, active: true, duration_min: 60 }, token).its('status').should('eq', 200);
      cy.api('POST', '/api/invoices', invoice, token).then(res => {
        expect(res.status).to.eq(200);
        checkInvoice(token, res.body.id, 0, 'tien_mat');
      });
    });
  });

  it('TC-INV-16 – Thanh toán bằng Chuyển khoản', () => {
    manager(token => cy.api('POST', '/api/invoices', { ...invoice, payment_method: 'chuyen_khoan' }, token).then(res => {
      expect(res.status).to.eq(200);
      checkInvoice(token, res.body.id, 0, 'chuyen_khoan');
    }));
  });

  it('TC-INV-17 – Thanh toán bằng Thẻ', () => {
    manager(token => cy.api('POST', '/api/invoices', { ...invoice, payment_method: 'the' }, token).then(res => {
      expect(res.status).to.eq(200);
      checkInvoice(token, res.body.id, 0, 'the');
    }));
  });

  it('TC-INV-18 – Bỏ qua tổng tiền giả do client gửi, tính từ chi tiết DB', () => {
    manager(token => cy.api('POST', '/api/invoices', { ...invoice, total: 1, service_total: 1, parts_total: 0 }, token).then(res => {
      expect(res.status).to.eq(200);
      checkInvoice(token, res.body.id, 0, 'tien_mat');
    }));
  });

  it('TC-INV-19 – Không được thêm phụ tùng làm đổi chứng từ đã thanh toán', () => {
    manager(token => cy.api('POST', '/api/repair-orders/3/parts', { part_id: 1, qty: 1 }, token).then(res => {
      expectRejected(res);
      expectStock(1, 10);
      expectOrder(3, 'da_thanh_toan', 50000);
      expectCount('order_parts', 0, 'WHERE order_id=3');
    }));
  });
});
