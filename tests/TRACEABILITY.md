# Đối chiếu Test Case và nguồn kỳ vọng

**Chưa có file Excel Test Case của nhóm** trong hai file đính kèm, trên nhánh `test` hoặc nhánh `main` của repo được cung cấp. Vì vậy không thể xác nhận mã mới khớp Excel, tổng số TC trong Excel hoặc tỷ lệ phủ Excel. Không dùng các mã tạm ở đây làm bằng chứng đã ánh xạ chính thức.

Nguồn đã đọc:

- `GOP_Y_LAB3.md`: repo/nhánh, phạm vi P1, cách seed, 2 vai trò, dashboard 3.8.1.
- `tests/README.md`, seed và TC-AUTH trên nhánh nhóm: quy ước helper, dữ liệu và mã AUTH có sẵn.
- `SE104_Report_final.docx`: yêu cầu chức năng 1.1.3/1.1.5/1.1.7, UC-02, UC-03, tính bất biến hóa đơn.

**Mã ORD/PRT/INV/DASH mới được đánh số tạm theo kịch bản trong gói này.** PRT-05 và PRT-13 có ví dụ tên/mã trong góp ý hoặc README nhóm, nhưng ví dụ không thay thế đầy đủ hàng Excel. API và UI có thể dùng chung mã để kiểm tra cùng yêu cầu ở hai tầng; đó là hai lượt chạy, không phải hai TC Excel độc lập.

Các assertion về quy tắc biên (giá/tồn âm, số lượng 0/lẻ, ngưỡng tồn 0, miền giảm giá) và một số mã lỗi HTTP là **thiết kế kiểm thử đề xuất**, chưa được xác nhận từ Excel. Assertions về quy tắc nghiệp vụ đã có SRS không được đổi chỉ vì code hiện tại sai.

Khi có Excel: đối chiếu từng hàng, đổi mã/tên tạm sang đúng mã, bổ sung các TC còn thiếu và xác nhận expected đang đánh dấu đề xuất. Đây là bước hoàn thiện traceability, **không phải thao tác cần làm để chạy thử gói hiện tại**.

| Mã hiện tại | Kịch bản | Spec | Nguồn / phần cần chốt | Trạng thái ánh xạ |
|---|---|---|---|---|
| TC-AUTH-01 | Đăng nhập thành công với tài khoản Quản lý | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-02 | Sai mật khẩu | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-03 | Tên đăng nhập không tồn tại, thông báo không lộ thông tin | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-04 | Thiếu username | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-05 | Thiếu password | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-06 | Username khác chữ hoa/thường | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-07 | Mật khẩu được lưu dạng băm bcrypt | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-08 | Gọi API không có header Authorization | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-09 | Token sai chữ ký | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-10 | Header thiếu tiền tố Bearer | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-11 | Thời hạn token đúng 12 giờ theo SRS | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-12 | Token đã hết hạn bị từ chối | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-13 | Quy tắc R1: Lễ tân thêm nhân viên | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-14 | Quy tắc R2: Quản lý thêm nhân viên | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-15 | Quy tắc R3: Lễ tân thêm dịch vụ | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-16 | Quy tắc R4: Lễ tân thêm phụ tùng vào kho | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-17 | Quy tắc R5: Lễ tân nhập kho | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-18 | Quy tắc R6: Lễ tân xem danh sách nhân viên | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-AUTH-19 | Quản lý tự xoá tài khoản của mình | `cypress/e2e/api/auth.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-INV-01 | Lập hóa đơn O2, tổng 500000 và chuyển Đã thanh toán | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-INV-02 | Giảm 50000 trên tổng 500000, phải thu 450000 | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-INV-03 | Giảm đúng tổng tiền, hóa đơn bằng 0 | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; miền giảm giá là đề xuất cần chốt; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-INV-04 | Giảm giá âm phải bị từ chối | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; miền giảm giá là đề xuất cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-INV-05 | Giảm giá vượt tổng không được tạo hóa đơn âm | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; miền giảm giá là đề xuất cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-INV-06 | Phương thức thanh toán ngoài danh sách bị từ chối | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03 | Mã mới tạm; đối chiếu Excel |
| TC-INV-07 | O1 mới Tiếp nhận, chưa được xuất hóa đơn | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03 | Mã mới tạm; đối chiếu Excel |
| TC-INV-08 | O5 đang sửa, chưa được xuất hóa đơn | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03 | Mã mới tạm; đối chiếu Excel |
| TC-INV-09 | O4 đã hủy, không được xuất hóa đơn | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03 | Mã mới tạm; đối chiếu Excel |
| TC-INV-10 | O3 đã có hóa đơn, không tạo hóa đơn lần hai | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; mã HTTP cụ thể cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-INV-11 | Thiếu mã phiếu phải trả lỗi 400 | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; mã HTTP cụ thể cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-INV-12 | Phiếu không tồn tại phải trả lỗi 404 | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; mã HTTP cụ thể cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-INV-13 | Xem hóa đơn seed của O3 đúng người lập và chi tiết | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03 | Mã mới tạm; đối chiếu Excel |
| TC-INV-14 | Hóa đơn không tồn tại trả 404 | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; mã HTTP cụ thể cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-INV-15 | Đổi giá danh mục không làm đổi giá đã chốt trên phiếu | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-INV-16 | Thanh toán bằng Chuyển khoản | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-INV-17 | Thanh toán bằng Thẻ | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; slug API `the` là quy ước đề xuất, UI phải có Thẻ; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-INV-18 | Bỏ qua tổng tiền giả do client gửi, tính từ chi tiết DB | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-INV-19 | Không được thêm phụ tùng làm đổi chứng từ đã thanh toán | `cypress/e2e/api/invoices.cy.js` | SRS 1.1.7 / UC-03 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-01 | Tạo phiếu với C1 và V1, mặc định Tiếp nhận | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-02 | Thiếu khách hàng, không tạo phiếu | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02; đề xuất hợp đồng 400/404 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-03 | Thiếu xe, không tạo phiếu | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02; đề xuất hợp đồng 400/404 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-04 | Lọc phiếu Đang sửa theo dữ liệu seed O5 | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-05 | Thêm S1 nhân 2, tổng tiền dịch vụ 400000 | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-06 | Xóa dịch vụ của O2, tổng còn 300000 | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-07 | Thêm P1 nhân 2, trừ tồn kho và tính tiền chính xác | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-08 | Vượt tồn kho phải từ chối và rollback toàn bộ | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02; rollback theo SRS, 4xx là hợp đồng đề xuất | Mã mới tạm; đối chiếu Excel |
| TC-ORD-09 | Xóa P1 nhân 2 khỏi O2, hoàn kho và tính lại tổng | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-10 | Chuyển O1 từ Tiếp nhận sang Đang sửa | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-11 | Chuyển O5 từ Đang sửa sang Hoàn thành | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-12 | Hủy phiếu Tiếp nhận O1 | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-13 | Từ chối trạng thái ngoài danh sách nghiệp vụ | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-14 | Xem phiếu không tồn tại trả 404 | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02; đề xuất hợp đồng 400/404 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-15 | Tổng phiếu bằng S1 nhân 1 cộng P1 nhân 2 | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-16 | Dịch vụ số lượng 0 phải bị từ chối | `cypress/e2e/api/orders.cy.js` | Quy tắc số lượng nguyên dương đề xuất; cần chốt Excel | Mã mới tạm; đối chiếu Excel |
| TC-ORD-17 | Phụ tùng số lượng âm không được làm tăng tồn kho | `cypress/e2e/api/orders.cy.js` | Quy tắc số lượng nguyên dương đề xuất; cần chốt Excel | Mã mới tạm; đối chiếu Excel |
| TC-ORD-18 | P3 hết hàng, không tạo dòng phụ tùng | `cypress/e2e/api/orders.cy.js` | SRS 1.1.3 / UC-02; rollback theo SRS, 4xx là hợp đồng đề xuất | Mã mới tạm; đối chiếu Excel |
| TC-PRT-01 | Đọc danh mục P1 đến P4 đúng giá và tồn kho seed | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm | Mã mới tạm; đối chiếu Excel |
| TC-PRT-02 | Thêm phụ tùng hợp lệ, tồn kho 0 được giữ nguyên | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm | Mã mới tạm; đối chiếu Excel |
| TC-PRT-03 | Thiếu tên phụ tùng phải báo lỗi | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-04 | Đơn giá âm phải bị từ chối | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-05 | Số lượng âm | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Có mã/tên ví dụ trong góp ý hoặc README nhóm; chưa xác nhận hàng Excel |
| TC-PRT-06 | Cập nhật giá P1, không làm đổi tồn kho | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm | Mã mới tạm; đối chiếu Excel |
| TC-PRT-07 | Mức tồn tối thiểu 0 phải được lưu đúng | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-08 | Xóa P4 chưa được dùng trong phiếu | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm | Mã mới tạm; đối chiếu Excel |
| TC-PRT-09 | Phụ tùng đã dùng phải được bảo vệ khỏi xóa | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-10 | Cảnh báo tồn kho tính cả bằng ngưỡng và hết hàng | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm | Mã mới tạm; đối chiếu Excel |
| TC-PRT-11 | Thiếu đơn giá phải báo lỗi | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-12 | Nhập kho số lẻ phải bị từ chối, tồn kho không đổi | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-13 | Nhập kho hợp lệ | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm | Có mã/tên ví dụ trong góp ý hoặc README nhóm; chưa xác nhận hàng Excel |
| TC-PRT-14 | Nhập kho qty bằng 0 phải bị từ chối | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-15 | Nhập kho qty âm phải bị từ chối | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-16 | Nhập kho phụ tùng không tồn tại phải báo 404 | `cypress/e2e/api/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-DASH-01 | Hiển thị số khách hàng | `cypress/e2e/ui/dashboard.phase2.cy.js` | SRS 3.8.1 trích trong góp ý; P2 | Mã TC-DASH tạm; đối chiếu Excel |
| TC-DASH-02 | Hiển thị số xe | `cypress/e2e/ui/dashboard.phase2.cy.js` | SRS 3.8.1 trích trong góp ý; P2 | Mã TC-DASH tạm; đối chiếu Excel |
| TC-DASH-03 | Hiển thị số phiếu đang xử lý | `cypress/e2e/ui/dashboard.phase2.cy.js` | SRS 3.8.1 trích trong góp ý; P2 | Mã TC-DASH tạm; đối chiếu Excel |
| TC-DASH-04 | Hiển thị doanh thu hôm nay | `cypress/e2e/ui/dashboard.phase2.cy.js` | SRS 3.8.1 trích trong góp ý; P2 | Mã TC-DASH tạm; đối chiếu Excel |
| TC-DASH-05 | Hiển thị doanh thu tháng này | `cypress/e2e/ui/dashboard.phase2.cy.js` | SRS 3.8.1 trích trong góp ý; P2 | Mã TC-DASH tạm; đối chiếu Excel |
| TC-INV-02 | Lập hóa đơn giảm 50000, thu 450000 qua giao diện | `cypress/e2e/ui/invoices.cy.js` | SRS 1.1.7 / UC-03; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-INV-13 | Xem hóa đơn seed qua giao diện | `cypress/e2e/ui/invoices.cy.js` | SRS 1.1.7 / UC-03 | Mã mới tạm; đối chiếu Excel |
| TC-INV-17 | Giao diện phải có phương thức thanh toán Thẻ theo SRS | `cypress/e2e/ui/invoices.cy.js` | SRS 1.1.7 / UC-03; slug API `the` là quy ước đề xuất, UI phải có Thẻ; dùng HTTP thành công 200 theo hợp đồng hiện có, cần chốt nếu Excel quy định khác | Mã mới tạm; đối chiếu Excel |
| TC-AUTH-20 | Đăng nhập qua giao diện | `cypress/e2e/ui/login.cy.js` | TC nhóm đã có; SRS 1.1.1 / bảng phân quyền | Giữ nguyên mã từ nhánh test; chưa đọc Excel gốc |
| TC-ORD-01 | Tạo phiếu cho C1 và V1 qua giao diện | `cypress/e2e/ui/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-07 | Thêm P1 nhân 2 qua giao diện, tồn kho còn 8 | `cypress/e2e/ui/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-ORD-09 | Xóa phụ tùng O2 qua giao diện và hoàn kho | `cypress/e2e/ui/orders.cy.js` | SRS 1.1.3 / UC-02 | Mã mới tạm; đối chiếu Excel |
| TC-PRT-13 | Nhập thêm 5 P1 qua giao diện, tồn kho thành 15 | `cypress/e2e/ui/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm | Có mã/tên ví dụ trong góp ý hoặc README nhóm; chưa xác nhận hàng Excel |
| TC-PRT-14 | Nhập 0 qua giao diện báo lỗi, tồn kho không đổi | `cypress/e2e/ui/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm; quy tắc biên/HTTP cần chốt | Mã mới tạm; đối chiếu Excel |
| TC-PRT-10 | Hiển thị trạng thái theo từng ngưỡng tồn kho | `cypress/e2e/ui/parts.cy.js` | SRS 1.1.5; dữ liệu seed nhóm | Mã mới tạm; đối chiếu Excel |
