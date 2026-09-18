const db = require("../config/database");

async function timTheoTen(tenDangNhap) {
  const [rows] = await db.execute(
    "SELECT id, ten_dang_nhap, mat_khau, vai_tro FROM nguoi_dung WHERE ten_dang_nhap = ? LIMIT 1",
    [tenDangNhap],
  );
  return rows[0] || null;
}

module.exports = { timTheoTen };
