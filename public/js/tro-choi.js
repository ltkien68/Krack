const state = { current: null, selected: null, opened: new Set(), final: null };
let data = null;

(async () => {
  await layNguoiDung();
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return (location.href = "/chon-tro-choi.html");
  try {
    data = await api("/api/giai-do/" + id);
    document.getElementById("gameTitle").textContent = data.phan.tieu_de;
    document.getElementById("secret").style.backgroundImage =
      `url('${data.phan.anh_bi_mat}')`;
    document.getElementById("finalQuestion").textContent =
      data.phan.cau_hoi_cuoi;
    build();
  } catch (e) {
    toast(e.message);
  }
})();

function build() {
  const box = document.getElementById("tiles");
  box.style.gridTemplateColumns = `repeat(${data.phan.so_cot},1fr)`;
  box.style.gridTemplateRows = `repeat(${data.phan.so_hang},1fr)`;
  data.manh.forEach((m, i) => {
    const b = document.createElement("button");
    b.className = "tile";
    b.textContent = String(m.vi_tri).padStart(2, "0");
    b.onclick = () => chonManh(i, b);
    box.appendChild(b);
  });
  capNhatTienDo();
}
function chonManh(i, el) {
  if (state.opened.has(i)) return;
  state.current = i;
  state.selected = null;
  document.getElementById("empty").style.display = "none";
  document.getElementById("question").classList.add("show");
  const m = data.manh[i];
  document.getElementById("qKicker").textContent =
    "MẢNH GHÉP " + String(m.vi_tri).padStart(2, "0");
  document.getElementById("qText").textContent = m.noi_dung;
  const opts =
    m.loai === "dung_sai"
      ? [m.dap_an_a, m.dap_an_b]
      : [m.dap_an_a, m.dap_an_b, m.dap_an_c, m.dap_an_d];
  const box = document.getElementById("answers");
  box.innerHTML = "";
  opts.filter(Boolean).forEach((x) => {
    const b = document.createElement("button");
    b.className = "answer";
    b.textContent = x;
    b.onclick = () => {
      state.selected = x;
      box
        .querySelectorAll(".answer")
        .forEach((z) => z.classList.remove("selected"));
      b.classList.add("selected");
    };
    box.appendChild(b);
  });
}
async function guiDapAn() {
  if (state.current === null || state.selected === null)
    return toast("Chọn một đáp án trước đã.");
  try {
    const m = data.manh[state.current];
    const j = await api("/api/tro-choi/tra-loi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manhId: m.id, dapAn: state.selected }),
    });
    const btn = [...document.querySelectorAll("#answers .answer")].find(
      (x) => x.textContent === state.selected,
    );
    if (j.dung) {
      btn?.classList.add("correct");
      setTimeout(moManh, 450);
    } else {
      btn?.classList.add("wrong");
      toast("Chưa chính xác. Thử lại nhé.");
    }
  } catch (e) {
    toast(e.message);
  }
}
function moManh() {
  state.opened.add(state.current);
  document.querySelectorAll(".tile")[state.current].classList.add("open");
  document.getElementById("guessBtn").classList.add("show");
  document.getElementById("question").classList.remove("show");
  document.getElementById("empty").style.display = "block";
  state.current = null;
  state.selected = null;
  capNhatTienDo();
}
function capNhatTienDo() {
  document.getElementById("progress").textContent =
    `${state.opened.size} / ${data?.manh?.length || 0} mảnh đã mở`;
}
function openGuess() {
  state.final = null;
  const box = document.getElementById("finalOptions");
  box.innerHTML = "";
  const input = document.getElementById("finalInput");
  input.value = "";
  if (data.phan.loai_cau_hoi_cuoi === "trac_nghiem") {
    input.style.display = "none";
    [
      data.phan.dap_an_a,
      data.phan.dap_an_b,
      data.phan.dap_an_c,
      data.phan.dap_an_d,
    ]
      .filter(Boolean)
      .forEach((x) => {
        const b = document.createElement("button");
        b.className = "answer";
        b.textContent = x;
        b.onclick = () => {
          state.final = x;
          box
            .querySelectorAll(".answer")
            .forEach((z) => z.classList.remove("selected"));
          b.classList.add("selected");
        };
        box.appendChild(b);
      });
  } else input.style.display = "block";
  document.getElementById("guessOverlay").classList.add("show");
}
async function finalAnswer() {
  const ans =
    data.phan.loai_cau_hoi_cuoi === "trac_nghiem"
      ? state.final
      : document.getElementById("finalInput").value;
  if (!ans) return toast("Nhập hoặc chọn câu trả lời.");
  try {
    const j = await api("/api/tro-choi/tra-loi-cuoi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phanId: data.phan.id, dapAn: ans }),
    });
    if (j.dung) {
      closeModal("guessOverlay");
      document.getElementById("prizeName").textContent =
        j.phanThuong || "Phần thưởng đặc biệt";
      setTimeout(
        () => document.getElementById("winOverlay").classList.add("show"),
        200,
      );
    } else {
      closeModal("guessOverlay");
      toast("Chưa đúng. Hãy mở thêm vài mảnh ✦");
    }
  } catch (e) {
    toast(e.message);
  }
}
function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}
function resetGame() {
  if (confirm("Đặt lại toàn bộ mảnh đã mở?")) location.reload();
}
