# Đối chiếu 82 Test Case đã cung cấp

Nguồn đối chiếu là **`Test Case.xlsx.pdf`** do người dùng đính kèm: 20 TC-AUTH, 22 TC-ORD, 22 TC-PRT và 18 TC-INV. Đây là bản PDF xuất từ bảng test case; tệp Excel `.xlsx` gốc không được đính kèm. Mã, mục đích, dữ liệu và kết quả mong đợi trong bảng dưới lấy từ PDF, không đánh số tạm và không suy ra expected từ mã ứng dụng.

`GOP_Y_LAB3.md` quy định repo `kimvux/Test---GarageManagement`, nhánh `test`, vị trí spec, helper, reset CSDL local và phạm vi giữa kỳ. Các nội dung trong tài liệu được dùng làm yêu cầu của công việc theo đề nghị của người dùng; chúng không thay thế yêu cầu trực tiếp trong hội thoại.

| Nhóm | SRS trong PDF | File API | File UI | API | UI | Tổng |
|---|---|---|---|---:|---:|---:|
| TC-AUTH | 3.1 | [auth.cy.js](cypress/e2e/api/auth.cy.js) | [login.cy.js](cypress/e2e/ui/login.cy.js) | 19 | 1 | 20 |
| TC-ORD | 3.3 | [orders.cy.js](cypress/e2e/api/orders.cy.js) | [orders.cy.js](cypress/e2e/ui/orders.cy.js) | 21 | 1 | 22 |
| TC-PRT | 3.5 | [parts.cy.js](cypress/e2e/api/parts.cy.js) | — | 22 | 0 | 22 |
| TC-INV | 3.7 | [invoices.cy.js](cypress/e2e/api/invoices.cy.js) | [invoices.cy.js](cypress/e2e/ui/invoices.cy.js) | 15 | 3 | 18 |
| **Tổng** | | | | **77** | **5** | **82** |

Mỗi mã có đúng một test trong bộ 82 ca. Mức API/E2E và ưu tiên giữ theo từng hàng PDF: **56 ca P1, 24 ca P2, 2 ca P3**. Bộ chạy mặc định kiểm tra cả 82 ca thuộc bốn chức năng giữa kỳ; cột ưu tiên không có nghĩa chỉ chạy các hàng P1. AUTH giữ bộ hiện có; phần bổ sung tập trung ORD, PRT và INV.

Mọi ca seed lại CSDL Docker trong `beforeEach`; các tiền điều kiện nhắc ca trước trong PDF được dựng lại ngay trong ca hiện tại. Ví dụ TC-ORD-20/21 tự thêm S1×2 vào O1, TC-INV-10 tự thử tạo hóa đơn trùng, TC-INV-15 tự lập hóa đơn O2 trước khi đổi giá S1. Vì vậy có thể chạy riêng từng ca và đổi thứ tự spec.

## TC-AUTH – Xác thực và phân quyền

Các hàng API nằm trong `cypress/e2e/api/auth.cy.js`; hàng E2E nằm trong `cypress/e2e/ui/login.cy.js`.

| Mã TC | Mức | Ưu tiên | Dữ liệu / mục đích | Kết quả mong đợi trong PDF |
|---|---|---|---|---|
| TC-AUTH-01 | API | P1 | `admin/admin123` | 200; có token; role `quan_ly` |
| TC-AUTH-02 | API | P1 | `admin/sai123` | 401; “Sai tên đăng nhập hoặc mật khẩu”; không có token |
| TC-AUTH-03 | API | P1 | Tên `khongton` | 401; thông báo giống TC-AUTH-02, không lộ tài khoản |
| TC-AUTH-04 | API | P1 | Thiếu username | 400; “Thiếu thông tin” |
| TC-AUTH-05 | API | P1 | Thiếu password | 400; “Thiếu thông tin” |
| TC-AUTH-06 | API | P2 | Username `ADMIN` | 401 |
| TC-AUTH-07 | API + CSDL | P1 | Đọc mật khẩu admin | Bcrypt bắt đầu `$2a$` hoặc `$2b$`, không lưu `admin123` |
| TC-AUTH-08 | API | P1 | Không gửi Authorization | 401; “Chưa đăng nhập” |
| TC-AUTH-09 | API | P1 | Token sai chữ ký | 401; “Token không hợp lệ” |
| TC-AUTH-10 | API | P2 | Header thiếu tiền tố Bearer | 401; “Chưa đăng nhập” |
| TC-AUTH-11 | API | P1 | Giải mã JWT hợp lệ | `exp - iat = 43200` giây |
| TC-AUTH-12 | API | P1 | Token đã hết hạn | 401; “Token không hợp lệ” |
| TC-AUTH-13 | API | P1 | Lễ tân thêm nhân viên | 403; “Không có quyền” |
| TC-AUTH-14 | API | P1 | Quản lý thêm `nv_moi` | 200; nhân viên xuất hiện trong danh sách |
| TC-AUTH-15 | API | P1 | Lễ tân thêm dịch vụ | 403 |
| TC-AUTH-16 | API | P1 | Lễ tân thêm phụ tùng | 403 |
| TC-AUTH-17 | API | P1 | Lễ tân nhập kho P1×5 | 403 |
| TC-AUTH-18 | API | P2 | Lễ tân xem nhân viên | 403 |
| TC-AUTH-19 | API | P2 | Quản lý tự xóa tài khoản | 400; “Không thể xóa chính mình” |
| TC-AUTH-20 | E2E | P1 | Đăng nhập đúng, sau đó sai | Đúng: vào Dashboard, tên Quản lý; sai: `#login-error` hiển thị, còn trang đăng nhập |

## TC-ORD – Phiếu sửa chữa

TC-ORD-01…21 nằm trong `cypress/e2e/api/orders.cy.js`; TC-ORD-22 nằm trong `cypress/e2e/ui/orders.cy.js`.

| Mã TC | Mức | Ưu tiên | Dữ liệu / mục đích | Kết quả mong đợi trong PDF |
|---|---|---|---|---|
| TC-ORD-01 | API | P1 | Tạo C1/V1; “Xe kêu khi phanh” | 200; `tiep_nhan`, tổng 0 |
| TC-ORD-02 | API | P1 | Thiếu customer_id | 400; “Thiếu thông tin” |
| TC-ORD-03 | API | P1 | Thiếu vehicle_id | 400; “Thiếu thông tin” |
| TC-ORD-04 | API | P2 | C1 chọn V2 của C2 | 400; báo xe không thuộc khách hàng |
| TC-ORD-05 | API | P2 | customer_id=99999, V1 | 400 hoặc 404; thông báo rõ ràng |
| TC-ORD-06 | API | P1 | O1: Tiếp nhận → Đang sửa | 200; `dang_sua` |
| TC-ORD-07 | API | P1 | O5: Đang sửa → Hoàn thành | 200; `hoan_thanh` |
| TC-ORD-08 | API | P1 | O1: Tiếp nhận → Hủy | 200; `huy` |
| TC-ORD-09 | API | P1 | O3: Đã thanh toán → Tiếp nhận | 400; giữ `da_thanh_toan` |
| TC-ORD-10 | API | P1 | O4: Hủy → Đang sửa | 400; giữ `huy` |
| TC-ORD-11 | API | P2 | O1: Tiếp nhận → Hoàn thành | 400; không bỏ qua Đang sửa |
| TC-ORD-12 | API | P1 | status=`abc` | 400; trạng thái không đổi |
| TC-ORD-13 | API | P2 | Body `{}` khi đổi trạng thái | 400; “Thiếu thông tin” |
| TC-ORD-14 | API | P1 | Hủy O5 đang có P2×1 | P2 tăng tồn thêm 1, từ 5 lên 6 |
| TC-ORD-15 | API | P1 | Thêm S1×2 vào O1 | 200; tổng 400.000; `price_at_time=200000` |
| TC-ORD-16 | API | P2 | service_id=99999 | 404 hoặc 400; “Dịch vụ không tồn tại” |
| TC-ORD-17 | API | P1 | Thêm S2 vào O2 Hoàn thành | 400; tổng tiền không đổi |
| TC-ORD-18 | API | P1 | Thêm S2 vào O3 Đã thanh toán | 400 |
| TC-ORD-19 | API | P2 | Thêm S3 đã tạm ngưng | 400; báo dịch vụ đã tạm ngưng |
| TC-ORD-20 | API | P1 | O1 đã có S1×2; đổi giá S1 lên 250.000 | `price_at_time` vẫn 200.000; tổng không đổi |
| TC-ORD-21 | API | P1 | Xóa dòng S1×2 khỏi O1 | 200; dòng biến mất; tổng 0 |
| TC-ORD-22 | E2E | P1 | Tạo phiếu C1/V1, đổi Đang sửa, thêm Thay dầu | Nhãn Tiếp nhận → Đang sửa; tổng hiển thị 200.000 đ |

## TC-PRT – Kho phụ tùng

Toàn bộ 22 ca nằm trong `cypress/e2e/api/parts.cy.js`, đúng mức API của PDF. Không dùng lại các mã này cho UI hoặc kiểm tra danh mục khác.

| Mã TC | Mức | Ưu tiên | Dữ liệu / mục đích | Kết quả mong đợi trong PDF |
|---|---|---|---|---|
| TC-PRT-01 | API | P1 | Thêm P1×1 vào O1 | 200; P1 còn 9; tổng tăng 150.000 |
| TC-PRT-02 | API | P1 | Thêm P1×10, đúng tồn | 200; P1 còn 0 |
| TC-PRT-03 | API | P1 | Thêm P1×11, vượt tồn 1 | 400; “Không đủ tồn kho (còn 10)”; P1 vẫn 10 |
| TC-PRT-04 | API | P1 | Thêm P1 với qty=0 | 400; phiếu và tồn kho không đổi |
| TC-PRT-05 | API | P1 | Thêm P1 với qty=-1 | 400; tồn kho không đổi |
| TC-PRT-06 | API | P2 | Thêm P1, không gửi qty | 400 hoặc mặc định qty=1 và trừ kho 1 |
| TC-PRT-07 | API | P2 | Thêm P1 với qty=`abc` | 400; “Số lượng không hợp lệ” |
| TC-PRT-08 | API | P2 | part_id=99999, qty=1 | 404 hoặc 400; “Phụ tùng không tồn tại” |
| TC-PRT-09 | API | P1 | Thêm P1×2 vào phiếu 99999 | Báo lỗi; rollback, P1 vẫn 10 |
| TC-PRT-10 | API | P1 | Xóa dòng P2×1 khỏi O5 | 200; P2 tồn 6; tổng O5 giảm 400.000 |
| TC-PRT-11 | API | P2 | Xóa dòng phụ tùng 99999 của O5 | 404 |
| TC-PRT-12 | API | P1 | Nhập kho P1 qty=5 | 200; P1 tồn 15 |
| TC-PRT-13 | API | P1 | Nhập kho qty=0 | 400; “Số lượng không hợp lệ” |
| TC-PRT-14 | API | P1 | Nhập kho qty=-3 | 400; “Số lượng không hợp lệ” |
| TC-PRT-15 | API | P2 | Nhập kho qty=`abc` | 400 |
| TC-PRT-16 | API | P2 | Nhập kho qty=2.5 | 400; số lượng phải là số nguyên |
| TC-PRT-17 | API | P2 | Nhập kho phụ tùng 99999 | 404 |
| TC-PRT-18 | API | P2 | Tạo phụ tùng thiếu name, price=90000 | 400; “Thiếu thông tin” |
| TC-PRT-19 | API | P2 | Gạt mưa, price=-90000 | 400 |
| TC-PRT-20 | API | P3 | Ốc vít, price=1000, min_stock=0 | Lưu `min_stock=0` |
| TC-PRT-21 | API | P1 | P4 có min_stock=5, lần lượt đặt tồn 6, 5, 4 | `lowStockParts` không đếm P4 ở 6; đếm ở 5 và 4 |
| TC-PRT-22 | API | P2 | Xóa P2 đang được O5 sử dụng | 400; báo phụ tùng đang được sử dụng |

TC-PRT-06 có hai kết quả hợp lệ được PDF cho phép; test kiểm tra đầy đủ tác động tương ứng, không chấp nhận dữ liệu lỗi hoặc tồn kho NULL. TC-PRT-09 không quy định mã HTTP cụ thể; kiểm tra phản hồi lỗi và rollback đúng, không tự đặt expected bắt buộc 400. TC-PRT-21 thay đổi tồn P4 qua dữ liệu local để kiểm tra đủ ba giá trị biên, không chỉ kiểm tra số cảnh báo ban đầu.

## TC-INV – Hóa đơn và thanh toán

Các hàng API nằm trong `cypress/e2e/api/invoices.cy.js`; TC-INV-12/17/18 nằm trong `cypress/e2e/ui/invoices.cy.js`.

| Mã TC | Mức | Ưu tiên | Dữ liệu / mục đích | Kết quả mong đợi trong PDF |
|---|---|---|---|---|
| TC-INV-01 | API | P1 | O2, discount=0, Tiền mặt | 200; dịch vụ 200.000; phụ tùng 300.000; tổng 500.000; O2 `da_thanh_toan` |
| TC-INV-02 | API | P1 | O2, discount=100000, Chuyển khoản | 200; tổng 400.000 |
| TC-INV-03 | API | P1 | discount=500000 | 200; tổng 0 |
| TC-INV-04 | API | P1 | discount=500001, vượt tổng 1 đồng | 400; không tạo hóa đơn |
| TC-INV-05 | API | P1 | discount=-50000 | 400 |
| TC-INV-06 | API | P2 | discount=`abc` | 400 |
| TC-INV-07 | API | P1 | Lập hóa đơn O1 chưa hoàn thành | 400; giữ `tiep_nhan` |
| TC-INV-08 | API | P1 | Lập hóa đơn O4 đã hủy | 400 |
| TC-INV-09 | API | P1 | Lập hóa đơn thứ hai cho O3 | 400; “Phiếu đã được thanh toán” |
| TC-INV-10 | API | P1 | Kiểm tra sau lần lập hóa đơn trùng thất bại | Không có hóa đơn thứ hai; trạng thái O3 không đổi |
| TC-INV-11 | API | P1 | payment_method=`bitcoin` | 400 |
| TC-INV-12 | E2E | P1 | Mở lập hóa đơn O2, xem `#inv-payment` | Có 3 lựa chọn: Tiền mặt, Chuyển khoản, Thẻ |
| TC-INV-13 | API | P2 | repair_order_id=99999 | 404 |
| TC-INV-14 | API | P2 | Body `{}` | 400; “Thiếu thông tin” |
| TC-INV-15 | API | P1 | Lập hóa đơn O2 rồi đổi giá S1 lên 250.000 | service_total vẫn 200.000; tổng hóa đơn không đổi |
| TC-INV-16 | API | P3 | Xem hóa đơn 99999 | 404; “Không tìm thấy” |
| TC-INV-17 | E2E | P1 | O2, nhập discount=100000, xác nhận | `#inv-grand-total` hiển thị 400.000 đ; phiếu có nhãn Đã thanh toán |
| TC-INV-18 | E2E | P2 | Mở O1, O5, O2 | Nút Lập hóa đơn chỉ có ở O2 Hoàn thành |

## Các quy tắc sử dụng kết quả

- Số lượng 82 là số ca được ánh xạ, không phải tuyên bố 82 ca Pass. Kết quả thực chạy nằm trong báo cáo của runner và [VERIFICATION.md](VERIFICATION.md).
- Phản hồi 500 không được coi tương đương 400/404 khi PDF đã quy định cụ thể. Các lựa chọn 400 hoặc 404 chỉ áp dụng đúng những hàng được PDF cho phép.
- Ca phát hiện ứng dụng sai SRS giữ assertion và ghi [BUG_REPORT.md](BUG_REPORT.md). Không đổi mã TC hay expected để khớp hành vi sai.
- Mọi test dùng Express và PostgreSQL local thật, không giả lập response API. UI gọi `cy.useLocalApi()` trước khi truy cập frontend.

## Dashboard giai đoạn 2

`cypress/e2e/ui/dashboard.phase2.cy.js` chạy riêng với `npm run test:dashboard`, kiểm tra từng yêu cầu SRS 3.8.1 trong `GOP_Y_LAB3.md`: số khách hàng, số xe, số phiếu đang xử lý, doanh thu hôm nay và doanh thu tháng này. Không kiểm tra “đúng 6 thẻ”.

Năm mã `TC-DASH-01…05` chỉ là định danh bổ sung cho các yêu cầu SRS này; **không phải mã trong PDF và không được tính vào 82 TC**. Chức năng ngoài bốn nhóm của PDF và REG-01 báo cáo tháng 2 thuộc giai đoạn 2. Riêng TC-PRT-21 dùng endpoint dashboard để xác minh cảnh báo kho đã được PDF quy định nên vẫn thuộc bộ giữa kỳ.
