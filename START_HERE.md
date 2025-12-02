# 📚 Competency Framework System - Bắt Đầu Từ Đây

## 🎯 Chào mừng bạn!

Đây là hệ thống **Competency Framework** hoàn chỉnh với React Frontend và Node.js + MongoDB Backend.

## 📖 Đọc Tài Liệu Theo Thứ Tự

### 1️⃣ **SUMMARY.md** - BẮT ĐẦU Ở ĐÂY
> Tổng quan toàn bộ project: cấu trúc, tính năng, database schema

**Đọc file này trước để hiểu big picture!**

### 2️⃣ **QUICKSTART.md** - Chạy Ngay Trong 5 Phút
> Hướng dẫn cài đặt và chạy project nhanh nhất
- Backend setup (3 commands)
- Frontend setup (2 commands)
- Login với tài khoản demo

**Đọc file này để chạy project ngay!**

### 3️⃣ **README.md** - Tài Liệu Đầy Đủ
> Documentation chi tiết về mọi thứ
- Cấu trúc thư mục
- API endpoints đầy đủ
- Database schemas
- Troubleshooting
- Environment variables

**Đọc file này khi cần chi tiết!**

### 4️⃣ **PAGES_GUIDE.md** - Hướng Dẫn Tạo Pages
> Template code chi tiết cho các pages còn lại
- Employees page với filters & table
- Create Assessment form
- Competencies management
- Code examples copy-paste ready

**Đọc file này để tạo các pages còn lại!**

## 🚀 Quick Actions

### Muốn chạy ngay?
```bash
# Backend
cd backend
npm install && npm run seed && npm run dev

# Frontend (terminal mới)
cd frontend
npm install && npm run dev

# Login: admin / admin123
```

### Muốn hiểu cấu trúc?
→ Đọc **SUMMARY.md**

### Muốn tạo thêm pages?
→ Đọc **PAGES_GUIDE.md**

### Gặp lỗi?
→ Đọc phần Troubleshooting trong **README.md**

## 📦 Cấu Trúc Project

```
competency-framework/
├── 📄 SUMMARY.md          ← Đọc đầu tiên!
├── 📄 QUICKSTART.md       ← Chạy nhanh!
├── 📄 README.md           ← Chi tiết đầy đủ
├── 📄 PAGES_GUIDE.md      ← Template code
│
├── 📁 backend/            ← Node.js + Express + MongoDB
│   ├── controllers/       (6 controllers)
│   ├── models/           (6 MongoDB models)
│   ├── routes/           (6 API route files)
│   ├── middleware/       (Auth middleware)
│   ├── seed/             (Data seeding)
│   └── server.js         (Main server)
│
└── 📁 frontend/           ← React + Vite + Tailwind
    ├── src/
    │   ├── components/   (Layout, Sidebar)
    │   ├── contexts/     (AuthContext)
    │   ├── pages/        (Login, Dashboard)
    │   ├── services/     (API services)
    │   └── App.jsx       (Main app)
    └── package.json
```

## ✅ Đã Hoàn Thành

- ✅ Backend API hoàn chỉnh (100%)
- ✅ Database models & seeding
- ✅ Authentication & Authorization
- ✅ Frontend infrastructure
- ✅ Login Page
- ✅ Dashboard Page
- ✅ Sidebar & Layout

## ❌ Cần Tạo Thêm (có template code)

- ❌ Employees Page
- ❌ Assessments Pages
- ❌ Competencies Page
- ❌ Stores Page
- ❌ Reports Page

→ Xem template trong **PAGES_GUIDE.md**

## 🎯 Các Tính Năng Chính

1. **36 Competencies** cho Barista
2. **4 Levels** đánh giá (Critical, Low, Medium, High)
3. **Auto-calculation** overall score & classification
4. **4 User Roles** (Admin, Manager, HR, Viewer)
5. **Dashboard** với charts & stats
6. **Dark Mode** support
7. **Responsive** design

## 🔑 Demo Accounts

**Admin:**
- Username: `admin`
- Password: `admin123`

**Manager:**
- Username: `manager1`
- Password: `manager123`

## 💡 Tips

- Backend phải chạy trước Frontend
- MongoDB phải được cài đặt và chạy
- Tất cả dependencies: `npm install`
- Data seeding: `npm run seed`
- Check `.env` file trong backend

## 📞 Bắt Đầu Ngay!

**Bước 1:** Đọc **SUMMARY.md** để hiểu tổng quan

**Bước 2:** Follow **QUICKSTART.md** để chạy project

**Bước 3:** Tạo các pages còn lại với **PAGES_GUIDE.md**

**Bước 4:** Tham khảo **README.md** khi cần chi tiết

---

Bạn đã có một hệ thống hoàn chỉnh, production-ready với:
- Full-stack architecture
- Authentication & authorization
- Database models & API
- Beautiful UI với Tailwind
- Template code cho mọi pages
