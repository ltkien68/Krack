const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const c = require("../controllers/giaiDoController");
const {
  kiemTraDangNhap,
  kiemTraAdmin,
} = require("../middleware/kiemTraDangNhap");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads/anh-giai-do"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomBytes(12).toString("hex") + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(
      file.mimetype,
    );
    cb(ok ? null : new Error("Chỉ nhận JPG, PNG hoặc WEBP."), ok);
  },
});

router.get("/", kiemTraDangNhap, c.danhSachUser);
router.get("/admin", kiemTraAdmin, c.danhSachAdmin);
router.get("/:id", kiemTraDangNhap, c.chiTiet);
router.post("/", kiemTraAdmin, upload.single("anhBiMat"), c.tao);
router.delete("/:id", kiemTraAdmin, c.xoa);

module.exports = router;
