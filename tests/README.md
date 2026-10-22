# Bộ kiểm thử AutoGara

Kiểm thử API và E2E bằng Cypress, đo độ phủ `backend/server.js` bằng c8. **Không sửa gì trong `backend/` và `frontend/`.** Mọi thứ của nhóm nằm trong thư mục `tests/`.

## 1. Cài một lần

Cần có:
- **Node.js ≥ 20.6** (để dùng `node --env-file`). Kiểm tra bằng `node -v`.
- **Docker Desktop** (để chạy PostgreSQL test). Mở Docker Desktop trước khi chạy lệnh.

Mở PowerShell ở thư mục gốc repo rồi chạy:

```powershell
cd backend
npm ci
cd ..\tests
npm install
npx cypress install
```

> Nếu npm báo `install-scripts ... cypress` bị chặn thì lệnh `npx cypress install` ở trên sẽ tải Cypress về.

Tạo CSDL test (chỉ lần đầu; các lần sau lệnh này chỉ bật lại container):

```powershell
npm run db:up
```

CSDL chạy ở **cổng 5433** (không dùng 5432 để tránh trùng PostgreSQL khác trên máy). Thông tin kết nối nằm trong `tests/.env.test`. **Không đổi sang CSDL Neon hay API Render.**

## 2. Mỗi lần chạy test

Mở 3 cửa sổ PowerShell, tất cả đứng ở thư mục `tests/`.

**Cửa sổ 1 – backend** (chọn 1 trong 2):

```powershell
npm run backend        # chạy thường
npm run backend:cov    # chạy kèm đo độ phủ c8
```

Chờ dòng `AutoCare API running on port 3000`. Lần đầu backend sẽ tự tạo bảng.

**Cửa sổ 2 – frontend:**

```powershell
npm run frontend
```

Frontend ở http://localhost:5500.

**Cửa sổ 3 – chạy test:**

```powershell
npm run test:api       # chỉ test API
npm run test:ui        # chỉ test giao diện
npm test               # tất cả
npm run cy:open        # mở giao diện Cypress (dùng khi quay video)
```

Mỗi test tự seed lại CSDL trong `beforeEach`, nên chạy bao nhiêu lần cũng được. Muốn seed bằng tay: `npm run seed`.

**Lấy báo cáo độ phủ:** khi chạy backend bằng `backend:cov`, chạy test xong thì dừng backend bằng **Ctrl+C** ở cửa sổ 1, hoặc chạy `npm run backend:stop` ở cửa sổ khác. Báo cáo ở `tests/coverage/index.html`, bảng tóm tắt in ra ở cửa sổ 1.

## 3. Viết test mới

- File API đặt trong `cypress/e2e/api/`, file giao diện đặt trong `cypress/e2e/ui/`.
- **Tiêu đề test phải bắt đầu bằng mã TC**, ví dụ `it('TC-PRT-05 – Số lượng âm', ...)`.
- **Kết quả mong đợi lấy theo SRS và file Test Case, không theo code.** Test fail vì code sai SRS là đúng; ghi lỗi vào Bug Report, không sửa test cho pass.
- Mọi test giao diện phải gọi `cy.useLocalApi()` trong `beforeEach`. Nếu thiếu, frontend sẽ gọi API thật trên Render.

Các lệnh có sẵn (`cypress/support/commands.js`):

| Lệnh | Tác dụng |
|---|---|
| `cy.api(method, url, body, token)` | Gọi backend local. Không tự fail khi gặp 4xx/5xx, để test tự kiểm tra `res.status` |
| `cy.apiLogin(role)` | Đăng nhập và trả về token. `role` là `'quan_ly'` (admin) hoặc `'nhan_vien_le_tan'` (letan1) |
| `cy.useLocalApi()` | Chuyển request gửi tới Render về `http://localhost:3000`, đặt alias `@api` |
| `cy.task('db:seed')` | Reset và nạp dữ liệu seed |
| `cy.task('jwt:sign', { payload, expiresIn })` | Ký token bằng `JWT_SECRET` test. `expiresIn: -1` cho token đã hết hạn (TC-AUTH-12) |

Ví dụ:

```js
it('TC-PRT-13 – Nhập kho hợp lệ', () => {
  cy.apiLogin('quan_ly').then(token => {
    cy.api('POST', '/api/parts/1/restock', { qty: 5 }, token).then(res => {
      expect(res.status).to.eq(200);
    });
  });
});
```

## 4. Dữ liệu seed

Id khớp ký hiệu trong file Test Case (C1 = id 1, O3 = id 3...).

| Ký hiệu | Dữ liệu |
|---|---|
| Tài khoản | `admin / admin123` (quan_ly, "Quản lý"), `letan1 / letan123` (nhan_vien_le_tan, "Lễ tân 1") |
| C1, C2 | Nguyễn Văn A 0901234567; Trần Thị B 0912345678 |
| V1, V2 | 51A-123.45 Toyota Vios (C1); 59B-678.90 Honda City (C2) |
| S1, S2, S3 | Thay dầu 200.000; Rửa xe 50.000; Sơn dặm 300.000 (tạm ngưng) |
| P1–P4 | Lọc dầu 150.000 tồn 10/min 5; Má phanh 400.000 tồn 5/min 5; Bugi 80.000 tồn 0/min 3; Dầu nhớt 120.000 tồn 6/min 5 |
| O1 | C1/V1, `tiep_nhan`, rỗng |
| O2 | C1/V1, `hoan_thanh`, S1×1 + P1×2 = 500.000 |
| O3 | C2/V2, `da_thanh_toan`, S2×1 = 50.000, đã có hoá đơn (id 1) |
| O4 | C2/V2, `huy` |
| O5 | C2/V2, `dang_sua`, P2×1 = 400.000 |

## 5. Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `Chưa có bảng` khi seed | Chạy backend ít nhất một lần trước |
| `ECONNREFUSED ...:5433` | Docker Desktop chưa mở, hoặc chưa chạy `npm run db:up` |
| `EADDRINUSE :3000` | Một backend khác đang chạy; tắt nó đi |
| Test UI gọi lên `onrender.com` | Thiếu `cy.useLocalApi()` trong `beforeEach` |
| Không có thư mục `coverage` | Backend bị tắt bằng cách đóng cửa sổ; phải dùng Ctrl+C hoặc `npm run backend:stop` |
