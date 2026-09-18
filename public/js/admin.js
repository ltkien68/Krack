let user = null;
(async () => {
  user = await layNguoiDung();
  if (user.vaiTro !== "admin") return (location.href = "/trang-chu.html");
  document.querySelector("[data-user]").textContent = user.tenDangNhap;
  await loadGames();
  taoDanhSachCauHoi();
})();

async function loadGames() {
  try {
    const ds = await api("/api/giai-do/admin");
    const box = document.getElementById("adminList");
    box.innerHTML = ds.length
      ? ds
          .map(
            (p) => `
   <article class="admin-row">
    <div><h3>${esc(p.tieu_de)}</h3><span class="muted">${p.so_hang} × ${p.so_cot} · ${p.so_manh} mảnh</span></div>
    <div class="actions"><button class="btn" onclick="window.open('/tro-choi.html?id=${p.id}','_blank')">Xem</button><button class="btn" onclick="xoaGame(${p.id})">Xóa</button></div>
   </article>`,
          )
          .join("")
      : '<p class="muted">Chưa có thử thách.</p>';
  } catch (e) {
    toast(e.message);
  }
}
function toggleForm() {
  document.getElementById("createArea").classList.toggle("hidden");
}
function taoDanhSachCauHoi() {
  const h = +document.getElementById("soHang").value,
    c = +document.getElementById("soCot").value,
    n = h * c,
    box = document.getElementById("questions");
  box.innerHTML = "";
  for (let i = 0; i < n; i++)
    box.insertAdjacentHTML(
      "beforeend",
      `
  <div class="q-card" data-q="${i}"><h3>Mảnh ${String(i + 1).padStart(2, "0")}</h3><div class="form-grid">
   <div class="control"><label>Loại</label><select class="q-loai" onchange="doiLoai(${i},this.value)"><option value="trac_nghiem">Trắc nghiệm 4 đáp án</option><option value="dung_sai">Đúng / Sai</option></select></div>
   <div class="control full"><label>Nội dung</label><textarea class="q-noidung" required></textarea></div>
   <div class="control"><label>Đáp án A</label><input class="q-a"></div><div class="control"><label>Đáp án B</label><input class="q-b"></div>
   <div class="control extra-${i}"><label>Đáp án C</label><input class="q-c"></div><div class="control extra-${i}"><label>Đáp án D</label><input class="q-d"></div>
   <div class="control"><label>Đáp án đúng</label><input class="q-dung" placeholder="Nhập đúng nội dung đáp án" required></div>
  </div></div>`,
    );
}
function doiLoai(i, v) {
  const card = document.querySelector(`[data-q="${i}"]`),
    ex = card.querySelectorAll(".extra-" + i);
  if (v === "dung_sai") {
    card.querySelector(".q-a").value = "Đúng";
    card.querySelector(".q-b").value = "Sai";
    ex.forEach((x) => (x.style.display = "none"));
  } else ex.forEach((x) => (x.style.display = "block"));
}
document.getElementById("createForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const qs = [...document.querySelectorAll(".q-card")].map((card) => ({
    loai: card.querySelector(".q-loai").value,
    noiDung: card.querySelector(".q-noidung").value,
    a: card.querySelector(".q-a").value,
    b: card.querySelector(".q-b").value,
    c: card.querySelector(".q-c").value,
    d: card.querySelector(".q-d").value,
    dung: card.querySelector(".q-dung").value,
  }));
  const fd = new FormData();
  [
    "tieuDe",
    "moTa",
    "soHang",
    "soCot",
    "loaiCauHoiCuoi",
    "cauHoiCuoi",
    "dapAnCuoi",
    "cuoiA",
    "cuoiB",
    "cuoiC",
    "cuoiD",
    "cuoiDung",
    "phanThuongLon",
  ].forEach((id) => fd.append(id, document.getElementById(id).value));
  fd.append("anhBiMat", document.getElementById("anhBiMat").files[0]);
  fd.append("dsCauHoi", JSON.stringify(qs));
  try {
    await api("/api/giai-do", { method: "POST", body: fd });
    toast("Đã tạo thử thách ✦");
    e.target.reset();
    taoDanhSachCauHoi();
    toggleForm();
    await loadGames();
  } catch (err) {
    toast(err.message);
  }
});
async function xoaGame(id) {
  if (!confirm("Xóa thử thách này?")) return;
  try {
    await api("/api/giai-do/" + id, { method: "DELETE" });
    await loadGames();
    toast("Đã xóa.");
  } catch (e) {
    toast(e.message);
  }
}
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
