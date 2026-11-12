# Kết quả Cypress

2026-11-11T14:44:08.518Z

Commit: a408c91f5234dc74e0de913095ca53d7a79e9156

Tổng 5; Pass 4; Fail 1; Pending 0; Skipped 0.

| Spec | Test | Kết quả | Lỗi |
|---|---|---|---|
| cypress/e2e/ui/dashboard.phase2.cy.js | Giai đoạn 2 – Dashboard theo SRS 3.8.1 > TC-DASH-01 – Hiển thị số khách hàng | passed |  |
| cypress/e2e/ui/dashboard.phase2.cy.js | Giai đoạn 2 – Dashboard theo SRS 3.8.1 > TC-DASH-02 – Hiển thị số xe | failed | AssertionError: Timed out retrying after 6000ms: Expected to find content: '/^(Số xe\|Tổng (số )?xe)$/i' within the selector: '#dash-stats .stat-label' but never did.     at card (webpack://autogara-tests/./cypress/e2e/ui/dashboard.phase2.cy.js:4:5)     at Context.eval (webpack://autogara-tests/./cypress/e2e/ui/dashboard.phase2.cy.js:15:44) |
| cypress/e2e/ui/dashboard.phase2.cy.js | Giai đoạn 2 – Dashboard theo SRS 3.8.1 > TC-DASH-03 – Hiển thị số phiếu đang xử lý | passed |  |
| cypress/e2e/ui/dashboard.phase2.cy.js | Giai đoạn 2 – Dashboard theo SRS 3.8.1 > TC-DASH-04 – Hiển thị doanh thu hôm nay | passed |  |
| cypress/e2e/ui/dashboard.phase2.cy.js | Giai đoạn 2 – Dashboard theo SRS 3.8.1 > TC-DASH-05 – Hiển thị doanh thu tháng này | passed |  |
