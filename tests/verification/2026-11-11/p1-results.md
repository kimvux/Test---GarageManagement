# Kết quả Cypress

2026-11-11T14:43:25.964Z

Commit: a408c91f5234dc74e0de913095ca53d7a79e9156

Tổng 82; Pass 43; Fail 39; Pending 0; Skipped 0.

| Spec | Test | Kết quả | Lỗi |
|---|---|---|---|
| cypress/e2e/ui/invoices.cy.js | P1 – Hóa đơn (giao diện và backend thật) > TC-INV-12 – Giao diện có đủ Tiền mặt, Chuyển khoản và Thẻ | failed | AssertionError: Timed out retrying after 6000ms: đủ ba phương thức theo SRS: expected '[ <option>, 1 more... ]' to have a length of 3 but got 2     at Context.eval (webpack://autogara-tests/./cypress/e2e/ui/invoices.cy.js:29:60) |
| cypress/e2e/ui/invoices.cy.js | P1 – Hóa đơn (giao diện và backend thật) > TC-INV-17 – Giảm 100000 qua giao diện, thu 400000 và hiện Đã thanh toán | passed |  |
| cypress/e2e/ui/invoices.cy.js | P1 – Hóa đơn (giao diện và backend thật) > TC-INV-18 – Chỉ phiếu Hoàn thành mới có nút Lập hóa đơn | passed |  |
| cypress/e2e/ui/login.cy.js | F01 – Đăng nhập (E2E) > TC-AUTH-20 – Đăng nhập qua giao diện | passed |  |
| cypress/e2e/ui/orders.cy.js | P1 – Phiếu sửa chữa (giao diện và backend thật) > TC-ORD-22 – Luồng tạo phiếu và đổi trạng thái qua giao diện | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-01 – Đăng nhập thành công với tài khoản Quản lý | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-02 – Sai mật khẩu | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-03 – Tên đăng nhập không tồn tại, thông báo không lộ thông tin | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-04 – Thiếu username | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-05 – Thiếu password | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-06 – Username khác chữ hoa/thường | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-07 – Mật khẩu được lưu dạng băm bcrypt | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-08 – Gọi API không có header Authorization | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-09 – Token sai chữ ký | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-10 – Header thiếu tiền tố Bearer | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-11 – Thời hạn token đúng 12 giờ theo SRS | failed | AssertionError: exp − iat (giây): expected 28800 to equal 43200     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/auth.cy.js:91:65) |
| cypress/e2e/api/auth.cy.js | F01 – Xác thực (API) > TC-AUTH-12 – Token đã hết hạn bị từ chối | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Phân quyền (API, bảng quyết định) > TC-AUTH-13 – Quy tắc R1: Lễ tân thêm nhân viên | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Phân quyền (API, bảng quyết định) > TC-AUTH-14 – Quy tắc R2: Quản lý thêm nhân viên | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Phân quyền (API, bảng quyết định) > TC-AUTH-15 – Quy tắc R3: Lễ tân thêm dịch vụ | passed |  |
| cypress/e2e/api/auth.cy.js | F01 – Phân quyền (API, bảng quyết định) > TC-AUTH-16 – Quy tắc R4: Lễ tân thêm phụ tùng vào kho | failed | AssertionError: expected 200 to equal 403     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/auth.cy.js:141:30) |
| cypress/e2e/api/auth.cy.js | F01 – Phân quyền (API, bảng quyết định) > TC-AUTH-17 – Quy tắc R5: Lễ tân nhập kho | failed | AssertionError: expected 200 to equal 403     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/auth.cy.js:149:30) |
| cypress/e2e/api/auth.cy.js | F01 – Phân quyền (API, bảng quyết định) > TC-AUTH-18 – Quy tắc R6: Lễ tân xem danh sách nhân viên | failed | AssertionError: expected 200 to equal 403     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/auth.cy.js:157:30) |
| cypress/e2e/api/auth.cy.js | F01 – Phân quyền (API, bảng quyết định) > TC-AUTH-19 – Quản lý tự xoá tài khoản của mình | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-01 – Lập hóa đơn chuẩn cho O2, tổng 500000 | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-02 – Giảm 100000 và chuyển khoản, tổng 400000 | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-03 – Giảm đúng tổng tiền 500000, hóa đơn bằng 0 | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-04 – Giảm giá vượt tổng tiền một đồng bị từ chối | failed | AssertionError: mã HTTP theo Test Case: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-05 – Giảm giá âm -50000 bị từ chối | failed | AssertionError: mã HTTP theo Test Case: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-06 – Giảm giá không phải số bị từ chối | failed | AssertionError: mã HTTP theo Test Case: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-07 – Phiếu O1 chưa hoàn thành không được lập hóa đơn | failed | AssertionError: mã HTTP theo Test Case: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-08 – Phiếu O4 đã hủy không được lập hóa đơn | failed | AssertionError: mã HTTP theo Test Case: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-09 – Không được lập hóa đơn lần hai cho O3 | failed | AssertionError: mã HTTP theo Test Case: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-10 – Rollback giữ nguyên hóa đơn và trạng thái O3 | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-11 – Phương thức thanh toán bitcoin bị từ chối | failed | AssertionError: mã HTTP theo Test Case: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-13 – Phiếu không tồn tại trả 404 | failed | AssertionError: mã HTTP theo Test Case: expected 500 to equal 404     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-14 – Body rỗng thiếu repair_order_id trả 400 | failed | AssertionError: mã HTTP theo Test Case: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:25:52) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-15 – Hóa đơn đã lập giữ nguyên giá sau khi đổi giá S1 | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-16 – Xem hóa đơn không tồn tại trả 404 | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-01 – Tạo phiếu hợp lệ | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-02 – Thiếu customer_id | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-03 – Thiếu vehicle_id | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-04 – Xe không thuộc khách hàng được chọn | failed | AssertionError: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:61:30) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-05 – customer_id không tồn tại | failed | AssertionError: PDF cho phép 400 hoặc 404: expected 500 to be one of [ 400, 404 ]     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:71:62) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-06 – Chuyển hợp lệ: Tiếp nhận → Đang sửa | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-07 – Chuyển hợp lệ: Đang sửa → Hoàn thành | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-08 – Chuyển hợp lệ: Tiếp nhận → Huỷ | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-09 – Chuyển không hợp lệ: Đã thanh toán → Tiếp nhận | failed | AssertionError: Timed out retrying after 6000ms: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:105:23) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-10 – Chuyển không hợp lệ: Huỷ → Đang sửa | failed | AssertionError: Timed out retrying after 6000ms: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:113:23) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-11 – Chuyển không hợp lệ: Tiếp nhận → Hoàn thành | failed | AssertionError: Timed out retrying after 6000ms: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:121:23) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-12 – Giá trị trạng thái không thuộc danh sách | failed | AssertionError: Timed out retrying after 6000ms: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:129:23) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-13 – Thiếu trường status | failed | AssertionError: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:137:30) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-14 – Huỷ phiếu có phụ tùng thì hoàn trả tồn kho | failed | AssertionError: tồn kho P2: expected 5 to equal 6     at Context.eval (webpack://autogara-tests/./cypress/support/assertions.js:5:51) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-15 – Thêm dịch vụ, tính lại tổng tiền | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-16 – Thêm dịch vụ không tồn tại | failed | AssertionError: PDF cho phép 400 hoặc 404: expected 500 to be one of [ 400, 404 ]     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:170:62) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-17 – Thêm dịch vụ vào phiếu đã Hoàn thành | failed | AssertionError: Timed out retrying after 6000ms: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:181:23) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-18 – Thêm dịch vụ vào phiếu đã thanh toán | failed | AssertionError: Timed out retrying after 6000ms: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:190:23) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-19 – Thêm dịch vụ đã tạm ngưng | failed | AssertionError: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:199:30) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-20 – Giá trong phiếu không đổi khi đổi giá dịch vụ | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật, mã TC theo PDF) > TC-ORD-21 – Xoá dịch vụ khỏi phiếu | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-01 – Thêm phụ tùng với số lượng nhỏ nhất hợp lệ | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-02 – Số lượng bằng đúng tồn kho | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-03 – Số lượng vượt tồn kho 1 đơn vị | failed | AssertionError: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:50:30) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-04 – Số lượng bằng 0 | failed | AssertionError: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:58:28) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-05 – Số lượng âm | failed | AssertionError: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:66:28) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-06 – Không gửi số lượng | failed | AssertionError: expected 500 to be one of [ 400, 200 ]     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:75:31) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-07 – Số lượng không phải số | failed | AssertionError: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:91:30) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-08 – Phụ tùng không tồn tại | failed | AssertionError: expected 500 to be one of [ 404, 400 ]     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:102:33) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-09 – Rollback khi phiếu không tồn tại | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-10 – Xoá phụ tùng khỏi phiếu thì hoàn kho | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-11 – Xoá dòng phụ tùng không tồn tại | failed | AssertionError: expected 200 to equal 404     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:143:28) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-12 – Nhập kho số lượng hợp lệ | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-13 – Nhập kho số lượng 0 | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-14 – Nhập kho số lượng âm | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-15 – Nhập kho với chuỗi chữ | failed | AssertionError: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:178:42) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-16 – Nhập kho số thập phân | failed | AssertionError: số lượng phải là số nguyên: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:185:72) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-17 – Nhập kho cho phụ tùng không tồn tại | failed | AssertionError: expected 200 to equal 404     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:191:28) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-18 – Thêm phụ tùng thiếu tên | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-19 – Thêm phụ tùng giá âm | failed | AssertionError: expected 200 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:207:28) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-20 – Đặt mức tồn tối thiểu bằng 0 | failed | AssertionError: expected 5 to equal 0     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:221:34) |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-21 – Cảnh báo tồn thấp tại các giá trị biên | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – TC-PRT: kho phụ tùng (API và PostgreSQL thật) > TC-PRT-22 – Xoá phụ tùng đã dùng trong phiếu | failed | AssertionError: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:249:30) |
