# Xác minh bản sửa theo Test Case.xlsx.pdf – 11/11/2026

Repo nguồn: `kimvux/Test---GarageManagement`, nhánh `test`, commit `a408c91f5234dc74e0de913095ca53d7a79e9156`. Mã backend/frontend giữ nguyên. Thay đổi nằm trong `tests/`.

## Kết quả thực chạy

Bộ chính gồm **đúng 82 mã duy nhất trong PDF**: AUTH20, ORD22, PRT22, INV18. Hai lượt chạy toàn bộ cho cùng tập Pass/Fail. Không chỉ đếm số lượng: danh mục trong `scripts/check-tests.js` đối chiếu từng mã với đúng file API/UI, phát hiện thiếu, trùng, sai vị trí hoặc spec thừa.

| Spec | Tổng | Pass | Fail |
|---|---:|---:|---:|
| `ui/invoices.cy.js` | 3 | 2 | 1 |
| `ui/login.cy.js` | 1 | 1 | 0 |
| `ui/orders.cy.js` | 1 | 1 | 0 |
| `api/auth.cy.js` | 19 | 15 | 4 |
| `api/invoices.cy.js` | 15 | 6 | 9 |
| `api/orders.cy.js` | 21 | 9 | 12 |
| `api/parts.cy.js` | 22 | 9 | 13 |
| **Tổng** | **82** | **43** | **39** |

**Pending 0, Skipped 0.** Toàn bộ 39 lỗi trong báo cáo là `AssertionError` đối chiếu ứng dụng với expected của PDF. Không ghi nhận lỗi cú pháp, compile spec, Cypress command hoặc hook làm bỏ qua các ca sau. Đây là kết quả tại môi trường được mô tả dưới đây; không cam kết mọi môi trường đều không có lỗi.

Ví dụ phân biệt rõ: PRT03 rollback kho đúng nhưng API trả500 thay vì400; INV09 trả500 thay vì400 nhưng INV10 kiểm tra rollback hóa đơn **Pass**. Không kết luận “tạo hóa đơn trùng” chỉ từ việc sai mã HTTP. Xem [BUG_REPORT.md](BUG_REPORT.md) cho từng ca.

Bằng chứng: [P1 JSON](verification/2026-11-11/p1-results.json), [P1 Markdown](verification/2026-11-11/p1-results.md), [P1 CSV](verification/2026-11-11/p1-results.csv). CSV có mã TC, trạng thái và lỗi thực tế để mở bằng Excel.

## Môi trường

| Thành phần | Đã dùng |
|---|---|
| Hệ điều hành | Linux Debian13, x64 |
| Node / Cypress | 24.22.1 / 13.17.0 |
| Browser | Electron118 đi kèm Cypress, headless; Xvfb |
| Docker Engine | 29.9.2, daemon local |
| PostgreSQL | Container `autogara-test`, image `postgres:16`, PostgreSQL16.15 |
| Database | Local `127.0.0.1:5433/autogara_test` |
| Backend / UI | Express và giao diện thật, localhost3000/5500 |
| API UI | `cy.useLocalApi()` chuyển tiếp request thật, không stub response |

Đã thực hiện tải image, tạo container bằng `npm run db:up`, `npm ci`, `npm run setup` và chạy `npm test` qua runner nguyên bản. Lượt đầu cố ý truyền URL cũ `CYPRESS_baseUrl=https://example.invalid` và `CYPRESS_apiUrl=https://example.invalid`; runner loại cấu hình cũ và vẫn chạy đủ 82 ca local. Không gọi API Render hoặc CSDL Neon.

Môi trường cloud thiếu Xvfb và không cho ghi cấu hình Cypress vào home. Đã tải các gói Debian chính thức, kiểm tra SHA256, giải nén Xvfb vào thư mục scratch và cấu hình `PATH`, `XDG_CONFIG_HOME`, `XDG_CACHE_HOME`, `CYPRESS_CACHE_FOLDER` cho phiên xác minh. Đây là thiết lập riêng của môi trường kiểm chứng, không thêm đường dẫn cloud vào mã test hoặc yêu cầu người dùng Windows/macOS làm theo.

## Kiểm tra trước bàn giao

- Cú pháp 21 file JavaScript đạt; 82 mã PDF đúng vị trí, không thiếu/trùng; 5 ca dashboard bổ sung được loại khỏi lệnh chính.
- Không `.skip/.only`, helper API cũ, vai trò kỹ thuật hoặc live-smoke. UI có seed và `cy.useLocalApi()`.
- Tiền điều kiện liên quan ca trước được dựng lại độc lập trong ORD20/21 và INV10/15.
- Sau cleanup: CSDL trở về seed, P1 tồn 10; cổng3000/5500 đóng. PostgreSQL được giữ để lần sau chạy nhanh.
- c8 của lượt toàn bộ: Statements/Lines 81,65%; Branches 73,55%; Functions 100%. Coverage chỉ đo backend/server.js, không chứng minh ứng dụng đạt yêu cầu.
- `git diff --check` đạt; không có thay đổi trong `backend/` hoặc `frontend/`.

Windows CMD/PowerShell, macOS và chế độ tương tác Cypress Open chưa được thực thi trong phiên Linux này. Các lệnh chạy trong hướng dẫn dùng Node và Docker CLI tương thích nhiều nền tảng; giới hạn này được nêu để không đánh đồng kiểm chứng Linux với chạy trên mọi máy.

## Dashboard bổ sung

Chạy riêng `npm run test:dashboard` theo năm yêu cầu tại SRS3.8.1 trong góp ý. Các mã TC-DASH là định danh nội bộ cho nhóm bổ sung, **không thuộc82 mã PDF**. Không kiểm tra “đúng6 thẻ”. **Kết quả: 5 ca, 4 Pass / 1 Fail / 0 Pending / 0 Skipped**; Fail ở thẻ Số xe bị thiếu. Bằng chứng được lưu riêng tại `verification/2026-11-11/dashboard-results.*`.
