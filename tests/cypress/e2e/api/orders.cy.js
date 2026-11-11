// Mã TC-ORD mới là mã tạm: cần đối chiếu Excel của nhóm. Xem TRACEABILITY.md.
const { expectStock, expectOrder, expectCount, expectRejected } = require('../../support/assertions');
const manager = work => cy.apiLogin('quan_ly').then(work);

describe('P1 – Phiếu sửa chữa (API thật)', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-ORD-01 – Tạo phiếu với C1 và V1, mặc định Tiếp nhận', () => {
    cy.apiLogin('nhan_vien_le_tan').then(token => {
      cy.api('POST', '/api/repair-orders', { customer_id: 1, vehicle_id: 1, staff_id: 2,
        initial_condition: 'Xe rung khi chạy', note: 'Kiểm tra phanh' }, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.id).to.be.a('number');
        cy.api('GET', `/api/repair-orders/${res.body.id}`, null, token).then(detail => {
          expect(detail.status).to.eq(200);
          expect(detail.body).to.include({ customer_id: 1, vehicle_id: 1, staff_id: 2,
            status: 'tiep_nhan', initial_condition: 'Xe rung khi chạy', note: 'Kiểm tra phanh' });
          expect(Number(detail.body.total_amount)).to.eq(0);
        });
      });
    });
  });

  it('TC-ORD-02 – Thiếu khách hàng, không tạo phiếu', () => {
    manager(token => cy.api('POST', '/api/repair-orders', { vehicle_id: 1 }, token).then(res => {
      expect(res.status).to.eq(400);
      expectCount('repair_orders', 5);
    }));
  });

  it('TC-ORD-03 – Thiếu xe, không tạo phiếu', () => {
    manager(token => cy.api('POST', '/api/repair-orders', { customer_id: 1 }, token).then(res => {
      expect(res.status).to.eq(400);
      expectCount('repair_orders', 5);
    }));
  });

  it('TC-ORD-04 – Lọc phiếu Đang sửa theo dữ liệu seed O5', () => {
    manager(token => cy.api('GET', '/api/repair-orders?status=dang_sua', null, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.map(order => order.id)).to.deep.eq([5]);
      expect(res.body[0].status).to.eq('dang_sua');
    }));
  });

  it('TC-ORD-05 – Thêm S1 nhân 2, tổng tiền dịch vụ 400000', () => {
    manager(token => {
      cy.api('POST', '/api/repair-orders/1/services', { service_id: 1, qty: 2 }, token).its('status').should('eq', 200);
      cy.api('GET', '/api/repair-orders/1', null, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.services).to.have.length(1);
        expect(res.body.services[0].qty).to.eq(2);
        expect(Number(res.body.services[0].price_at_time)).to.eq(200000);
        expect(Number(res.body.total_amount)).to.eq(400000);
      });
    });
  });

  it('TC-ORD-06 – Xóa dịch vụ của O2, tổng còn 300000', () => {
    manager(token => {
      cy.api('GET', '/api/repair-orders/2', null, token).then(res => {
        expect(res.status).to.eq(200);
        const line = res.body.services.find(service => service.service_id === 1);
        expect(line, 'dòng S1 seed').to.exist;
        cy.api('DELETE', `/api/repair-orders/2/services/${line.id}`, null, token).its('status').should('eq', 200);
      });
      expectOrder(2, 'hoan_thanh', 300000);
      expectCount('order_services', 0, 'WHERE order_id=2');
      expectStock(1, 10);
    });
  });

  it('TC-ORD-07 – Thêm P1 nhân 2, trừ tồn kho và tính tiền chính xác', () => {
    manager(token => {
      cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: 2 }, token).its('status').should('eq', 200);
      expectStock(1, 8);
      expectOrder(1, 'tiep_nhan', 300000);
      expectCount('order_parts', 1, 'WHERE order_id=1');
    });
  });

  it('TC-ORD-08 – Vượt tồn kho phải từ chối và rollback toàn bộ', () => {
    manager(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: 11 }, token).then(res => {
      // Kiểm tra rollback trước, rồi mới kiểm tra HTTP để không bỏ sót tác động DB.
      expectStock(1, 10);
      expectOrder(1, 'tiep_nhan', 0);
      expectCount('order_parts', 0, 'WHERE order_id=1');
      cy.then(() => expectRejected(res));
    }));
  });

  it('TC-ORD-09 – Xóa P1 nhân 2 khỏi O2, hoàn kho và tính lại tổng', () => {
    manager(token => {
      cy.api('GET', '/api/repair-orders/2', null, token).then(res => {
        expect(res.status).to.eq(200);
        const line = res.body.parts.find(part => part.part_id === 1);
        expect(line, 'dòng P1 seed').to.exist;
        cy.api('DELETE', `/api/repair-orders/2/parts/${line.id}`, null, token).its('status').should('eq', 200);
      });
      expectStock(1, 12);
      expectOrder(2, 'hoan_thanh', 200000);
      expectCount('order_parts', 0, 'WHERE order_id=2');
    });
  });

  it('TC-ORD-10 – Chuyển O1 từ Tiếp nhận sang Đang sửa', () => {
    manager(token => {
      cy.api('PUT', '/api/repair-orders/1/status', { status: 'dang_sua' }, token).its('status').should('eq', 200);
      expectOrder(1, 'dang_sua', 0);
    });
  });

  it('TC-ORD-11 – Chuyển O5 từ Đang sửa sang Hoàn thành', () => {
    manager(token => {
      cy.api('PUT', '/api/repair-orders/5/status', { status: 'hoan_thanh' }, token).its('status').should('eq', 200);
      expectOrder(5, 'hoan_thanh', 400000);
    });
  });

  it('TC-ORD-12 – Hủy phiếu Tiếp nhận O1', () => {
    manager(token => {
      cy.api('PUT', '/api/repair-orders/1/status', { status: 'huy' }, token).its('status').should('eq', 200);
      expectOrder(1, 'huy', 0);
    });
  });

  it('TC-ORD-13 – Từ chối trạng thái ngoài danh sách nghiệp vụ', () => {
    manager(token => cy.api('PUT', '/api/repair-orders/1/status', { status: 'khong_hop_le' }, token).then(res => {
      expectRejected(res);
      expectOrder(1, 'tiep_nhan', 0);
    }));
  });

  it('TC-ORD-14 – Xem phiếu không tồn tại trả 404', () => {
    manager(token => cy.api('GET', '/api/repair-orders/99999', null, token).its('status').should('eq', 404));
  });

  it('TC-ORD-15 – Tổng phiếu bằng S1 nhân 1 cộng P1 nhân 2', () => {
    manager(token => {
      cy.api('POST', '/api/repair-orders/1/services', { service_id: 1, qty: 1 }, token).its('status').should('eq', 200);
      cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: 2 }, token).its('status').should('eq', 200);
      expectOrder(1, 'tiep_nhan', 500000);
      expectStock(1, 8);
    });
  });

  it('TC-ORD-16 – Dịch vụ số lượng 0 phải bị từ chối', () => {
    manager(token => cy.api('POST', '/api/repair-orders/1/services', { service_id: 1, qty: 0 }, token).then(res => {
      expectRejected(res);
      expectOrder(1, 'tiep_nhan', 0);
      expectCount('order_services', 0, 'WHERE order_id=1');
    }));
  });

  it('TC-ORD-17 – Phụ tùng số lượng âm không được làm tăng tồn kho', () => {
    manager(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: -1 }, token).then(res => {
      expectRejected(res);
      expectStock(1, 10);
      expectOrder(1, 'tiep_nhan', 0);
      expectCount('order_parts', 0, 'WHERE order_id=1');
    }));
  });

  it('TC-ORD-18 – P3 hết hàng, không tạo dòng phụ tùng', () => {
    manager(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 3, qty: 1 }, token).then(res => {
      expectStock(3, 0);
      expectCount('order_parts', 0, 'WHERE order_id=1');
      expectOrder(1, 'tiep_nhan', 0);
      cy.then(() => expectRejected(res));
    }));
  });
});
