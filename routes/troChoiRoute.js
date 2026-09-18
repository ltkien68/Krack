const router = require("express").Router();
const c = require("../controllers/troChoiController");
const { kiemTraDangNhap } = require("../middleware/kiemTraDangNhap");
router.post("/tra-loi", kiemTraDangNhap, c.traLoi);
router.post("/tra-loi-cuoi", kiemTraDangNhap, c.traLoiCuoi);
module.exports = router;
