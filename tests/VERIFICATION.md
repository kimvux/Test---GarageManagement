# Xác minh bộ Cypress – 11/11/2026

Bản sản phẩm đối chiếu: repo nhóm `kimvux/Test---GarageManagement`, nhánh `test`, commit `ba91fa7f7cffd18e691b7ad66e79bf25aed0c460`. Toàn bộ thay đổi nằm trong `tests/`; đã kiểm tra không có diff trong `backend/` và `frontend/`.

## Kết quả thực chạy

| Spec | Tổng | Pass | Fail |
|---|---:|---:|---:|
| `cypress/e2e/ui/invoices.cy.js` | 3 | 2 | 1 |
| `cypress/e2e/ui/login.cy.js` | 1 | 1 | 0 |
| `cypress/e2e/ui/orders.cy.js` | 3 | 3 | 0 |
| `cypress/e2e/ui/parts.cy.js` | 3 | 3 | 0 |
| `cypress/e2e/api/auth.cy.js` | 19 | 15 | 4 |
| `cypress/e2e/api/invoices.cy.js` | 19 | 9 | 10 |
| `cypress/e2e/api/orders.cy.js` | 18 | 13 | 5 |
| `cypress/e2e/api/parts.cy.js` | 16 | 10 | 6 |
| **P1** | **82** | **56** | **26** |

**Pending = 0; Skipped = 0.** Lần chạy lại có cùng tập test và cùng trạng thái Pass/Fail với lần chạy đầu. Toàn bộ 26 lỗi của lần cuối đều là `AssertionError`, không có lỗi cú pháp, lỗi compile spec hoặc Cypress command trong kết quả đã ghi. Điều này xác nhận bộ test đã thực thi trong môi trường ghi dưới đây; không phải cam kết phần mềm không bao giờ có lỗi ở mọi môi trường.

Dashboard chạy riêng giai đoạn 2: **5 test, 4 Pass / 1 Fail / 0 Pending / 0 Skipped**. Test fail vì thiếu thẻ số xe theo SRS 3.8.1. Không kiểm tra tổng số thẻ.

Chi tiết: [P1 JSON](verification/2026-11-11/p1-results.json), [P1 Markdown](verification/2026-11-11/p1-results.md), [dashboard JSON](verification/2026-11-11/dashboard-results.json), [dashboard Markdown](verification/2026-11-11/dashboard-results.md). Phân loại yêu cầu rõ và quy tắc cần chốt tại [BUG_REPORT.md](BUG_REPORT.md).

## Môi trường xác minh

| Thành phần | Thực tế sử dụng |
|---|---|
| Hệ điều hành | Linux Debian 13, x64 |
| Node | 24.22.1 |
| Cypress | 13.17.0 |
| Browser | Electron 118 đi kèm Cypress, headless |
| Backend/frontend | Mã sản phẩm nguyên trạng của nhánh nhóm; Express thật, giao diện thật |
| CSDL | PostgreSQL **16.15 thật**, local port 5433, database autogara_test; dùng cùng seed và schema |
| API UI | Chuyển tiếp bằng cy.useLocalApi; không stub response, không gọi API Render/Neon |

**Môi trường xác minh không có Docker Engine**, nên đã khởi chạy PostgreSQL 16 trực tiếp để thực thi Cypress. Gói giao cho người dùng vẫn tạo/bật `postgres:16` qua Docker Desktop theo góp ý. Chưa thực thi trực tiếp bước tạo container Docker, Windows CMD/PowerShell hoặc chế độ Cypress Open trên Windows; không tuyên bố các bước này đã được chạy ở đây.

## Những vấn đề kỹ thuật đã kiểm tra

- Kiểm tra cú pháp đủ **22 file JavaScript**, 87 tiêu đề test tĩnh (82 P1 + 5 dashboard P2); không có .only/.skip hay helper API cũ trong spec.
- 8 spec P1 được Cypress nạp và chạy thật. API và UI đều có PostgreSQL phía sau, không dùng mockGarage hoặc dữ liệu giả lập trả từ intercept.
- Lần chạy cuối cố ý truyền `CYPRESS_baseUrl=https://example.invalid` và `CYPRESS_apiUrl=https://example.invalid`; runner loại các cấu hình định tuyến cũ và vẫn hoàn tất đủ 82 test bằng local API. Không có yêu cầu người chạy sửa .cy.js để đổi môi trường.
- Sau khi bộ test kết thúc, đã truy vấn lại CSDL và xác nhận seed phục hồi: users=2, customers=2, vehicles=2, parts=4, repair_orders=5, invoices=1, P1.stock_qty=10.
- Sau cleanup, đã kiểm tra cổng **3000 và 5500 đóng**. Không để backend/frontend của runner chiếm port cho lần chạy tiếp theo.
- C8 xuất được báo cáo backend sau khi dừng: **Statements/Lines 81,53%; Branches 66,66%; Functions 100%** cho lần P1 cuối. Không suy ra phần mềm đạt yêu cầu từ tỷ lệ coverage.
- `package.json` và `package-lock.json` có cùng danh sách dependency; `git diff --check` đạt.

Báo cáo coverage và ảnh lỗi được tạo tại máy khi chạy, không kèm trong gói ZIP. Gói chứa kết quả JSON/Markdown để đọc lại các assertion.

## Giới hạn yêu cầu còn lại

**File Excel Test Case chưa được cung cấp.** Mã ORD/PRT/INV/DASH mới đang là mã tạm và một số miền dữ liệu/mã HTTP là đề xuất cần chốt. [TRACEABILITY.md](TRACEABILITY.md) liệt kê rõ từng ca. Chưa thể xác nhận khớp mã Excel hoặc phủ toàn bộ Test Case của nhóm.

Giữ nguyên các assertion theo SRS dù sản phẩm fail. Các dòng REVIEW cần chốt yêu cầu trước khi kết luận bug; không chuyển expected theo code hiện tại để làm đẹp kết quả.
