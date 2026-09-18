(async () => {
  const u = await layNguoiDung();
  document
    .querySelectorAll("[data-user]")
    .forEach((x) => (x.textContent = u.tenDangNhap));
})();
