const router = require("express").Router();
const c = require("../controllers/dangNhapController");
router.post("/dang-nhap", c.dangNhap);
router.get("/hien-tai", c.hienTai);
router.post("/dang-xuat", c.dangXuat);
module.exports = router;
