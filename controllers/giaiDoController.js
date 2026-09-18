const path = require("path");
const GiaiDo = require("../models/giaiDoModel");

async function danhSachUser(req, res, next) {
  try {
    res.json(await GiaiDo.layTatCa(true));
  } catch (e) {
    next(e);
  }
}

async function danhSachAdmin(req, res, next) {
  try {
    res.json(await GiaiDo.layTatCa(false));
  } catch (e) {
    next(e);
  }
}

async function chiTiet(req, res, next) {
  try {
    const phan = await GiaiDo.timTheoId(Number(req.params.id));
    if (!phan)
      return res.status(404).json({ message: "Không tìm thấy thử thách." });
    const manh = await GiaiDo.layManhTheoGiaiDo(phan.id);
    res.json({ phan, manh });
  } catch (e) {
    next(e);
  }
}

async function tao(req, res, next) {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Bắt buộc chọn ảnh bí mật." });

    const body = req.body;
    const soHang = Math.max(2, Math.min(5, Number(body.soHang || 3)));
    const soCot = Math.max(2, Math.min(5, Number(body.soCot || 3)));
    let dsCauHoi;

    try {
      dsCauHoi = JSON.parse(body.dsCauHoi || "[]");
    } catch {
      return res.status(400).json({ message: "Dữ liệu câu hỏi không hợp lệ." });
    }

    if (dsCauHoi.length !== soHang * soCot) {
      return res
        .status(400)
        .json({ message: "Số câu hỏi không khớp số mảnh." });
    }

    const data = {
      tieuDe: String(body.tieuDe || "").trim(),
      moTa: String(body.moTa || "").trim(),
      soHang,
      soCot,
      anhBiMat: "/uploads/anh-giai-do/" + req.file.filename,
      loaiCauHoiCuoi: body.loaiCauHoiCuoi || "tra_loi_ngan",
      cauHoiCuoi: String(body.cauHoiCuoi || "").trim(),
      dapAnCuoi: String(body.dapAnCuoi || "").trim(),
      cuoiA: String(body.cuoiA || "").trim(),
      cuoiB: String(body.cuoiB || "").trim(),
      cuoiC: String(body.cuoiC || "").trim(),
      cuoiD: String(body.cuoiD || "").trim(),
      cuoiDung: String(body.cuoiDung || "").trim(),
      phanThuongLon: String(body.phanThuongLon || "").trim(),
    };

    if (!data.tieuDe || !data.cauHoiCuoi) {
      return res
        .status(400)
        .json({ message: "Thiếu tiêu đề hoặc câu hỏi cuối." });
    }

    const id = await GiaiDo.taoGiaiDo(data, dsCauHoi);
    res.status(201).json({ id, message: "Đã tạo thử thách." });
  } catch (e) {
    next(e);
  }
}

async function xoa(req, res, next) {
  try {
    await GiaiDo.xoa(Number(req.params.id));
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

module.exports = { danhSachUser, danhSachAdmin, chiTiet, tao, xoa };
