# Bug Report – Garage Management

Nguồn chạy: repo `kimvux/Test---GarageManagement`, nhánh `test`, commit sản phẩm `ba91fa7f7cffd18e691b7ad66e79bf25aed0c460`. Ngày xác minh: **11/11/2026**. Backend/frontend giữ nguyên.

Kết quả P1: **82 lượt, 56 Pass, 26 Fail, 0 Pending, 0 Skipped**. Bằng chứng từng assertion: [p1-results.md](verification/2026-11-11/p1-results.md) và [p1-results.json](verification/2026-11-11/p1-results.json).

**Không đồng nhất 26 Fail với 26 bug đã được duyệt.** Có ca fail vì ứng dụng sai yêu cầu được nêu rõ; có ca kiểm tra hợp đồng lỗi HTTP hoặc quy tắc biên cần đối chiếu Excel. Hai loại được phân biệt dưới đây. Không sửa expected chỉ để khớp code hiện tại.

Mỗi bước tái hiện bắt đầu từ `cy.task('db:seed')`, đăng nhập bằng tài khoản seed và chỉ gọi backend `http://localhost:3000`. Chạy `npm run test:api` hoặc `npm run test:ui`; mở `npm run cy:open` để xem từng spec. File report có đầy đủ tên spec và dòng assertion.

## 1. Sai lệch có yêu cầu rõ trong tài liệu

Nguồn: `SE104_Report_final.docx`, mục 1.1 và UC-03; mục 3.8.1 trích trong `GOP_Y_LAB3.md`; các TC-AUTH có sẵn trên nhánh nhóm.

| Mã phát hiện | TC và vị trí | Cách tái hiện / thực tế đã quan sát | Kỳ vọng và căn cứ | Mức độ đề xuất |
|---|---|---|---|---|
| BUG-AUTH-01 | AUTH-11, `api/auth.cy.js` | Login admin; `exp - iat` bằng **28.800 giây** | **43.200 giây / 12h**, SRS 1.1.1 và TC nhóm hiện có | Trung bình |
| BUG-AUTH-02 | AUTH-16, AUTH-17, `api/auth.cy.js` | Token `nhan_vien_le_tan` gọi thêm phụ tùng / nhập kho; API trả **200** | **403**, theo bảng quyết định TC-AUTH của nhóm; UI ẩn nút không thay thế phân quyền API | Cao |
| BUG-AUTH-03 | AUTH-18, `api/auth.cy.js` | Lễ tân gọi `GET /api/users`; API trả **200** | **403**, theo TC-AUTH-18 có sẵn | Cao |
| BUG-INV-01 | INV-07/08/09, `api/invoices.cy.js` | Lập hóa đơn lần lượt cho O1 `tiep_nhan`, O5 `dang_sua`, O4 `huy`; số hóa đơn tăng từ **1 lên 2** trong từng ca | Chỉ lập cho phiếu **hoàn thành và chưa có hóa đơn**; từ chối, DB không đổi. UC-03 nêu lỗi **400** nếu chưa hoàn thành | Cao |
| BUG-INV-02 | INV-06, `api/invoices.cy.js` | O2 có `payment_method='bitcoin'`; số hóa đơn vẫn tăng **1 → 2** | Chỉ 3 phương thức **Tiền mặt / Chuyển khoản / Thẻ**, SRS 1.1.7 | Trung bình |
| BUG-INV-03 | INV-17, `ui/invoices.cy.js` | Mở lập hóa đơn O2; dropdown chỉ có `tien_mat`, `chuyen_khoan` | Phải có lựa chọn **Thẻ**, SRS 1.1.7. API nhận `the` không chứng minh UI hỗ trợ phương thức này | Trung bình |
| BUG-INV-04 | INV-19, `api/invoices.cy.js` | Thêm P1×1 vào O3 đã thanh toán; API trả **200** | Chứng từ đã chốt phải bất biến; từ chối thay đổi làm lệch chi tiết hóa đơn. Căn cứ SRS 1.1.7 về tính bất biến | Cao |
| BUG-ORD-01 | ORD-13, `api/orders.cy.js` | Cập nhật O1 với `status='khong_hop_le'`; API trả **200** | Không chấp nhận trạng thái ngoài vòng đời được quy định và Hủy, SRS 1.1.3 | Cao |

Các ca AUTH được giữ từ bộ nhóm, không viết thêm module nhân viên P2 hoặc lặp lại kiểm tra tự xóa tài khoản; TC-AUTH-19 vẫn đảm nhiệm trường hợp đó.

## 2. Phát hiện cần chốt quy tắc biên / hợp đồng HTTP

Trạng thái các dòng này là **cần xác nhận yêu cầu**. Chưa có file Excel để khẳng định đây là expected cuối cùng đã được nhóm duyệt. Dữ liệu thực tế và assertion vẫn được giữ để đánh giá minh bạch.

| Mã phát hiện | TC | Dữ liệu / thực tế | Kỳ vọng đang đề xuất và điều cần chốt |
|---|---|---|---|
| REVIEW-INV-01 | INV-04, INV-05 | O2 có `discount=-1` hoặc `500001`; hóa đơn vẫn được thêm, số bản ghi **1 → 2** | Giảm giá phải trong `[0, tổng tiền]`; từ chối thay vì tăng tiền hoặc sinh tổng âm. Cần chốt miền hợp lệ trong Excel |
| REVIEW-INV-02 | INV-10 | Lập lại cho O3 đã có hóa đơn; **500**, DB không thêm bản ghi | Từ chối nghiệp vụ **400**. Quy tắc không lập trùng rõ theo UC-03; **mã HTTP cụ thể** cần được nhóm chốt |
| REVIEW-INV-03 | INV-11, INV-12 | Thiếu `repair_order_id` hoặc dùng `99999`; **500**, DB không đổi | Lần lượt **400/404** và thông báo nghiệp vụ rõ. Cần chốt hợp đồng lỗi API |
| REVIEW-ORD-01 | ORD-08, ORD-18 | Vượt tồn P1 hoặc lấy P3 hết hàng: API **500**; tồn kho, tổng phiếu và dòng phụ tùng **đều rollback đúng** | Ca fail ở yêu cầu **4xx**; không báo nhầm rằng ứng dụng cho xuất vượt kho. Cần chốt mã lỗi nghiệp vụ |
| REVIEW-ORD-02 | ORD-16 | Thêm S1 với `qty=0`; API **200** | Số lượng dùng dịch vụ phải là số nguyên dương; xác nhận quy tắc thay vì tự mặc định `0 → 1` |
| REVIEW-ORD-03 | ORD-17 | Thêm P1 với `qty=-1`; API **200** | Từ chối số lượng âm, không làm tăng kho / giảm tổng phiếu. Cần đối chiếu TC chi tiết |
| REVIEW-PRT-01 | PRT-04, PRT-05 | Tạo phụ tùng có `price=-1` hoặc `stock_qty=-1`; API **200** | Không lưu giá/tồn âm. Góp ý có ví dụ tên PRT-05 nhưng chưa có đầy đủ hàng Excel để xác nhận dữ liệu và expected |
| REVIEW-PRT-02 | PRT-07 | Tạo với `min_stock=0`, lưu thành **5** | Giữ 0 nếu 0 là ngưỡng hợp lệ. Cần xác nhận miền ngưỡng tồn tối thiểu; không suy ngược quy tắc từ toán tử `||` trong code |
| REVIEW-PRT-03 | PRT-09 | Xóa P1 đang được dùng; **500**, phụ tùng và dòng O2 **vẫn còn** | Bảo vệ dữ liệu đang tham chiếu và trả **4xx** rõ ràng. Fail hiện tại ở mã phản hồi, không phải dữ liệu bị xóa |
| REVIEW-PRT-04 | PRT-12 | Restock P1 với `qty=1.5`; **500**, kho vẫn 10 | Validate số nguyên dương và trả **4xx**; cần chốt quy tắc số lượng nguyên và mã lỗi |
| REVIEW-PRT-05 | PRT-16 | Restock id `99999`; API báo **200** mặc dù không có phụ tùng | Trả **404**, không thông báo thành công cho đối tượng không tồn tại. Cần xác nhận hợp đồng API |

Các ca đang Pass cũng có quy tắc cần chốt, ví dụ giảm giá đúng toàn bộ tổng tiền cho ra hóa đơn 0 (INV-03), mã API dùng cho Thẻ và mã thành công 200. Xem `TRACEABILITY.md` trước khi ký xác nhận phủ Excel.

## 3. Dashboard – giai đoạn 2

Chạy riêng `npm run test:dashboard`: **5 lượt, 4 Pass / 1 Fail / 0 Pending / 0 Skipped**.

| Mã | TC | Thực tế | Kỳ vọng |
|---|---|---|---|
| BUG-DASH-01 | TC-DASH-02, `ui/dashboard.phase2.cy.js` | Không tìm thấy thẻ **Số xe** | Hiển thị số xe, theo SRS 3.8.1 trong góp ý; seed có 2 xe |

Bốn thẻ yêu cầu còn lại được kiểm tra riêng và Pass: số khách hàng, số phiếu đang xử lý, doanh thu hôm nay, doanh thu tháng này. **Không kiểm tra “đúng 6 thẻ”.** Tên TC-DASH là mã tạm để tra cứu, chưa ánh xạ Excel.

Các module P2 khác và REG-01 báo cáo tháng 2 không nằm trong lệnh P1 mặc định. Việc dashboard của sản phẩm tải các API thống kê khi login không đồng nghĩa bộ P1 đã kiểm thử đầy đủ module báo cáo.

## 4. Quy trình xử lý và retest

1. Với các lỗi có SRS rõ: tạo/cập nhật bug của nhóm, ghi spec, mã TC, seed, expected, actual và phiên bản sản phẩm.
2. Với các dòng REVIEW: chốt điều kiện biên hoặc HTTP contract từ Excel/SRS trước khi kết luận bug. Nếu tài liệu chưa nói rõ, cập nhật yêu cầu được duyệt trước.
3. Sửa sản phẩm trong luồng công việc của nhóm. Gói test này giữ nguyên `backend/` và `frontend/`.
4. Chạy lại cùng lệnh. Không sửa expected theo hành vi sai; chỉ đổi expected khi có thay đổi yêu cầu được duyệt.
5. Giữ báo cáo thực chạy của lần retest, cập nhật trạng thái bug dựa trên bằng chứng.
