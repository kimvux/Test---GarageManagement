// Nạp trước server.js (node -r) để tiến trình thoát bình thường, nhờ đó c8 ghi được báo cáo độ phủ.
// Cách dừng: Ctrl+C trong cửa sổ đang chạy backend, hoặc `npm run backend:stop` từ cửa sổ khác
// (Windows không gửi được SIGINT cho tiến trình khác nên dùng file cờ).
const fs = require('fs');
const path = require('path');

for (const sig of ['SIGINT', 'SIGTERM', 'SIGBREAK']) {
  process.on(sig, () => process.exit(0));
}

const STOP_FILE = path.join(__dirname, '..', '.stop-backend');
fs.rmSync(STOP_FILE, { force: true });
setInterval(() => {
  if (fs.existsSync(STOP_FILE)) {
    fs.rmSync(STOP_FILE, { force: true });
    process.exit(0);
  }
}, 500).unref();
