const db = require("../config/database");

async function layTatCa(chiDangMo = false) {
  const where = chiDangMo ? "WHERE p.trang_thai = 1" : "";
  const [rows] = await db.query(`
    SELECT p.*, COUNT(m.id) AS so_manh
    FROM phan_giai_do p
    LEFT JOIN manh_ghep m ON m.ma_phan_giai_do = p.id
    ${where}
    GROUP BY p.id
    ORDER BY p.id DESC
  `);
  return rows;
}

async function timTheoId(id) {
  const [rows] = await db.execute(
    "SELECT * FROM phan_giai_do WHERE id = ? LIMIT 1",
    [id],
  );
  return rows[0] || null;
}

async function layManhTheoGiaiDo(id) {
  const [rows] = await db.execute(
    `
    SELECT m.id, m.vi_tri, c.loai, c.noi_dung,
           c.dap_an_a, c.dap_an_b, c.dap_an_c, c.dap_an_d
    FROM manh_ghep m
    JOIN cau_hoi c ON c.ma_manh_ghep = m.id
    WHERE m.ma_phan_giai_do = ?
    ORDER BY m.vi_tri
  `,
    [id],
  );
  return rows;
}

async function taoGiaiDo(data, dsCauHoi) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [r] = await conn.execute(
      `
      INSERT INTO phan_giai_do
      (tieu_de, mo_ta, so_hang, so_cot, anh_bi_mat,
       loai_cau_hoi_cuoi, cau_hoi_cuoi, dap_an_cuoi,
       dap_an_a, dap_an_b, dap_an_c, dap_an_d, dap_an_dung,
       phan_thuong_lon, trang_thai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `,
      [
        data.tieuDe,
        data.moTa,
        data.soHang,
        data.soCot,
        data.anhBiMat,
        data.loaiCauHoiCuoi,
        data.cauHoiCuoi,
        data.dapAnCuoi,
        data.cuoiA,
        data.cuoiB,
        data.cuoiC,
        data.cuoiD,
        data.cuoiDung,
        data.phanThuongLon,
      ],
    );

    const maGiaiDo = r.insertId;

    for (let i = 0; i < dsCauHoi.length; i++) {
      const [m] = await conn.execute(
        "INSERT INTO manh_ghep(ma_phan_giai_do, vi_tri) VALUES (?, ?)",
        [maGiaiDo, i + 1],
      );
      const q = dsCauHoi[i];
      await conn.execute(
        `
        INSERT INTO cau_hoi
        (ma_manh_ghep, loai, noi_dung, dap_an_a, dap_an_b, dap_an_c, dap_an_d, dap_an_dung)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [m.insertId, q.loai, q.noiDung, q.a, q.b, q.c, q.d, q.dung],
      );
    }

    await conn.commit();
    return maGiaiDo;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function xoa(id) {
  await db.execute("DELETE FROM phan_giai_do WHERE id = ?", [id]);
}

module.exports = { layTatCa, timTheoId, layManhTheoGiaiDo, taoGiaiDo, xoa };
