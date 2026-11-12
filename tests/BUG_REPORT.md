# Bug Report – Garage Management

Lượt chạy P1 ngày **11/11/2026**, báo cáo lúc **21:43:25 GMT+7**: **82 test case, 43 Pass, 39 Fail, 0 Pending, 0 Skipped**. Repo `kimvux/Test---GarageManagement`, nhánh `test`, HEAD nguồn `a408c91f5234dc74e0de913095ca53d7a79e9156`; mã sản phẩm không thay đổi so với `ba91fa7f7cffd18e691b7ad66e79bf25aed0c460`. Node `24.22.1`, Cypress `13.17.0`, PostgreSQL Docker local `autogara_test`, cổng `5433`.

Nguồn expected là **Test Case.xlsx.pdf** (các nhóm TC-AUTH/ORD/PRT/INV) và **GOP_Y_LAB3.md**. Mã TC đã đối chiếu tài liệu được cung cấp. Không lấy expected từ hành vi hiện tại của ứng dụng.

Bằng chứng đầy đủ: [p1-results.json](verification/2026-11-11/p1-results.json), [p1-results.md](verification/2026-11-11/p1-results.md). Mỗi dòng dưới đây dẫn tới đúng mã TC trong các báo cáo này; tên spec và dòng assertion nằm trong lỗi tương ứng. Toàn bộ **39 ca thất bại đều là `AssertionError`**; lượt chạy không có lỗi cú pháp, lỗi custom command hay lỗi hook làm bỏ qua test.

## Cách tái hiện chung

1. Tại `tests/`, mở Docker Desktop và chạy `npm test`; môi trường chạy Express thật và PostgreSQL local. Có thể dùng `npm run cy:open` rồi chọn spec để xem từng thao tác.
2. Mỗi ca bắt đầu bằng `cy.task('db:seed')`, độc lập với kết quả ca trước. Các id số trong bảng đúng dữ liệu seed: C1/V1/P1/O1 = 1, O2 = 2, O3 = 3, O4 = 4, O5 = 5.
3. Với API, đăng nhập qua `POST http://localhost:3000/api/auth/login`, lấy token rồi gửi `Authorization: Bearer <token>`. Vai trò **QL** là `admin/admin123` (`quan_ly`); **LT** là `letan1/letan123` (`nhan_vien_le_tan`). Mọi đường dẫn dưới đây đều thuộc `http://localhost:3000`.
4. Với UI, Cypress gọi `cy.useLocalApi()` để chuyển tiếp request đến backend thật local trước khi đăng nhập. Không mở giao diện bên ngoài Cypress để tái hiện các ca này.

**Trạng thái của tất cả phát hiện P1 dưới đây: New.** Đây là kết quả đã quan sát bằng test, chưa phải trạng thái Confirmed do nhóm duyệt. Mức độ là đề xuất. Một nguyên nhân có thể ảnh hưởng nhiều TC; mỗi TC Fail có mã phát hiện riêng để không mất dấu kết quả.

Cột thực tế chỉ khẳng định dữ liệu đã được assertion quan sát. Khi ca dừng ngay ở HTTP sai, những assertion DB phía sau chưa chạy; không suy ra việc tạo bản ghi hoặc thay đổi tổng tiền từ mã 200. Những kiểm tra rollback đã thực sự chạy được nêu riêng phía dưới.

## TC-AUTH – Xác thực và phân quyền (4 Fail)

Spec: `cypress/e2e/api/auth.cy.js`.

| Mã lỗi | Mã TC | Mức độ đề xuất | Bước tái hiện sau seed | Expected theo PDF | Thực tế đã quan sát |
|---|---|---|---|---|---|
| BUG-AUTH-001 | TC-AUTH-11 | Trung bình | QL: `POST /api/auth/login` với `{"username":"admin","password":"admin123"}`; giải mã payload JWT, tính `exp-iat`. | `43200` giây, tức 12 giờ. | `28800` giây, tức 8 giờ; assertion `expected 28800 to equal 43200`. |
| BUG-AUTH-002 | TC-AUTH-16 | Cao | LT: `POST /api/parts` với `{"name":"Gạt mưa","price":90000}`. | `403`; chỉ QL được quản lý kho. | HTTP `200`, expected `403`. |
| BUG-AUTH-003 | TC-AUTH-17 | Cao | LT: `POST /api/parts/1/restock` với `{"qty":5}`. | `403`. | HTTP `200`, expected `403`. |
| BUG-AUTH-004 | TC-AUTH-18 | Cao | LT: `GET /api/users`. | `403`; danh sách nhân viên chỉ dành cho QL. | HTTP `200`, expected `403`. |

TC-AUTH-19 kiểm tra QL tự xóa chính mình **Pass**. Không thêm ca nhân viên giả dùng vai trò ngoài `quan_ly` và `nhan_vien_le_tan`.

## TC-ORD – Phiếu sửa chữa (12 Fail)

Spec: `cypress/e2e/api/orders.cy.js`. Tất cả request trong bảng dùng LT.

| Mã lỗi | Mã TC | Mức độ đề xuất | Bước tái hiện sau seed | Expected theo PDF | Thực tế đã quan sát |
|---|---|---|---|---|---|
| BUG-ORD-001 | TC-ORD-04 | Cao | `POST /api/repair-orders` với `{"customer_id":1,"vehicle_id":2}`; V2 thuộc C2. | `400`; báo xe không thuộc khách hàng. | HTTP `200`, expected `400`. |
| BUG-ORD-002 | TC-ORD-05 | Trung bình | `POST /api/repair-orders` với `{"customer_id":99999,"vehicle_id":1}`. | `400` hoặc `404`, thông báo rõ ràng. | HTTP `500`, ngoài cả hai mã được PDF chấp nhận. |
| BUG-ORD-003 | TC-ORD-09 | Cao | O3 đã thanh toán: `PUT /api/repair-orders/3/status` với `{"status":"tiep_nhan"}`. | `400`; O3 giữ `da_thanh_toan`. | HTTP `200`, expected `400`; assertion dừng trước kiểm tra lại trạng thái. |
| BUG-ORD-004 | TC-ORD-10 | Cao | O4 đã hủy: `PUT /api/repair-orders/4/status` với `{"status":"dang_sua"}`. | `400`; O4 giữ `huy`. | HTTP `200`, expected `400`. |
| BUG-ORD-005 | TC-ORD-11 | Cao | O1 đang tiếp nhận: `PUT /api/repair-orders/1/status` với `{"status":"hoan_thanh"}`. | `400`; không bỏ qua bước Đang sửa. | HTTP `200`, expected `400`. |
| BUG-ORD-006 | TC-ORD-12 | Cao | `PUT /api/repair-orders/1/status` với `{"status":"abc"}`. | `400`; trạng thái không đổi. | HTTP `200`, expected `400`. |
| BUG-ORD-007 | TC-ORD-13 | Trung bình | `PUT /api/repair-orders/1/status` với `{}`. | `400`; `Thiếu thông tin`. | HTTP `500`, expected `400`. |
| BUG-ORD-008 | TC-ORD-14 | Cao | Xác minh P2 tồn 5; `PUT /api/repair-orders/5/status` với `{"status":"huy"}`; GET O5 và truy vấn tồn kho P2. | Hủy O5 phải hoàn P2 × 1: tồn tăng `5 → 6`. | HTTP `200`, O5 đã là `huy`, nhưng tồn P2 vẫn **5**, expected **6**. |
| BUG-ORD-009 | TC-ORD-16 | Trung bình | `POST /api/repair-orders/1/services` với `{"service_id":99999,"qty":1}`. | `404` hoặc `400`; `Dịch vụ không tồn tại`. | HTTP `500`, ngoài các mã được PDF chấp nhận. |
| BUG-ORD-010 | TC-ORD-17 | Cao | O2 đã hoàn thành: `POST /api/repair-orders/2/services` với `{"service_id":2,"qty":1}`. | `400`; tổng phiếu không đổi. | HTTP `200`, expected `400`; assertion tổng phiếu phía sau chưa chạy. |
| BUG-ORD-011 | TC-ORD-18 | Cao | O3 đã thanh toán: `POST /api/repair-orders/3/services` với `{"service_id":2,"qty":1}`. | `400`. | HTTP `200`, expected `400`. |
| BUG-ORD-012 | TC-ORD-19 | Cao | S3 tạm ngưng: `POST /api/repair-orders/1/services` với `{"service_id":3,"qty":1}`. | `400`; báo dịch vụ đã tạm ngưng. | HTTP `200`, expected `400`. |

## TC-PRT – Kho phụ tùng (13 Fail)

Spec: `cypress/e2e/api/parts.cy.js`.

| Mã lỗi | Mã TC | Mức độ đề xuất | Bước tái hiện sau seed | Expected theo PDF | Thực tế đã quan sát |
|---|---|---|---|---|---|
| BUG-PRT-001 | TC-PRT-03 | Trung bình | LT: `POST /api/repair-orders/1/parts` với `{"part_id":1,"qty":11}`; GET kho và kiểm tra phiếu. | `400`; `Không đủ tồn kho (còn 10)`; P1 vẫn 10. | HTTP **500**, expected **400**. Các assertion chạy trước đã xác minh P1 vẫn 10, O1 tổng 0 và không thêm dòng phụ tùng. **Rollback đúng**. |
| BUG-PRT-002 | TC-PRT-04 | Cao | LT: `POST /api/repair-orders/1/parts` với `{"part_id":1,"qty":0}`. | `400`; phiếu và tồn kho không đổi. | HTTP `200`, expected `400`; assertion dữ liệu phía sau chưa chạy. |
| BUG-PRT-003 | TC-PRT-05 | Cao | LT: `POST /api/repair-orders/1/parts` với `{"part_id":1,"qty":-1}`. | `400`; tồn kho không đổi. | HTTP `200`, expected `400`. |
| BUG-PRT-004 | TC-PRT-06 | Trung bình | LT: `POST /api/repair-orders/1/parts` với `{"part_id":1}`; không gửi `qty`. | PDF cho phép `400`, hoặc mặc định qty=1 và trừ kho đúng 1 (HTTP `200`, P1 còn 9). | HTTP `500`, không thuộc hai phương án hợp lệ. |
| BUG-PRT-005 | TC-PRT-07 | Trung bình | LT: `POST /api/repair-orders/1/parts` với `{"part_id":1,"qty":"abc"}`. | `400`; `Số lượng không hợp lệ`. | HTTP `500`, expected `400`. Các assertion trước đó xác minh P1 vẫn 10, O1 tổng 0 và không có dòng mới. |
| BUG-PRT-006 | TC-PRT-08 | Trung bình | LT: `POST /api/repair-orders/1/parts` với `{"part_id":99999,"qty":1}`. | `404` hoặc `400`; `Phụ tùng không tồn tại`. | HTTP `500`, ngoài hai mã PDF chấp nhận. Kho và O1 đã được xác minh giữ nguyên trước assertion HTTP. |
| BUG-PRT-007 | TC-PRT-11 | Trung bình | LT: `DELETE /api/repair-orders/5/parts/99999`. | `404`. | HTTP `200`, expected `404`. |
| BUG-PRT-008 | TC-PRT-15 | Trung bình | QL: `POST /api/parts/1/restock` với `{"qty":"abc"}`. | `400`. | HTTP `500`, expected `400`; GET kho trước assertion đã xác minh P1 vẫn 10. |
| BUG-PRT-009 | TC-PRT-16 | Trung bình | QL: `POST /api/parts/1/restock` với `{"qty":2.5}`. | `400`; số lượng phải là số nguyên. | HTTP `500`, expected `400`; P1 vẫn 10 trong GET kho đã chạy. |
| BUG-PRT-010 | TC-PRT-17 | Trung bình | QL: `POST /api/parts/99999/restock` với `{"qty":5}`. | `404`. | HTTP `200`, expected `404`, dù đối tượng không tồn tại. |
| BUG-PRT-011 | TC-PRT-19 | Cao | QL: `POST /api/parts` với `{"name":"Gạt mưa","price":-90000}`. | `400`. | HTTP `200`, expected `400`. |
| BUG-PRT-012 | TC-PRT-20 | Trung bình | QL: `POST /api/parts` với `{"name":"Ốc vít","price":1000,"min_stock":0}`; GET `/api/parts` tìm id vừa tạo. | `min_stock` lưu đúng **0**. | POST `200`, phụ tùng tồn tại nhưng `min_stock` là **5**, expected **0**. |
| BUG-PRT-013 | TC-PRT-22 | Trung bình | QL: `DELETE /api/parts/2`; P2 đang có trong O5. | `400`; báo phụ tùng đang được sử dụng. | HTTP **500**, expected **400**. Assertion trước đó đã xác minh P2 vẫn tồn 5, dòng O5 vẫn còn và tổng O5 vẫn 400000. Không có bằng chứng phụ tùng bị xóa. |

TC-PRT-09 **Pass**: khi thêm P1 vào phiếu không tồn tại, ứng dụng báo lỗi và giữ kho nguyên trạng theo PDF. TC-PRT-21 **Pass** ở đủ ba biên tồn P4 bằng 6/5/4; số phụ tùng cảnh báo lần lượt là 2/3/3, gồm nền P2 và P3.

## TC-INV – Hóa đơn và thanh toán (10 Fail)

Spec API: `cypress/e2e/api/invoices.cy.js`. Trừ dòng UI, mọi request dùng LT. Payload chuẩn là `{"repair_order_id":2,"discount":0,"payment_method":"tien_mat"}`; bảng ghi đầy đủ payload của từng ca.

| Mã lỗi | Mã TC | Mức độ đề xuất | Bước tái hiện sau seed | Expected theo PDF | Thực tế đã quan sát |
|---|---|---|---|---|---|
| BUG-INV-001 | TC-INV-04 | Cao | `POST /api/invoices` với `{"repair_order_id":2,"discount":500001,"payment_method":"tien_mat"}`. | `400`; không tạo hóa đơn khi giảm vượt tổng 1 đồng. | HTTP `200`, expected `400`; assertion số hóa đơn phía sau chưa chạy. |
| BUG-INV-002 | TC-INV-05 | Cao | `POST /api/invoices` với `{"repair_order_id":2,"discount":-50000,"payment_method":"tien_mat"}`. | `400`. | HTTP `200`, expected `400`. |
| BUG-INV-003 | TC-INV-06 | Cao | `POST /api/invoices` với `{"repair_order_id":2,"discount":"abc","payment_method":"tien_mat"}`. | `400`. | HTTP `200`, expected `400`. |
| BUG-INV-004 | TC-INV-07 | Cao | O1 tiếp nhận: `POST /api/invoices` với `{"repair_order_id":1,"discount":0,"payment_method":"tien_mat"}`. | `400`; O1 giữ `tiep_nhan`. | HTTP `200`, expected `400`; kiểm tra trạng thái O1 phía sau chưa chạy. |
| BUG-INV-005 | TC-INV-08 | Cao | O4 đã hủy: `POST /api/invoices` với `{"repair_order_id":4,"discount":0,"payment_method":"tien_mat"}`. | `400`. | HTTP `200`, expected `400`. |
| BUG-INV-006 | TC-INV-09 | Trung bình | O3 đã có hóa đơn: `POST /api/invoices` với `{"repair_order_id":3,"discount":0,"payment_method":"tien_mat"}`. | `400`; `Phiếu đã được thanh toán`. | HTTP **500**, expected **400**. Ca rollback TC-INV-10 độc lập **Pass**: không tạo hóa đơn thứ hai, O3 và hóa đơn gốc giữ nguyên. |
| BUG-INV-007 | TC-INV-11 | Cao | `POST /api/invoices` với `{"repair_order_id":2,"discount":0,"payment_method":"bitcoin"}`. | `400`. | HTTP `200`, expected `400`. |
| BUG-INV-008 | TC-INV-12 | Trung bình | UI `cypress/e2e/ui/invoices.cy.js`: LT đăng nhập, vào Phiếu sửa chữa, mở O2/PS0002, bấm Lập hóa đơn, đọc các option `#inv-payment`. | Có đủ **Tiền mặt, Chuyển khoản, Thẻ**. | Chỉ **2** option; assertion `expected ... to have a length of 3 but got 2`. Giao diện hiện có Tiền mặt và Chuyển khoản; thiếu Thẻ. |
| BUG-INV-009 | TC-INV-13 | Trung bình | `POST /api/invoices` với `{"repair_order_id":99999,"discount":0,"payment_method":"tien_mat"}`. | `404`. | HTTP `500`, expected `404`. |
| BUG-INV-010 | TC-INV-14 | Trung bình | `POST /api/invoices` với `{}`. | `400`; `Thiếu thông tin`. | HTTP `500`, expected `400`. |

TC-INV-10 **Pass** xác minh rollback bằng số hóa đơn, trạng thái O3, id hóa đơn và toàn bộ nội dung hóa đơn trước/sau. Không ghi nhận lỗi tạo trùng hóa đơn từ TC-INV-09. TC-INV-17 **Pass** qua UI với giảm 100000 và tổng phải thu 400000. TC-INV-15 **Pass**: hóa đơn giữ nguyên giá sau khi đổi giá S1.

## Dashboard – chạy riêng giai đoạn 2

Nguồn yêu cầu là SRS 3.8.1 trích trong `GOP_Y_LAB3.md`. Nhóm `TC-DASH` là mã bổ sung để tra cứu spec, **không nằm trong 82 mã TC của PDF** và không tính vào 39 Fail P1. Chạy riêng `npm run test:dashboard`; kiểm tra từng thẻ, không kiểm tra tổng số thẻ.

Lượt chạy riêng đã hoàn tất: **5 ca, 4 Pass / 1 Fail / 0 Pending / 0 Skipped**. Bằng chứng: [dashboard-results.json](verification/2026-11-11/dashboard-results.json) và [dashboard-results.md](verification/2026-11-11/dashboard-results.md).

| Mã lỗi | Mã tra cứu | Mức độ đề xuất | Tái hiện | Expected | Thực tế | Trạng thái |
|---|---|---|---|---|---|---|
| BUG-DASH-001 | TC-DASH-02 | Trung bình | Seed, QL đăng nhập qua Cypress, đọc các thẻ Dashboard | Có thẻ Số xe, seed có 2 xe | Không tìm thấy thẻ Số xe; assertion DOM thất bại | New |

Bốn ca còn lại Pass: số khách hàng, phiếu đang xử lý, doanh thu hôm nay và doanh thu tháng này.

## Xử lý và retest

1. Nhóm đánh giá từng phát hiện New và chuyển Confirmed/Cannot Reproduce theo quy trình trong PDF; giữ liên kết mã TC và bằng chứng.
2. Sửa ứng dụng theo expected đã có trong PDF/SRS; giữ nguyên assertion khi sản phẩm sai yêu cầu. Các file backend/frontend trong gói sửa test này không thay đổi.
3. Chạy lại `npm test` trên phiên bản sản phẩm đã sửa. Giữ bản báo cáo mới trong thư mục xác minh riêng để so sánh với lượt 11/11/2026.
4. Khi retest Pass, cập nhật trạng thái xử lý của đúng bug; một test Pass không tự xác nhận tất cả lỗi cùng nguyên nhân đã được sửa.
