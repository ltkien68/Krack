async function api(url, options = {}) {
  const r = await fetch(url, options);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.message || "Có lỗi xảy ra.");
  return data;
}
function toast(text) {
  const t = document.getElementById("toast");
  if (!t) return alert(text);
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => t.classList.remove("show"), 2500);
}
async function layNguoiDung(batBuoc = true) {
  const d = await api("/api/auth/hien-tai");
  if (batBuoc && !d.nguoiDung) location.href = "/";
  return d.nguoiDung;
}
async function dangXuat() {
  await api("/api/auth/dang-xuat", { method: "POST" });
  location.href = "/";
}
