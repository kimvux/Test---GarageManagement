// Giai đoạn 2, chỉ chạy npm run test:dashboard. Không đếm tổng số thẻ.
// TC-DASH là định danh bổ sung ngoài 82 mã PDF; yêu cầu từ GOP_Y_LAB3 mục 3.8.1.
function card(label, value) {
  cy.contains('#dash-stats .stat-label', label).closest('.stat-card').find('.stat-value').should('contain', value);
}

describe('Giai đoạn 2 – Dashboard theo SRS 3.8.1', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.useLocalApi();
    cy.loginLocal();
    cy.get('#dash-stats .stat-card').should('exist');
  });
  it('TC-DASH-01 – Hiển thị số khách hàng', () => { card(/khách hàng/i, '2'); });
  it('TC-DASH-02 – Hiển thị số xe', () => { card(/^(Số xe|Tổng (số )?xe)$/i, '2'); });
  it('TC-DASH-03 – Hiển thị số phiếu đang xử lý', () => { card(/phiếu đang xử lý/i, '2'); });
  it('TC-DASH-04 – Hiển thị doanh thu hôm nay', () => { card(/doanh thu hôm nay/i, '50.000'); });
  it('TC-DASH-05 – Hiển thị doanh thu tháng này', () => { card(/doanh thu tháng này/i, '50.000'); });
});
