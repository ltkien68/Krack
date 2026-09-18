# KRACK — HTML/CSS/JS + Node.js + MySQL

Bản này bỏ PHP hoàn toàn.

## Stack
- Frontend: HTML + CSS + JavaScript thuần
- Backend: JavaScript Node.js + Express
- Database: MySQL/MariaDB (có thể quản lý bằng phpMyAdmin/XAMPP)
- Upload ảnh: Multer
- Login: express-session + bcrypt
- DB driver: mysql2
- Không có vòng quay thưởng

## Chạy trên VS Code

### 1. MySQL
Bật MySQL trong XAMPP.
Mở phpMyAdmin và Import:
`database/krack.sql`

### 2. Mở project
Mở folder `Krack_NodeJS` bằng VS Code.

### 3. Tạo .env
Copy `.env.example` thành `.env`.
Nếu MySQL XAMPP dùng root không mật khẩu thì giữ nguyên.

### 4. Cài package
Mở Terminal VS Code:
```bash
npm install
```

### 5. Chạy
```bash
npm run dev
```

Mở:
http://localhost:3000

## Tài khoản
- Admin: ltkien / 123
- User: kienlt / 123

## Chức năng hiện có
- Login / logout / session / phân quyền
- Admin xem danh sách, tạo, xóa thử thách
- Grid động 2x2 đến 5x5
- Upload ảnh bí mật
- Câu hỏi từng mảnh: trắc nghiệm 4 đáp án hoặc đúng/sai
- Câu hỏi cuối: trắc nghiệm hoặc trả lời ngắn
- Nhiều đáp án ngắn có thể nhập bằng dấu `|`
- Phần thưởng lớn khi thắng
- User chọn thử thách
- Puzzle động theo số hàng/cột
- Flip animation, mở mảnh, lộ ảnh
- Nút "Trả lời ngay" xuất hiện sau khi phá mảnh đầu tiên
- Reset game phía client
- Không có vòng quay

## MVC
Backend chia:
- models: truy cập MySQL
- controllers: logic
- routes: endpoint
- middleware: login/admin

Frontend nằm trong `public/`.
