# Garage Management – Chạy kiểm thử Cypress

Áp dụng cho repo nhóm **[kimvux/Test---GarageManagement](https://github.com/kimvux/Test---GarageManagement/tree/test)**, nhánh **`test`**, mã nguồn gốc `ba91fa7f7cffd18e691b7ad66e79bf25aed0c460`.

Bộ test dùng **Express thật + PostgreSQL test local**, không giả lập API. Toàn bộ thay đổi nằm trong `tests/`; không sửa `backend/` hoặc `frontend/`, không tạo `cypress/` ở gốc và không sử dụng bộ `live-smoke` cũ.

**Chạy hằng ngày: mở Docker Desktop → mở terminal ở `tests/` → `npm test`.** Lệnh tự bật CSDL test, chạy backend và frontend, chờ sẵn sàng, chạy Cypress rồi dừng các server do nó mở. Không cần mở ba terminal, đặt cờ `CYPRESS_*`, sửa `.cy.js` hoặc thay URL trong frontend.

> Hiện ứng dụng còn lỗi: lần xác minh ngày **11/11/2026** chạy 82 ca, **56 Pass / 26 Fail / 0 Pending / 0 Skipped**. Fail có bằng chứng ở [BUG_REPORT.md](BUG_REPORT.md); không thay expected để ép Pass. Một số quy tắc biên và mã TC mới còn chờ file Excel của nhóm, được chỉ rõ trong [TRACEABILITY.md](TRACEABILITY.md).

## 1. Chuẩn bị và cài một lần

Cần **Git**, **Node.js từ 22 trở lên** (Node 24 đang dùng được), **Docker Desktop** đã chạy và kết nối Internet để tải dependency/Cypress/image PostgreSQL lần đầu. Cypress chạy bằng Electron đi kèm, không bắt buộc cài Chrome, PostgreSQL hoặc nodemon riêng.

### Nếu chưa có repo nhóm

Mở **CMD hoặc PowerShell** ở thư mục muốn đặt dự án:

```text
git clone --branch test --single-branch https://github.com/kimvux/Test---GarageManagement.git
cd Test---GarageManagement
```

### Áp dụng gói sửa này

Giải nén `GarageManagement_Cypress_Lab3_Fix.zip` vào **thư mục gốc của repo nhóm**. Gộp thư mục `tests` và đồng ý thay các file tương ứng. Kết quả đúng là `Test---GarageManagement/tests/README.md`, **không phải** `tests/tests/README.md`. Nếu đã sửa các file test khác trong máy, lưu phần sửa đó trước khi thay file trùng tên.

Nếu đang dùng bản clone cũ của `luongng527/GarageManagement`, hãy tạo bản clone repo nhóm như lệnh trên để tránh chạy lẫn bộ test cũ. Gói sửa chỉ cung cấp thư mục `tests/`.

### Cài đặt

Từ gốc repo, chạy:

```text
cd tests
node -v
npm ci
npm run setup
npm run check
npm test
```

- `npm ci`: cài đúng phiên bản theo `tests/package-lock.json`.
- `npm run setup`: cài dependency backend bằng `npm ci`, tạo `.env.test` từ mẫu nếu thiếu và xác minh Cypress binary.
- `npm run check`: kiểm tra cú pháp toàn bộ JavaScript test, mã đầu tiêu đề, `.only/.skip`, helper cũ và `useLocalApi`. Đây là kiểm tra tĩnh, không thay thế việc chạy Cypress.
- `npm test`: tự chuẩn bị và chạy bộ giữa kỳ; lần đầu Docker cần tải image `postgres:16`.

Chỉ chạy các lệnh này tại `tests/`. **Không chạy `npm install` tại gốc repo**, vì gốc không có `package.json`.

## 2. Mỗi lần chạy test

Mở Docker Desktop. Tại thư mục `Test---GarageManagement/tests`, chọn một lệnh:

| Lệnh | Phạm vi | Số lượt test hiện tại |
|---|---|---:|
| `npm test` | P1: AUTH có sẵn + ORD + PRT + INV, cả API và UI | 82 |
| `npm run test:api` | 4 file API, không cần mở frontend | 72 |
| `npm run test:ui` | 4 file UI dùng backend/CSDL thật | 10 |
| `npm run cy:open` | Tự mở môi trường và cửa sổ Cypress để xem thao tác/quay video | Chọn spec trong Cypress |
| `npm run test:dashboard` | 5 yêu cầu dashboard ở giai đoạn 2, chạy riêng | 5 |

**Không cần chạy lại `setup`/`npm ci` mỗi ngày**, trừ khi thay dependency/lockfile hoặc đổi máy. Không chạy hai phiên cùng lúc vì chúng cùng seed một CSDL; runner có khóa để phát hiện trường hợp này.

Trong `cy:open`, chọn **E2E Testing → Electron/Chrome → spec muốn xem**. Đóng ứng dụng Cypress để kết thúc phiên; runner sẽ dừng backend/frontend. Với lần chạy tự động, chờ dòng `Run Finished`; muốn dừng sớm thì **Ctrl+C**.

CSDL Docker được giữ để lần sau khởi động nhanh. Muốn tắt CSDL sau khi đã kết thúc test:

```text
npm run db:stop
```

Mỗi ca gọi `cy.task('db:seed')` trong `beforeEach`, nên không phụ thuộc ca trước. Runner cũng seed lại sau khi kết thúc phiên, kể cả khi có test Fail. Nếu bị tắt cưỡng bức, ca đầu của lần chạy kế tiếp vẫn seed lại. Không dùng `docker rm` hoặc tự xóa dữ liệu để chữa lỗi assertion.

### Môi trường được dùng

| Thành phần | Cấu hình cố định cho test |
|---|---|
| Container PostgreSQL | `autogara-test`, image `postgres:16` |
| CSDL | `autogara_test`, host `localhost`, port `5433` |
| Tài khoản CSDL test | `postgres / postgres`, chỉ là thông tin local công khai |
| Backend | `http://localhost:3000` |
| Frontend | `http://localhost:5500` |
| Cấu hình | `tests/.env.test`, có mẫu `tests/.env.test.example` |

Runner truyền cấu hình test rõ ràng vào backend và Cypress, ghi đè các biến cũ từ terminal. Seed từ chối CSDL ngoài `localhost/127.0.0.1:5433/autogara_test`. Không có cờ bật/tắt việc ghi DB, tài khoản live hoặc URL Neon.

**Khi test UI, chỉ thao tác trong cửa sổ do Cypress mở.** `cy.useLocalApi()` chuyển request của frontend đến backend local, rồi chuyển tiếp request thật. Mở frontend thủ công ngoài Cypress không áp dụng chuyển hướng này vì mã sản phẩm còn hard-code URL remote; không dùng cửa sổ đó để kiểm tra dữ liệu test và không sửa `frontend/script.js` để chạy bộ test này.

### Kết quả và độ phủ

Sau mỗi lần chạy tự động:

| File | Nội dung |
|---|---|
| `reports/latest-results.md` | Kết quả từng test, lỗi assertion và tổng Pass/Fail/Pending/Skipped |
| `reports/latest-results.json` | Cùng kết quả ở dạng JSON để tổng hợp |
| `cypress/screenshots/` | Ảnh khi test thất bại; giữ tại máy để phân tích |
| `coverage/index.html` | Độ phủ backend từ c8, được xuất khi runner dừng backend |

Các file `latest-results` và coverage được ghi đè ở lần chạy sau. Muốn giữ bằng chứng của một lần chạy thì sao chép báo cáo trước khi chạy nhóm khác. Mẫu kết quả đã xác minh được giữ trong `verification/2026-11-11/`.

Đo độ phủ chỉ áp dụng cho `backend/server.js`; tỷ lệ phủ không chứng minh các yêu cầu đều đúng. Mã thoát `1` khi có Fail/Pending/Skipped là kết quả kiểm thử, không đồng nghĩa Cypress hoặc npm bị hỏng.

## 3. Viết test mới

Đặt file API trong **`tests/cypress/e2e/api/`**, file UI trong **`tests/cypress/e2e/ui/`**. Giữ bộ AUTH hiện có; ưu tiên TC-ORD, TC-PRT, TC-INV trong P1. Khách hàng, xe, lịch hẹn, báo cáo tháng 2, nhân viên để giai đoạn 2.

- Tiêu đề bắt đầu bằng **mã TC đúng trong Excel**. Các mã mới trong gói này đang là mã tạm cho đến khi nhóm cung cấp Excel; không coi việc kiểm tra định dạng mã là đã đối chiếu Excel.
- Expected lấy từ SRS/TC được duyệt. Với quy tắc biên chưa được tài liệu nói rõ, xem và chốt tại `TRACEABILITY.md`.
- Mỗi `beforeEach` gọi `cy.task('db:seed')`. Mọi test UI còn phải gọi `cy.useLocalApi()` trước `cy.visit()`/`cy.loginLocal()`.
- Dùng C1/V1/O2/P1… từ seed. Ca kiểm tra tạo mới được phép tạo đúng đối tượng cần kiểm thử; ca sau tự reset, không để các workflow tích lũy bản ghi.
- Dùng `cy.api(...)`, `cy.apiLogin(role)`; không thêm helper cũ hoặc cờ opt-in.
- Không mock response API, không gọi live, không dùng `.skip/.only`, không bắt toàn bộ `uncaught:exception` để che lỗi ứng dụng.
- Chờ request/DOM hoặc kiểm tra dữ liệu thực; không dùng `cy.wait(5000)` để đoán thời gian tải.

| Lệnh | Cách dùng |
|---|---|
| `cy.api(method, url, body, token)` | URL dạng `/api/...`; trả response thật, không tự fail vì 4xx/5xx |
| `cy.apiLogin('quan_ly')` | Đăng nhập admin seed và yield token |
| `cy.apiLogin('nhan_vien_le_tan')` | Đăng nhập lễ tân seed và yield token |
| `cy.useLocalApi()` | Chuyển tiếp request frontend đến Express local; alias chung `@api` |
| `cy.loginLocal()` | Đăng nhập thật, lưu phiên và mở frontend; đợi dashboard/caches sẵn sàng |
| `cy.task('db:seed')` | Reset và nạp lại toàn bộ seed |
| `cy.task('db:query', { sql, params })` | Đọc dữ liệu test để kiểm tra tồn kho, tổng tiền, số bản ghi |
| `cy.task('jwt:sign', { payload, expiresIn })` | Tạo token test, dùng `expiresIn: -1` để kiểm tra hết hạn |

Ví dụ hoàn chỉnh, dùng lại TC-PRT-13, **không thêm bản trùng nếu đã có**:

```javascript
describe('Nhập kho API', () => {
  beforeEach(() => cy.task('db:seed'));

  it('TC-PRT-13 – Nhập kho hợp lệ', () => {
    cy.apiLogin('quan_ly').then(token => {
      cy.api('POST', '/api/parts/1/restock', { qty: 5 }, token)
        .its('status').should('eq', 200);

      cy.task('db:query', {
        sql: 'SELECT stock_qty FROM parts WHERE id=$1',
        params: [1],
      }).then(rows => {
        expect(rows[0].stock_qty).to.eq(15);
      });
    });
  });
});
```

Chạy `npm run check`, rồi `npm run test:api` hoặc `npm run test:ui` sau khi sửa test. Nếu ứng dụng sai kỳ vọng đã duyệt, giữ assertion và cập nhật Bug Report; không sửa thành giá trị ứng dụng đang trả chỉ để Pass.

## 4. Dữ liệu seed

Id khớp ký hiệu trong bộ seed của repo nhóm; mỗi ca bắt đầu lại từ cùng trạng thái này.

| Ký hiệu | Dữ liệu |
|---|---|
| Quản lý | `admin / admin123`, role `quan_ly`, id 1 |
| Lễ tân | `letan1 / letan123`, role `nhan_vien_le_tan`, id 2 |
| C1, C2 | Nguyễn Văn A – 0901234567; Trần Thị B – 0912345678 |
| V1, V2 | 51A-123.45 Toyota Vios (C1); 59B-678.90 Honda City (C2) |
| S1, S2, S3 | Thay dầu 200.000; Rửa xe 50.000; Sơn dặm 300.000 (tạm ngưng) |
| P1 | Lọc dầu: giá 150.000, tồn 10, min 5 |
| P2 | Má phanh: giá 400.000, tồn 5, min 5 |
| P3 | Bugi: giá 80.000, tồn 0, min 3 |
| P4 | Dầu nhớt: giá 120.000, tồn 6, min 5 |
| O1 | C1/V1, `tiep_nhan`, chưa có dịch vụ/phụ tùng, tổng 0 |
| O2 | C1/V1, `hoan_thanh`, S1×1 + P1×2 = 500.000, chưa có hóa đơn |
| O3 | C2/V2, `da_thanh_toan`, S2×1 = 50.000, hóa đơn id 1 |
| O4 | C2/V2, `huy`, tổng 0 |
| O5 | C2/V2, `dang_sua`, P2×1 = 400.000 |

Tồn kho seed là trạng thái khởi đầu đã quy định: P1 vẫn là 10 dù O2 có dòng P1×2. Thêm P1×2 trong một ca làm tồn còn 8; xóa dòng P1×2 seed của O2 làm tồn thành 12. Không tự đổi expected thành 8 hoặc 10 khi kiểm tra hoàn kho.

## 5. Xử lý lỗi mà không sửa file test

| Hiện tượng | Cách xử lý |
|---|---|
| `Could not read package.json` / không có lệnh `test` | Terminal đang sai thư mục. Chuyển vào `Test---GarageManagement/tests` |
| `Docker chưa sẵn sàng` / `docker ENOENT` | Cài và mở Docker Desktop, đợi Engine chạy rồi gọi lại cùng lệnh |
| Container `autogara-test` khác cấu hình | Kiểm tra container đó; bộ chuẩn dùng `postgres:16`, DB `autogara_test`, port 5433. Runner không tự xóa container hoặc dữ liệu |
| `ECONNREFUSED ...5433` | Đợi Docker sẵn sàng, chạy `npm run db:up`, sau đó chạy lại nhóm test |
| Port 3000 hoặc 5500 đang được dùng | Ctrl+C ở terminal backend/frontend cũ; chỉ để runner tự mở server rồi chạy lại. Không cần đổi port trong `.cy.js` |
| Một phiên test khác đang chạy | Đóng Cypress/runner trước rồi chạy lại; không mở hai nhóm song song |
| Cypress chưa có binary | Tại `tests/`: `npx cypress install`, `npx cypress verify` |
| `Cypress App could not be unzipped` | Xóa đúng cache Cypress bằng `npx cypress cache clear`, tải lại bằng `npx cypress install`, rồi `npx cypress verify`; kiểm tra mạng/proxy nếu tải lại vẫn hỏng |
| `Cannot find module ...` | `npm ci` tại `tests/`, sau đó `npm run setup` |
| npm bị PowerShell chặn `npm.ps1` | Dùng CMD hoặc gõ `npm.cmd` thay `npm`; không cần thay chính sách hệ thống để chạy test |
| Assertion `expected 200 to equal 403`, hóa đơn tạo sai, thiếu Thẻ… | Xem `BUG_REPORT.md` và báo cáo thực chạy. Đây là kết quả kiểm thử cần phân tích, không sửa expected để qua |
| API stock lỗi trả 500 dù rollback đúng | Có ca xác minh rollback đạt nhưng fail riêng yêu cầu lỗi 4xx; xem nhóm lỗi hợp đồng API cần chốt trong Bug Report |
| Cần chạy lại sau khi tắt máy | Mở Docker Desktop, `cd .../tests`, `npm test`. Không cần cài lại |

Không dùng giải pháp cũ như sửa `mockGarage.js`, tạo Neon test, bật `allowApiWrites`, chạy `live/01-live-smoke.cy.js` hoặc sửa expected thành “đúng 6 thẻ”. Các bước đó không thuộc bộ test này.

## 6. File cần đưa vào Git

Toàn bộ mã và hướng dẫn ở `tests/`, gồm lockfile, mẫu env local, các `.cy.js`, support, scripts, Bug Report, traceability và bản kết quả xác minh. Giữ `.gitignore` của `tests/` để bỏ qua `node_modules`, coverage, báo cáo phát sinh, khóa phiên và ảnh/video.

`tests/.env.test` hiện có trong repo chỉ chứa thông tin Docker local công khai. Không đặt URL DB thật, mật khẩu thật hoặc token vào đó rồi commit.

Từ gốc repo, kiểm tra trước khi commit:

```text
git status
git diff -- tests
```

Sau khi đã xem thay đổi, có thể commit riêng `tests/`. Không cần thêm hoặc đổi bất kỳ file nào trong `backend/`, `frontend/` hay cấu hình deploy để dùng gói này.

Giới hạn xác minh cụ thể và kết quả từng nhóm nằm trong [VERIFICATION.md](VERIFICATION.md). File Excel Test Case chưa được cung cấp, nên chưa thể xác nhận ánh xạ mã TC mới hoặc tuyên bố đã phủ toàn bộ Excel.
