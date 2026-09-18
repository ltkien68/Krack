const CauHoi = require("../models/cauHoiModel");
const GiaiDo = require("../models/giaiDoModel");

async function traLoi(req, res, next) {
  try {
    const dung = await CauHoi.kiemTra(Number(req.body.manhId), req.body.dapAn);
    res.json({ dung });
  } catch (e) {
    next(e);
  }
}

async function traLoiCuoi(req, res, next) {
  try {
    const phan = await GiaiDo.timTheoId(Number(req.body.phanId));
    if (!phan)
      return res.status(404).json({ message: "Không tìm thấy thử thách." });

    const input = String(req.body.dapAn || "")
      .trim()
      .toLocaleLowerCase("vi");
    let dung = false;

    if (phan.loai_cau_hoi_cuoi === "tra_loi_ngan") {
      const ds = String(phan.dap_an_cuoi || "")
        .split("|")
        .map((x) => x.trim().toLocaleLowerCase("vi"))
        .filter(Boolean);
      dung = ds.includes(input);
    } else {
      dung =
        input ===
        String(phan.dap_an_dung || "")
          .trim()
          .toLocaleLowerCase("vi");
    }

    res.json({ dung, phanThuong: phan.phan_thuong_lon });
  } catch (e) {
    next(e);
  }
}

module.exports = { traLoi, traLoiCuoi };
