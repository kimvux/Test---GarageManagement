# Chạy test Garage Management

Bộ test dành cho [repo nhóm kimvux/Test---GarageManagement, nhánh test](https://github.com/kimvux/Test---GarageManagement/tree/test), đã đối chiếu **82 mã TC trong [Test Case.xlsx.pdf](references/Test%20Case.xlsx.pdf)**: AUTH20, ORD22, PRT22, INV18; gồm **77 API và 5 UI**. Dashboard là nhóm bổ sung chạy riêng.

**Mỗi lần test: mở Docker Desktop → vào `tests/` → `npm test`.** Runner tự bật PostgreSQL Docker, mở backend/frontend local, seed, chạy Cypress, lưu kết quả và dừng backend/frontend. Không cần sửa `.cy.js`, đổi URL hoặc mở nhiều terminal.

## 1. Cài một lần

Cần **Node.js 22 trở lên**, **Docker Desktop** đã mở và Internet để tải dependency/Cypress/image lần đầu. Không cần cài PostgreSQL riêng; Cypress có sẵn Electron, không bắt buộc Chrome.

**Dùng ZIP bàn giao:** giải nén `GarageManagement_Cypress_Lab3.zip` vào **thư mục mới**, mở terminal trong `GarageManagement/tests`. Gói gồm mã ứng dụng nguyên trạng từ repo nhóm và test đã sửa. Thư mục mới tránh sót spec cũ đã bỏ như `ui/parts.cy.js` hoặc `live/01-live-smoke.cy.js`.

**Đang làm trên repo nhóm:** có thể áp dụng `garage-tests.patch` đi kèm từ gốc bản clone sạch tại commit `a408c91f5234dc74e0de913095ca53d7a79e9156`:

```text
git switch test
git apply --check DUONG_DAN_TOI_FILE/garage-tests.patch
git apply DUONG_DAN_TOI_FILE/garage-tests.patch
cd tests
```

Nếu patch báo xung đột, lưu công việc đang làm và dùng ZIP ở thư mục mới để chạy. Không ghi đè mã đang sửa hoặc dùng repo cũ `luongng527/GarageManagement`.

Tại **`tests/`**, chạy lần lượt:

```text
npm ci
npm run setup
npm test
```

`npm ci` cài đúng lockfile test. `setup` cài dependency backend, tạo `.env.test` nếu thiếu và xác minh Cypress. `npm test` tự kiểm tra cú pháp và mã TC trước khi chạy. **Không chạy npm tại gốc repo**, vì gốc không có `package.json`.

Linux cần Xvfb và thư viện hệ thống theo [prerequisite chính thức của Cypress](https://docs.cypress.io/app/get-started/install-cypress#Linux-Prerequisites). Nếu setup báo thiếu thư viện, cài prerequisite rồi chạy lại setup; không sửa spec để chữa lỗi môi trường.

## 2. Những lần sau

Mở Docker Desktop, vào `tests/`, chọn một lệnh. **Chỉ chạy một phiên tại một thời điểm**, vì các test cùng reset CSDL.

| Lệnh | Phạm vi | Số TC |
|---|---|---:|
| `npm test` | Toàn bộ PDF, gồm cả ca ưu tiên P2/P3 | 82 |
| `npm run test:orders` | TC-ORD, API và UI | 22 |
| `npm run test:parts` | TC-PRT, API đúng mức trong PDF | 22 |
| `npm run test:invoices` | TC-INV, API và UI | 18 |
| `npm run test:auth` | TC-AUTH có sẵn | 20 |
| `npm run test:api` | Toàn bộ API | 77 |
| `npm run test:ui` | Đăng nhập, phiếu, hóa đơn | 5 |
| `npm run cy:open` | Mở cửa sổ Cypress để chọn spec, xem thao tác | Tùy chọn |
| `npm run test:dashboard` | 5 thẻ theo SRS3.8.1, giai đoạn2 | 5 |
| `npm run check` | Cú pháp, vị trí, mã thiếu/trùng, helper | Không chạy app |

Trong `cy:open`: **E2E Testing → Electron/Chrome → spec**. Đóng Cypress để kết thúc phiên. Với chạy tự động, chờ `Run Finished`; Ctrl+C để dừng sớm. Không cần cài lại mỗi ngày, trừ khi đổi máy hoặc dependency.

PostgreSQL được giữ để lần sau khởi động nhanh. Muốn tắt container sau test: `npm run db:stop`.

## 3. Viết hoặc sửa test

Đặt API trong `tests/cypress/e2e/api/`, UI trong `tests/cypress/e2e/ui/`. [TRACEABILITY.md](TRACEABILITY.md) ghi đúng mã, dữ liệu, expected, mức và ưu tiên từng ca từ PDF.

- Tiêu đề bắt đầu bằng mã đúng hàng trong PDF, ví dụ `TC-PRT-13 – Nhập kho số lượng 0`; không gán mã cũ cho nội dung khác.
- Mỗi `beforeEach` gọi `cy.task('db:seed')`. UI thêm `cy.useLocalApi()` trước khi mở trang.
- Dùng C1/V1/O2/P1… từ seed. TC-ORD-20/21 và TC-INV-10/15 tự chuẩn bị tiền điều kiện, không phụ thuộc ca trước.
- Expected theo PDF/SRS. Nếu ứng dụng sai, giữ assertion và ghi Bug Report. Chỉ chấp nhận nhiều kết quả khi PDF cho phép, như PRT06/08 và ORD05/16.
- Dùng `cy.api(method, url, body, token)` và `cy.apiLogin('quan_ly')` hoặc `cy.apiLogin('nhan_vien_le_tan')`; chỉ có hai vai trò này.
- Không mock response, không gọi Render/Neon, không cờ bật/tắt ghi DB, không `.skip/.only`, không bắt toàn bộ `uncaught:exception`. Chờ request/DOM, không dùng `cy.wait(5000)`.
- Khi thêm TC mới được duyệt, cập nhật danh mục ở `scripts/check-tests.js`, số lượng nhóm ở `scripts/run.js` và traceability. Danh mục hiện cố định 82 mã PDF để phát hiện thiếu/trùng hoặc mã tạm.

Ví dụ đã có trong bộ test; không thêm bản trùng:

```javascript
describe('Nhập kho API', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-PRT-13 – Nhập kho số lượng 0', () => {
    cy.apiLogin('quan_ly').then(token => {
      cy.api('POST', '/api/parts/1/restock', { qty: 0 }, token)
        .then(res => {
          expect(res.status).to.eq(400);
          expect(res.body.error).to.eq('Số lượng không hợp lệ');
        });
    });
  });
});
```

Sau sửa: `npm run check`, chạy nhóm liên quan, ví dụ `npm run test:parts`. Trước bàn giao chạy `npm test`.

## 4. Đọc kết quả

| File | Nội dung |
|---|---|
| `reports/latest-results.md` | Tổng kết, từng TC và lỗi assertion |
| `reports/latest-results.csv` | Kết quả có mã TC, mở bằng Excel |
| `reports/latest-results.json` | Kết quả có cấu trúc |
| `cypress/screenshots/` | Ảnh khi Fail |
| `coverage/index.html` | Độ phủ backend c8 |

Báo cáo latest bị thay ở lần chạy sau; sao chép trước nếu cần giữ. Nếu Excel không tự tách CSV: **Data → From Text/CSV**, UTF-8, delimiter dấu phẩy. Kết quả bàn giao ở [VERIFICATION.md](VERIFICATION.md); lỗi ứng dụng ở [BUG_REPORT.md](BUG_REPORT.md).

Mã thoát1 khi có Fail/Pending/Skipped. Assertion khác expected cần đọc cùng Bug Report. Lỗi cú pháp/compile, sai selector hay chuỗi lệnh Cypress phải được xử lý trong test trước khi kết luận lỗi sản phẩm.

Tệp đính kèm là **PDF xuất từ Excel**, không có workbook `.xlsx` gốc để sửa trực tiếp. Cypress/traceability đã đối chiếu PDF; CSV giúp cập nhật sheet gốc. Các dòng `#ERROR!`, “Phân tích code” và ví dụ bug trong PDF không được dùng làm kết quả thực chạy.

## 5. Môi trường và seed

| Thành phần | Cấu hình test |
|---|---|
| PostgreSQL Docker | `autogara-test`, `postgres:16`, `127.0.0.1:5433` |
| Database | `autogara_test`, tài khoản local công khai `postgres/postgres` |
| Backend / Frontend | `http://localhost:3000` / `http://localhost:5500` |
| Cấu hình | `tests/.env.test`, mẫu `.env.test.example` |
| Quản lý / Lễ tân | `admin/admin123` / `letan1/letan123` |

Seed chỉ nhận DB local cổng5433 tên `autogara_test`. Runner truyền môi trường test vào backend/Cypress, reset trước mỗi ca và cuối phiên, giải phóng cổng server khi xong.

| Ký hiệu | Sau seed |
|---|---|
| C1/V1 | Nguyễn Văn A; 51A-123.45, Toyota Vios |
| C2/V2 | Trần Thị B; 59B-678.90, Honda City |
| S1/S2/S3 | Thay dầu200.000; Rửa xe50.000; Sơn dặm300.000, tạm ngưng |
| P1/P2/P3/P4 | Lọc dầu10/min5; Má phanh5/5; Bugi0/3; Dầu nhớt6/5 |
| O1 | Tiếp nhận, rỗng, tổng0 |
| O2 | Hoàn thành, S1×1 + P1×2, tổng500.000, chưa hóa đơn |
| O3 | Đã thanh toán, S2×1, tổng50.000, hóa đơn1 |
| O4 | Hủy, tổng0 |
| O5 | Đang sửa, P2×1, tổng400.000 |

P1 sau seed vẫn tồn10, đúng PDF. Xóa P2×1 khỏi O5 làm tồnP2 từ5 lên6; không tự trừ tồn seed theo các dòng phiếu đã có.

UI phải chạy trong cửa sổ Cypress: `cy.useLocalApi()` chuyển tiếp request thật về local. Mở frontend thủ công bên ngoài Cypress không có chuyển hướng này. Mã sản phẩm được giữ nguyên; toàn bộ thay đổi test ở `tests/`.

## 6. Khắc phục lỗi chạy

| Thông báo | Cách xử lý |
|---|---|
| Không có package.json / lệnh test | Chuyển vào `GarageManagement/tests` |
| Docker chưa sẵn sàng / docker ENOENT | Cài/mở Docker Desktop, đợi Engine rồi chạy lại |
| Container autogara-test khác cấu hình | Đối chiếu bảng môi trường; runner không tự xóa container có sẵn |
| Cổng3000/5500 bận | Ctrl+C server cũ, chạy lại cùng lệnh |
| Một phiên khác đang chạy | Đóng Cypress/runner trước; không chạy song song |
| Cannot find module | `npm ci`, rồi `npm run setup` tại tests |
| Thiếu Cypress binary | `npx cypress install`, `npx cypress verify` |
| Cypress tải/giải nén lỗi | `npx cypress cache clear`, `npx cypress install`, `npx cypress verify`; kiểm tra mạng nếu vẫn lỗi |
| PowerShell chặn npm.ps1 | Dùng CMD hoặc `npm.cmd` thay `npm` |
| expected200 to equal400/403 | Đọc kết quả và Bug Report; không đổi expected theo code để ép Pass |
| Chạy lại sau tắt máy | Mở Docker Desktop → vào tests → npm test |

Khi commit, đưa mã test, lockfile, hướng dẫn và verification vào Git. `.gitignore` đã loại node_modules, coverage, báo cáo phát sinh, ảnh và khóa phiên.
