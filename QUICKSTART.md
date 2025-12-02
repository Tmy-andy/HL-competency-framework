# 🚀 QUICK START GUIDE

## Cài đặt nhanh trong 5 phút

### 1. Cài đặt MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# macOS (với Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows: Download từ mongodb.com và cài đặt
```

### 2. Backend Setup
```bash
cd backend

# Cài đặt dependencies
npm install

# Import dữ liệu mẫu
npm run seed

# Chạy server
npm run dev
```

✅ Backend running at http://localhost:5000

### 3. Frontend Setup
```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev
```

✅ Frontend running at http://localhost:3000

### 4. Đăng nhập

Mở trình duyệt: http://localhost:3000

**Tài khoản Admin:**
- Username: `admin`
- Password: `admin123`

**Tài khoản Manager:**
- Username: `manager1`
- Password: `manager123`

## 🎯 Các tính năng chính

- ✅ Dashboard với biểu đồ thống kê
- ✅ Quản lý 36 năng lực Barista
- ✅ Đánh giá nhân viên với 4 cấp độ
- ✅ Quản lý nhân viên & cửa hàng
- ✅ Báo cáo & phân tích
- ✅ Phân quyền theo vai trò

## 📝 Các pages cần tạo thêm

Hiện tại đã có Login và Dashboard. Bạn cần tạo thêm:

1. **Employees Page** - Quản lý nhân viên
2. **Assessments Page** - Danh sách đánh giá
3. **Create Assessment** - Tạo đánh giá mới
4. **Competencies Page** - Quản lý năng lực (Admin)
5. **Stores Page** - Quản lý cửa hàng (Admin)
6. **Reports Page** - Báo cáo chi tiết

Template code có trong README.md

## 🛠 Cấu trúc API

Tất cả endpoints đều có prefix `/api`

**Auth:** `/api/auth/*`
**Competencies:** `/api/competencies/*`
**Employees:** `/api/employees/*`
**Assessments:** `/api/assessments/*`
**Stores:** `/api/stores/*`
**Positions:** `/api/positions/*`

Chi tiết API xem trong README.md

## 💡 Tips

1. Backend phải chạy trước Frontend
2. Kiểm tra MongoDB đang chạy: `sudo systemctl status mongodb`
3. Nếu gặp lỗi port, đổi PORT trong .env
4. Tất cả API requests đều cần token (trừ login/register)
5. Token được lưu trong localStorage

## 📚 Xem thêm

- Xem README.md để biết chi tiết đầy đủ
- Code examples cho các pages trong README
- API documentation đầy đủ trong README

## ❓ Troubleshooting

**MongoDB không kết nối được?**
- Kiểm tra MongoDB service: `sudo systemctl status mongodb`
- Kiểm tra MONGODB_URI trong backend/.env

**Port 5000 bị chiếm?**
- Thay đổi PORT trong backend/.env

**Frontend không connect được Backend?**
- Kiểm tra backend đang chạy
- Xem vite.config.js proxy settings

---
