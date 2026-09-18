(async () => {
  const u = await layNguoiDung();
  document.querySelector("[data-user]").textContent = u.tenDangNhap;
  try {
    const ds = await api("/api/giai-do");
    const grid = document.getElementById("grid");
    if (!ds.length) {
      grid.innerHTML = '<p class="muted">Admin chưa tạo thử thách nào.</p>';
      return;
    }
    grid.innerHTML = ds
      .map(
        (p) => `
   <article class="game-card" onclick="location.href='/tro-choi.html?id=${p.id}'">
    <div class="cover" style="background-image:url('${p.anh_bi_mat}')"><span>${esc(p.tieu_de)}</span></div>
    <div class="card-info"><h3>${esc(p.tieu_de)}</h3><div class="muted">${esc(p.mo_ta || "")}</div><p class="muted">${p.so_hang} × ${p.so_cot} · ${p.so_manh} mảnh</p></div>
   </article>`,
      )
      .join("");
  } catch (e) {
    toast(e.message);
  }
})();
function esc(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}
