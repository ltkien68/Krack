function kiemTraDangNhap(req, res, next) {
  if (!req.session.nguoiDung) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }
  next();
}

function kiemTraAdmin(req, res, next) {
  if (!req.session.nguoiDung) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }
  if (req.session.nguoiDung.vaiTro !== "admin") {
    return res.status(403).json({ message: "Không có quyền admin." });
  }
  next();
}

module.exports = { kiemTraDangNhap, kiemTraAdmin };
