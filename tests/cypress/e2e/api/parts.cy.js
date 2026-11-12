// Ánh xạ đúng TC-PRT-01…22 trong Test Case.xlsx.pdf (F05, SRS 3.5).
const { expectStock, expectOrder, expectCount } = require('../../support/assertions');
const receptionist = work => cy.apiLogin('nhan_vien_le_tan').then(work);
const manager = work => cy.apiLogin('quan_ly').then(work);

function checkStock(token, id, quantity) {
  return cy.api('GET', '/api/parts', null, token).then(res => {
    expect(res.status).to.eq(200);
    const part = res.body.find(row => row.id === id);
    expect(part, `phụ tùng P${id}`).to.exist;
    expect(part.stock_qty, `tồn kho P${id}`).to.eq(quantity);
  });
}

function unchangedOrder() {
  expectStock(1, 10);
  expectOrder(1, 'tiep_nhan', 0);
  return expectCount('order_parts', 0, 'WHERE order_id=1');
}

describe('P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật)', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-PRT-01 – Thêm phụ tùng với số lượng nhỏ nhất hợp lệ', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: 1 }, token)
        .its('status').should('eq', 200);
      checkStock(token, 1, 9);
      expectOrder(1, 'tiep_nhan', 150000);
      expectCount('order_parts', 1, 'WHERE order_id=1 AND part_id=1 AND qty=1');
    });
  });

  it('TC-PRT-02 – Số lượng bằng đúng tồn kho', () => {
    receptionist(token => {
      cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: 10 }, token)
        .its('status').should('eq', 200);
      checkStock(token, 1, 0);
      expectOrder(1, 'tiep_nhan', 1500000);
      expectCount('order_parts', 1, 'WHERE order_id=1 AND part_id=1 AND qty=10');
    });
  });

  it('TC-PRT-03 – Số lượng vượt tồn kho 1 đơn vị', () => {
    receptionist(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: 11 }, token).then(res => {
      // Xác minh rollback riêng trước khi kiểm tra mã lỗi theo Test Case.
      unchangedOrder();
      checkStock(token, 1, 10);
      cy.then(() => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq('Không đủ tồn kho (còn 10)');
      });
    }));
  });

  it('TC-PRT-04 – Số lượng bằng 0', () => {
    receptionist(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: 0 }, token).then(res => {
      expect(res.status).to.eq(400);
      unchangedOrder();
      checkStock(token, 1, 10);
    }));
  });

  it('TC-PRT-05 – Số lượng âm', () => {
    receptionist(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: -1 }, token).then(res => {
      expect(res.status).to.eq(400);
      unchangedOrder();
      checkStock(token, 1, 10);
    }));
  });

  it('TC-PRT-06 – Không gửi số lượng', () => {
    receptionist(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1 }, token).then(res => {
      // PDF cho phép 400, hoặc mặc định qty=1 đồng thời phải trừ đúng 1 khỏi kho.
      expect(res.status).to.be.oneOf([400, 200]);
      if (res.status === 400) {
        unchangedOrder();
        checkStock(token, 1, 10);
      } else {
        checkStock(token, 1, 9);
        expectOrder(1, 'tiep_nhan', 150000);
        expectCount('order_parts', 1, 'WHERE order_id=1 AND part_id=1 AND qty=1');
      }
    }));
  });

  it('TC-PRT-07 – Số lượng không phải số', () => {
    receptionist(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 1, qty: 'abc' }, token).then(res => {
      unchangedOrder();
      cy.then(() => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq('Số lượng không hợp lệ');
      });
    }));
  });

  it('TC-PRT-08 – Phụ tùng không tồn tại', () => {
    receptionist(token => cy.api('POST', '/api/repair-orders/1/parts', { part_id: 99999, qty: 1 }, token).then(res => {
      unchangedOrder();
      cy.then(() => {
        // Hai mã này đều được ghi rõ trong kết quả mong đợi của PDF.
        expect(res.status).to.be.oneOf([404, 400]);
        expect(res.body.error).to.eq('Phụ tùng không tồn tại');
      });
    }));
  });

  it('TC-PRT-09 – Rollback khi phiếu không tồn tại', () => {
    receptionist(token => cy.api('POST', '/api/repair-orders/99999/parts', { part_id: 1, qty: 2 }, token).then(res => {
      checkStock(token, 1, 10);
      expectCount('order_parts', 0, 'WHERE order_id=99999');
      expectCount('repair_orders', 5);
      cy.then(() => {
        // PDF yêu cầu báo lỗi và rollback, không quy định riêng mã HTTP.
        expect(res.status).to.be.within(400, 599);
        expect(res.body.error).to.be.a('string').and.not.be.empty;
      });
    }));
  });

  it('TC-PRT-10 – Xoá phụ tùng khỏi phiếu thì hoàn kho', () => {
    receptionist(token => {
      cy.api('GET', '/api/repair-orders/5', null, token).then(res => {
        expect(res.status).to.eq(200);
        const line = res.body.parts.find(row => row.part_id === 2);
        expect(line, 'dòng P2 × 1 của O5').to.exist;
        expect(line.qty).to.eq(1);
        cy.api('DELETE', `/api/repair-orders/5/parts/${line.id}`, null, token)
          .its('status').should('eq', 200);
      });
      checkStock(token, 2, 6);
      cy.api('GET', '/api/repair-orders/5', null, token).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.parts).to.have.length(0);
        expect(Number(res.body.total_amount)).to.eq(0);
      });
      expectOrder(5, 'dang_sua', 0);
    });
  });

  it('TC-PRT-11 – Xoá dòng phụ tùng không tồn tại', () => {
    receptionist(token => cy.api('DELETE', '/api/repair-orders/5/parts/99999', null, token).then(res => {
      expect(res.status).to.eq(404);
      expectStock(2, 5);
      expectOrder(5, 'dang_sua', 400000);
      expectCount('order_parts', 1, 'WHERE order_id=5 AND part_id=2');
    }));
  });

  it('TC-PRT-12 – Nhập kho số lượng hợp lệ', () => {
    manager(token => {
      cy.api('POST', '/api/parts/1/restock', { qty: 5 }, token)
        .its('status').should('eq', 200);
      checkStock(token, 1, 15);
      expectCount('parts', 4);
    });
  });

  it('TC-PRT-13 – Nhập kho số lượng 0', () => {
    manager(token => cy.api('POST', '/api/parts/1/restock', { qty: 0 }, token).then(res => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Số lượng không hợp lệ');
      checkStock(token, 1, 10);
    }));
  });

  it('TC-PRT-14 – Nhập kho số lượng âm', () => {
    manager(token => cy.api('POST', '/api/parts/1/restock', { qty: -3 }, token).then(res => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Số lượng không hợp lệ');
      checkStock(token, 1, 10);
    }));
  });

  it('TC-PRT-15 – Nhập kho với chuỗi chữ', () => {
    manager(token => cy.api('POST', '/api/parts/1/restock', { qty: 'abc' }, token).then(res => {
      checkStock(token, 1, 10);
      cy.then(() => expect(res.status).to.eq(400));
    }));
  });

  it('TC-PRT-16 – Nhập kho số thập phân', () => {
    manager(token => cy.api('POST', '/api/parts/1/restock', { qty: 2.5 }, token).then(res => {
      checkStock(token, 1, 10);
      cy.then(() => expect(res.status, 'số lượng phải là số nguyên').to.eq(400));
    }));
  });

  it('TC-PRT-17 – Nhập kho cho phụ tùng không tồn tại', () => {
    manager(token => cy.api('POST', '/api/parts/99999/restock', { qty: 5 }, token).then(res => {
      expect(res.status).to.eq(404);
      expectCount('parts', 4);
      expectStock(1, 10);
    }));
  });

  it('TC-PRT-18 – Thêm phụ tùng thiếu tên', () => {
    manager(token => cy.api('POST', '/api/parts', { price: 90000 }, token).then(res => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Thiếu thông tin');
      expectCount('parts', 4);
    }));
  });

  it('TC-PRT-19 – Thêm phụ tùng giá âm', () => {
    manager(token => cy.api('POST', '/api/parts', { name: 'Gạt mưa', price: -90000 }, token).then(res => {
      expect(res.status).to.eq(400);
      expectCount('parts', 4);
    }));
  });

  it('TC-PRT-20 – Đặt mức tồn tối thiểu bằng 0', () => {
    manager(token => cy.api('POST', '/api/parts', { name: 'Ốc vít', price: 1000, min_stock: 0 }, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.be.a('number');
      cy.api('GET', '/api/parts', null, token).then(list => {
        expect(list.status).to.eq(200);
        const part = list.body.find(row => row.id === res.body.id);
        expect(part, 'phụ tùng vừa tạo').to.exist;
        expect(part.name).to.eq('Ốc vít');
        expect(part.min_stock).to.eq(0);
      });
    }));
  });

  it('TC-PRT-21 – Cảnh báo tồn thấp tại các giá trị biên', () => {
    manager(token => {
      // Seed P2 (5/5) và P3 (0/3) luôn được đếm; chỉ P4 thay đổi qua 6, 5, 4.
      for (const [quantity, expected] of [[6, 2], [5, 3], [4, 3]]) {
        cy.api('PUT', '/api/parts/4', {
          name: 'Dầu nhớt', unit: 'cái', price: 120000, stock_qty: quantity, min_stock: 5,
        }, token).its('status').should('eq', 200);
        checkStock(token, 4, quantity);
        cy.api('GET', '/api/reports/dashboard', null, token).then(res => {
          expect(res.status).to.eq(200);
          expect(res.body.lowStockParts, `P4 tồn ${quantity}, min 5`).to.eq(expected);
        });
      }
    });
  });

  it('TC-PRT-22 – Xoá phụ tùng đã dùng trong phiếu', () => {
    manager(token => cy.api('DELETE', '/api/parts/2', null, token).then(res => {
      // Kho và dòng phiếu phải còn nguyên khi việc xoá bị từ chối.
      expectStock(2, 5);
      expectCount('order_parts', 1, 'WHERE order_id=5 AND part_id=2');
      expectOrder(5, 'dang_sua', 400000);
      cy.then(() => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.match(/đang.*sử dụng/i);
      });
    }));
  });
});
