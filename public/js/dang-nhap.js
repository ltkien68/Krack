document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const loi = document.getElementById("loi");
  loi.style.display = "none";
  try {
    const d = await api("/api/auth/dang-nhap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenDangNhap: document.getElementById("user").value,
        matKhau: document.getElementById("pass").value,
      }),
    });
    location.href =
      d.nguoiDung.vaiTro === "admin" ? "/admin.html" : "/trang-chu.html";
  } catch (e) {
    loi.textContent = e.message;
    loi.style.display = "block";
  }
});
(async () => {
  const u = await layNguoiDung(false);
  if (u)
    location.href = u.vaiTro === "admin" ? "/admin.html" : "/trang-chu.html";
})();
