CREATE DATABASE IF NOT EXISTS krack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE krack;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS cau_hoi;
DROP TABLE IF EXISTS manh_ghep;
DROP TABLE IF EXISTS phan_giai_do;
DROP TABLE IF EXISTS nguoi_dung;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE nguoi_dung (
 id INT AUTO_INCREMENT PRIMARY KEY,
 ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
 mat_khau VARCHAR(255) NOT NULL,
 vai_tro ENUM('admin','user') NOT NULL,
 ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phan_giai_do (
 id INT AUTO_INCREMENT PRIMARY KEY,
 tieu_de VARCHAR(255) NOT NULL,
 mo_ta TEXT,
 so_hang INT NOT NULL,
 so_cot INT NOT NULL,
 anh_bi_mat VARCHAR(255) NOT NULL,
 loai_cau_hoi_cuoi ENUM('trac_nghiem','tra_loi_ngan') NOT NULL,
 cau_hoi_cuoi TEXT NOT NULL,
 dap_an_cuoi VARCHAR(500),
 dap_an_a VARCHAR(255),
 dap_an_b VARCHAR(255),
 dap_an_c VARCHAR(255),
 dap_an_d VARCHAR(255),
 dap_an_dung VARCHAR(255),
 phan_thuong_lon VARCHAR(255),
 trang_thai TINYINT DEFAULT 1,
 ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE manh_ghep (
 id INT AUTO_INCREMENT PRIMARY KEY,
 ma_phan_giai_do INT NOT NULL,
 vi_tri INT NOT NULL,
 FOREIGN KEY(ma_phan_giai_do) REFERENCES phan_giai_do(id) ON DELETE CASCADE
);

CREATE TABLE cau_hoi (
 id INT AUTO_INCREMENT PRIMARY KEY,
 ma_manh_ghep INT NOT NULL,
 loai ENUM('trac_nghiem','dung_sai') NOT NULL,
 noi_dung TEXT NOT NULL,
 dap_an_a VARCHAR(255),
 dap_an_b VARCHAR(255),
 dap_an_c VARCHAR(255),
 dap_an_d VARCHAR(255),
 dap_an_dung VARCHAR(255) NOT NULL,
 FOREIGN KEY(ma_manh_ghep) REFERENCES manh_ghep(id) ON DELETE CASCADE
);

INSERT INTO nguoi_dung(ten_dang_nhap,mat_khau,vai_tro) VALUES
('ltkien','$2b$10$7EqJtq98hPqEX7fNZaFWoO5e2Yt8S.2a9jF5b5X4uH4y2j9Qx3v2K','admin'),
('kienlt','$2b$10$7EqJtq98hPqEX7fNZaFWoO5e2Yt8S.2a9jF5b5X4uH4y2j9Qx3v2K','user');
