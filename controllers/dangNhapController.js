const bcrypt = require("bcrypt");
const NguoiDung = require("../models/nguoiDungModel");

async function dangNhap(req, res, next) {
  try {
    const { tenDangNhap, matKhau } = req.body;
    const user = await NguoiDung.timTheoTen(String(tenDangNhap || "").trim());

    if (
      !user ||
      !(await bcrypt.compare(String(matKhau || ""), user.mat_khau))
    ) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu." });
    }

    req.session.nguoiDung = {
      id: user.id,
      tenDangNhap: user.ten_dang_nhap,
      vaiTro: user.vai_tro,
    };

    res.json({ nguoiDung: req.session.nguoiDung });
  } catch (e) {
    next(e);
  }
}

function hienTai(req, res) {
  res.json({ nguoiDung: req.session.nguoiDung || null });
}

function dangXuat(req, res) {
  req.session.destroy(() => res.json({ ok: true }));
}

module.exports = { dangNhap, hienTai, dangXuat };
