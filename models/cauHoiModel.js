const db = require("../config/database");

async function kiemTra(manhId, dapAn) {
  const [rows] = await db.execute(
    "SELECT dap_an_dung FROM cau_hoi WHERE ma_manh_ghep = ? LIMIT 1",
    [manhId],
  );
  if (!rows[0]) return false;
  return (
    String(rows[0].dap_an_dung).trim().toLocaleLowerCase("vi") ===
    String(dapAn).trim().toLocaleLowerCase("vi")
  );
}

module.exports = { kiemTra };
