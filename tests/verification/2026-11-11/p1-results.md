# Kết quả Cypress

2026-11-11T01:59:22.474Z

Commit: ba91fa7f7cffd18e691b7ad66e79bf25aed0c460

Tổng 82; Pass 56; Fail 26; Pending 0; Skipped 0.

| Spec | Test | Kết quả | Lỗi |
|---|---|---|---|
| cypress/e2e/ui/invoices.cy.js | P1 – Hóa đơn (giao diện và backend thật) > TC-INV-02 – Lập hóa đơn giảm 50000, thu 450000 qua giao diện | passed |  |
| cypress/e2e/ui/invoices.cy.js | P1 – Hóa đơn (giao diện và backend thật) > TC-INV-13 – Xem hóa đơn seed qua giao diện | passed |  |
| cypress/e2e/ui/invoices.cy.js | P1 – Hóa đơn (giao diện và backend thật) > TC-INV-17 – Giao diện phải có phương thức thanh toán Thẻ theo SRS | failed | AssertionError: 3 phương thức theo SRS: expected [ 'tien_mat', 'chuyen_khoan' ] to be a superset of [ 'tien_mat', 'chuyen_khoan', 'the' ]     at Context.eval (webpack://autogara-tests/./cypress/e2e/ui/invoices.cy.js:49:95) |
| cypress/e2e/ui/login.cy.js | F01 – Đăng nhập (E2E) > TC-AUTH-20 – Đăng nhập qua giao diện | passed |  |
| cypress/e2e/ui/orders.cy.js | P1 – Phiếu sửa chữa (giao diện và backend thật) > TC-ORD-01 – Tạo phiếu cho C1 và V1 qua giao diện | passed |  |
| cypress/e2e/ui/orders.cy.js | P1 – Phiếu sửa chữa (giao diện và backend thật) > TC-ORD-07 – Thêm P1 nhân 2 qua giao diện, tồn kho còn 8 | passed |  |
| cypress/e2e/ui/orders.cy.js | P1 – Phiếu sửa chữa (giao diện và backend thật) > TC-ORD-09 – Xóa phụ tùng O2 qua giao diện và hoàn kho | passed |  |
| cypress/e2e/ui/parts.cy.js | P1 – Nhập kho (giao diện và backend thật) > TC-PRT-13 – Nhập thêm 5 P1 qua giao diện, tồn kho thành 15 | passed |  |
| cypress/e2e/ui/parts.cy.js | P1 – Nhập kho (giao diện và backend thật) > TC-PRT-14 – Nhập 0 qua giao diện báo lỗi, tồn kho không đổi | passed |  |
| cypress/e2e/ui/parts.cy.js | P1 – Nhập kho (giao diện và backend thật) > TC-PRT-10 – Hiển thị trạng thái theo từng ngưỡng tồn kho | passed |  |
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
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-01 – Lập hóa đơn O2, tổng 500000 và chuyển Đã thanh toán | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-02 – Giảm 50000 trên tổng 500000, phải thu 450000 | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-03 – Giảm đúng tổng tiền, hóa đơn bằng 0 | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-04 – Giảm giá âm phải bị từ chối | failed | AssertionError: số bản ghi invoices : expected 2 to equal 1     at Context.eval (webpack://autogara-tests/./cypress/support/assertions.js:19:57) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-05 – Giảm giá vượt tổng không được tạo hóa đơn âm | failed | AssertionError: số bản ghi invoices : expected 2 to equal 1     at Context.eval (webpack://autogara-tests/./cypress/support/assertions.js:19:57) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-06 – Phương thức thanh toán ngoài danh sách bị từ chối | failed | AssertionError: số bản ghi invoices : expected 2 to equal 1     at Context.eval (webpack://autogara-tests/./cypress/support/assertions.js:19:57) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-07 – O1 mới Tiếp nhận, chưa được xuất hóa đơn | failed | AssertionError: số bản ghi invoices : expected 2 to equal 1     at Context.eval (webpack://autogara-tests/./cypress/support/assertions.js:19:57) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-08 – O5 đang sửa, chưa được xuất hóa đơn | failed | AssertionError: số bản ghi invoices : expected 2 to equal 1     at Context.eval (webpack://autogara-tests/./cypress/support/assertions.js:19:57) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-09 – O4 đã hủy, không được xuất hóa đơn | failed | AssertionError: số bản ghi invoices : expected 2 to equal 1     at Context.eval (webpack://autogara-tests/./cypress/support/assertions.js:19:57) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-10 – O3 đã có hóa đơn, không tạo hóa đơn lần hai | failed | AssertionError: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:28:48) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-11 – Thiếu mã phiếu phải trả lỗi 400 | failed | AssertionError: expected 500 to equal 400     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:28:48) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-12 – Phiếu không tồn tại phải trả lỗi 404 | failed | AssertionError: expected 500 to equal 404     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:28:48) |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-13 – Xem hóa đơn seed của O3 đúng người lập và chi tiết | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-14 – Hóa đơn không tồn tại trả 404 | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-15 – Đổi giá danh mục không làm đổi giá đã chốt trên phiếu | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-16 – Thanh toán bằng Chuyển khoản | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-17 – Thanh toán bằng Thẻ | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-18 – Bỏ qua tổng tiền giả do client gửi, tính từ chi tiết DB | passed |  |
| cypress/e2e/api/invoices.cy.js | P1 – Hóa đơn và thanh toán (API thật) > TC-INV-19 – Không được thêm phụ tùng làm đổi chứng từ đã thanh toán | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 200 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/invoices.cy.js:154:6) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-01 – Tạo phiếu với C1 và V1, mặc định Tiếp nhận | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-02 – Thiếu khách hàng, không tạo phiếu | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-03 – Thiếu xe, không tạo phiếu | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-04 – Lọc phiếu Đang sửa theo dữ liệu seed O5 | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-05 – Thêm S1 nhân 2, tổng tiền dịch vụ 400000 | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-06 – Xóa dịch vụ của O2, tổng còn 300000 | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-07 – Thêm P1 nhân 2, trừ tồn kho và tính tiền chính xác | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-08 – Vượt tồn kho phải từ chối và rollback toàn bộ | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 500 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:88:20) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-09 – Xóa P1 nhân 2 khỏi O2, hoàn kho và tính lại tổng | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-10 – Chuyển O1 từ Tiếp nhận sang Đang sửa | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-11 – Chuyển O5 từ Đang sửa sang Hoàn thành | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-12 – Hủy phiếu Tiếp nhận O1 | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-13 – Từ chối trạng thái ngoài danh sách nghiệp vụ | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 200 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:129:6) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-14 – Xem phiếu không tồn tại trả 404 | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-15 – Tổng phiếu bằng S1 nhân 1 cộng P1 nhân 2 | passed |  |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-16 – Dịch vụ số lượng 0 phải bị từ chối | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 200 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:149:6) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-17 – Phụ tùng số lượng âm không được làm tăng tồn kho | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 200 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:157:6) |
| cypress/e2e/api/orders.cy.js | P1 – Phiếu sửa chữa (API thật) > TC-ORD-18 – P3 hết hàng, không tạo dòng phụ tùng | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 500 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/orders.cy.js:169:20) |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-01 – Đọc danh mục P1 đến P4 đúng giá và tồn kho seed | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-02 – Thêm phụ tùng hợp lệ, tồn kho 0 được giữ nguyên | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-03 – Thiếu tên phụ tùng phải báo lỗi | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-04 – Đơn giá âm phải bị từ chối | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 200 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:41:6) |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-05 – Số lượng âm | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 200 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:48:6) |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-06 – Cập nhật giá P1, không làm đổi tồn kho | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-07 – Mức tồn tối thiểu 0 phải được lưu đúng | failed | AssertionError: expected 5 to equal 0     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:69:37) |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-08 – Xóa P4 chưa được dùng trong phiếu | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-09 – Phụ tùng đã dùng phải được bảo vệ khỏi xóa | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 500 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:86:20) |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-10 – Cảnh báo tồn kho tính cả bằng ngưỡng và hết hàng | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-11 – Thiếu đơn giá phải báo lỗi | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-12 – Nhập kho số lẻ phải bị từ chối, tồn kho không đổi | failed | AssertionError: dữ liệu nghiệp vụ không hợp lệ phải trả lỗi 4xx: expected 500 to be within 400..499     at expectRejected (webpack://autogara-tests/./cypress/support/assertions.js:23:83)     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:109:20) |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-13 – Nhập kho hợp lệ | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-14 – Nhập kho qty bằng 0 phải bị từ chối | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-15 – Nhập kho qty âm phải bị từ chối | passed |  |
| cypress/e2e/api/parts.cy.js | P1 – Phụ tùng và nhập kho (API thật) > TC-PRT-16 – Nhập kho phụ tùng không tồn tại phải báo 404 | failed | AssertionError: expected 200 to equal 404     at Context.eval (webpack://autogara-tests/./cypress/e2e/api/parts.cy.js:137:28) |
