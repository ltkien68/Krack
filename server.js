require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "krack_local_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 }
}));

app.use("/api/auth", require("./routes/dangNhapRoute"));
app.use("/api/giai-do", require("./routes/giaiDoRoute"));
app.use("/api/tro-choi", require("./routes/troChoiRoute"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Lỗi máy chủ." });
});

app.listen(PORT, () => {
  console.log(`Krack đang chạy: http://localhost:${PORT}`);
});
