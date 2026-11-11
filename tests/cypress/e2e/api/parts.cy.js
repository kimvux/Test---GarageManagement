// Mã mới cần đối chiếu Excel; PRT-05 và PRT-13 lấy từ ví dụ đã cung cấp.
const { expectStock, expectCount, expectRejected } = require('../../support/assertions');
const manager = work => cy.apiLogin('quan_ly').then(work);
const validPart = { name: 'Gạt mưa kiểm thử', unit: 'bộ', price: 90000, stock_qty: 0, min_stock: 2 };

describe('P1 – Phụ tùng và nhập kho (API thật)', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-PRT-01 – Đọc danh mục P1 đến P4 đúng giá và tồn kho seed', () => {
    manager(token => cy.api('GET', '/api/parts', null, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.map(part => part.id).sort()).to.deep.eq([1, 2, 3, 4]);
      const part = res.body.find(p => p.id === 1);
      expect(part).to.include({ name: 'Lọc dầu', stock_qty: 10, min_stock: 5 });
      expect(Number(part.price)).to.eq(150000);
    }));
  });

  it('TC-PRT-02 – Thêm phụ tùng hợp lệ, tồn kho 0 được giữ nguyên', () => {
    manager(token => cy.api('POST', '/api/parts', validPart, token).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.be.a('number');
      cy.task('db:query', { sql: 'SELECT * FROM parts WHERE id=$1', params: [res.body.id] }).then(rows => {
        expect(rows).to.have.length(1);
        expect(rows[0]).to.include({ name: validPart.name, unit: 'bộ', stock_qty: 0, min_stock: 2 });
        expect(Number(rows[0].price)).to.eq(90000);
      });
      expectCount('parts', 5);
    }));
  });

  it('TC-PRT-03 – Thiếu tên phụ tùng phải báo lỗi', () => {
    manager(token => cy.api('POST', '/api/parts', { ...validPart, name: '' }, token).then(res => {
      expect(res.status).to.eq(400);
      expectCount('parts', 4);
    }));
  });

  it('TC-PRT-04 – Đơn giá âm phải bị từ chối', () => {
    manager(token => cy.api('POST', '/api/parts', { ...validPart, price: -1 }, token).then(res => {
      expectRejected(res);
      expectCount('parts', 4);
    }));
  });

  it('TC-PRT-05 – Số lượng âm', () => {
    manager(token => cy.api('POST', '/api/parts', { ...validPart, stock_qty: -1 }, token).then(res => {
      expectRejected(res);
      expectCount('parts', 4);
    }));
  });

  it('TC-PRT-06 – Cập nhật giá P1, không làm đổi tồn kho', () => {
    manager(token => {
      cy.api('PUT', '/api/parts/1', { name: 'Lọc dầu', unit: 'cái', price: 160000, stock_qty: 10, min_stock: 5 }, token).its('status').should('eq', 200);
      cy.api('GET', '/api/parts', null, token).then(res => {
        expect(res.status).to.eq(200);
        expect(Number(res.body.find(p => p.id === 1).price)).to.eq(160000);
      });
      expectStock(1, 10);
    });
  });

  it('TC-PRT-07 – Mức tồn tối thiểu 0 phải được lưu đúng', () => {
    manager(token => cy.api('POST', '/api/parts', { ...validPart, min_stock: 0 }, token).then(res => {
      expect(res.status).to.eq(200);
      cy.task('db:query', { sql: 'SELECT min_stock FROM parts WHERE id=$1', params: [res.body.id] }).then(rows => {
        expect(rows).to.have.length(1);
        expect(rows[0].min_stock).to.eq(0);
      });
    }));
  });

  it('TC-PRT-08 – Xóa P4 chưa được dùng trong phiếu', () => {
    manager(token => {
      cy.api('DELETE', '/api/parts/4', null, token).its('status').should('eq', 200);
      expectCount('parts', 0, 'WHERE id=4');
      expectCount('parts', 3);
    });
  });

  it('TC-PRT-09 – Phụ tùng đã dùng phải được bảo vệ khỏi xóa', () => {
    manager(token => cy.api('DELETE', '/api/parts/1', null, token).then(res => {
      expectStock(1, 10);
      expectCount('order_parts', 1, 'WHERE order_id=2 AND part_id=1');
      cy.then(() => expectRejected(res));
    }));
  });

  it('TC-PRT-10 – Cảnh báo tồn kho tính cả bằng ngưỡng và hết hàng', () => {
    manager(token => cy.api('GET', '/api/reports/dashboard', null, token).then(res => {
      expect(res.status).to.eq(200);
      // Chỉ P2 (5 <= 5) và P3 (0 <= 3) dưới hoặc bằng ngưỡng.
      expect(res.body.lowStockParts).to.eq(2);
    }));
  });

  it('TC-PRT-11 – Thiếu đơn giá phải báo lỗi', () => {
    const { price, ...withoutPrice } = validPart;
    manager(token => cy.api('POST', '/api/parts', withoutPrice, token).then(res => {
      expect(res.status).to.eq(400);
      expectCount('parts', 4);
    }));
  });

  it('TC-PRT-12 – Nhập kho số lẻ phải bị từ chối, tồn kho không đổi', () => {
    manager(token => cy.api('POST', '/api/parts/1/restock', { qty: 1.5 }, token).then(res => {
      expectStock(1, 10);
      cy.then(() => expectRejected(res));
    }));
  });

  it('TC-PRT-13 – Nhập kho hợp lệ', () => {
    manager(token => {
      cy.api('POST', '/api/parts/1/restock', { qty: 5 }, token).its('status').should('eq', 200);
      expectStock(1, 15);
      expectCount('parts', 4);
    });
  });

  it('TC-PRT-14 – Nhập kho qty bằng 0 phải bị từ chối', () => {
    manager(token => cy.api('POST', '/api/parts/1/restock', { qty: 0 }, token).then(res => {
      expect(res.status).to.eq(400);
      expectStock(1, 10);
    }));
  });

  it('TC-PRT-15 – Nhập kho qty âm phải bị từ chối', () => {
    manager(token => cy.api('POST', '/api/parts/1/restock', { qty: -1 }, token).then(res => {
      expect(res.status).to.eq(400);
      expectStock(1, 10);
    }));
  });

  it('TC-PRT-16 – Nhập kho phụ tùng không tồn tại phải báo 404', () => {
    manager(token => cy.api('POST', '/api/parts/99999/restock', { qty: 5 }, token).then(res => {
      expect(res.status).to.eq(404);
      expectCount('parts', 4);
    }));
  });
});
