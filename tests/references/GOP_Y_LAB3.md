# Góp ý cho bộ test `lab 3`

## Repo và cấu trúc
- Làm trên repo nhóm `kimvux/Test---GarageManagement`, nhánh `test`, không dùng `luongng527/GarageManagement`.
- Đặt file vào `tests/cypress/e2e/api/` và `tests/cypress/e2e/ui/`, không tạo `cypress/` ở thư mục gốc.
- Bỏ README_TEST riêng, dùng `tests/README.md` có sẵn (mục 3 hướng dẫn viết test mới).

## Lệnh và dữ liệu
- Đổi `cy.apiTestRequest`, `cy.apiTestLogin` sang `cy.api(method, url, body, token)` và `cy.apiLogin(role)`.
- Bỏ các biến bật/tắt (`runApiReads`, `allowApiWrites`…). Test chạy với CSDL Docker local và tự seed lại trong `beforeEach` (`cy.task('db:seed')`).
- Dùng dữ liệu seed sẵn (C1, V1, O2, P1…), không tự tạo dữ liệu rồi bỏ lại trong DB.

## Quy tắc bắt buộc
- Tiêu đề test phải bắt đầu bằng mã TC trong file Excel, ví dụ `it('TC-PRT-05 – Số lượng âm', ...)`.
- Kết quả mong đợi lấy theo SRS, không theo code. Test fail vì code sai SRS thì giữ nguyên và ghi vào Bug Report.
- Không gọi API Render hay CSDL Neon. **Bỏ `live/01-live-smoke.cy.js`.**
- Test UI không giả lập API. Gọi `cy.useLocalApi()` trong `beforeEach` để chạy với backend local.

## Sửa nội dung sai
- Hệ thống chỉ có 2 vai trò là `quan_ly` và `nhan_vien_le_tan`. STAFF-API-01 đang dùng `nhan_vien_ky_thuat` là sai.
- STAFF-API-01 có tên "không xóa chính mình" nhưng không kiểm tra điều đó. Phần này đã có TC-AUTH-19 nên bỏ đi.
- Dashboard kiểm tra từng thẻ theo SRS 3.8.1, không kiểm tra "đúng 6 thẻ". Thiếu thẻ "Số xe" là lỗi.

## Phạm vi giữa kỳ
- Ưu tiên 3 nhóm test case còn thiếu: **TC-ORD, TC-PRT, TC-INV**. TC-AUTH đã xong.
- Có thể tận dụng: phần tính tiền trong FLOW-01 (tổng phiếu, giảm giá, trừ kho) để viết TC-ORD và TC-INV, và phần restock qty = 0 cho TC-PRT.
- Các module ngoài P1 (khách hàng, xe, lịch hẹn, báo cáo, nhân viên) và REG-01 (báo cáo tháng 2) để sang giai đoạn 2.

3.8.1 Yêu cầu chức năng
-Hệ thống phải có dashboard tổng quan hiển thị:
+Số khách hàng
+Số xe
+Số phiếu đang xử lý
+Doanh thu hôm nay
+Doanh thu tháng này
-Hệ thống phải cung cấp báo cáo doanh thu theo:
+Ngày
+Tháng
+Năm
-Hệ thống phải cho phép lọc báo cáo theo khoảng thời gian tuỳ chỉnh.
-Hệ thống phải cung cấp báo cáo top 10 dịch vụ được sử dụng nhiều nhất để hỗ trợ ra quyết định kinh doanh và marketing.
