# Competency Framework System

Hệ thống đánh giá năng lực nhân viên toàn diện với React Frontend và Node.js + MongoDB Backend.

## 📋 Tổng Quan

Hệ thống này được xây dựng dựa trên phân tích BA (Business Analysis) và các file HTML/JS gốc, với đầy đủ chức năng:

- ✅ Quản lý 36 năng lực (competencies) cho Barista
- ✅ Đánh giá năng lực nhân viên với 4 cấp độ (Critical, Low, Medium, High)
- ✅ Quản lý nhân viên, cửa hàng, vị trí công việc
- ✅ Báo cáo và thống kê trực quan
- ✅ Authentication & Authorization
- ✅ Dark mode support

## 🛠 Tech Stack

### Backend
- Node.js + Express
- MongoDB với Mongoose
- JWT Authentication
- bcryptjs cho password hashing

### Frontend
- React 18 với Vite
- React Router v6
- Tailwind CSS
- Axios
- Recharts (cho biểu đồ)

## 📦 Cấu Trúc Thư Mục

```
competency-framework/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── competencyController.js
│   │   ├── employeeController.js
│   │   ├── assessmentController.js
│   │   ├── storeController.js
│   │   └── positionController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Competency.js
│   │   ├── Employee.js
│   │   ├── Assessment.js
│   │   ├── Store.js
│   │   └── Position.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── competencies.js
│   │   ├── employees.js
│   │   ├── assessments.js
│   │   ├── stores.js
│   │   └── positions.js
│   ├── seed/
│   │   └── seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── Sidebar.jsx
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   └── ... (other pages to be created)
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── competencyService.js
    │   │   └── index.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### Bước 1: Cài đặt MongoDB

**Windows/Mac:**
- Download và cài đặt MongoDB Community Edition từ: https://www.mongodb.com/try/download/community
- Khởi động MongoDB service

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Bước 2: Cài đặt Backend

```bash
cd competency-framework/backend

# Cài đặt dependencies
npm install

# Copy dữ liệu competencies từ project gốc
# Copy file /mnt/project/competencies-barista.json vào thư mục backend/

# Seed database (import dữ liệu mẫu)
npm run seed

# Chạy backend server
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

### Bước 3: Cài đặt Frontend

```bash
cd competency-framework/frontend

# Cài đặt dependencies
npm install

# Chạy frontend development server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 🔑 Tài Khoản Demo

Sau khi chạy `npm run seed`, bạn có thể đăng nhập với:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Manager:**
- Username: `manager1`
- Password: `manager123`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/updateprofile` - Cập nhật profile
- `PUT /api/auth/changepassword` - Đổi mật khẩu

### Competencies
- `GET /api/competencies` - Lấy danh sách năng lực
- `GET /api/competencies/:id` - Lấy chi tiết một năng lực
- `POST /api/competencies` - Tạo năng lực mới (Admin only)
- `PUT /api/competencies/:id` - Cập nhật năng lực (Admin only)
- `DELETE /api/competencies/:id` - Xóa năng lực (Admin only)
- `GET /api/competencies/categories` - Lấy danh mục năng lực

### Employees
- `GET /api/employees` - Lấy danh sách nhân viên
- `GET /api/employees/:id` - Lấy chi tiết nhân viên
- `POST /api/employees` - Tạo nhân viên mới
- `PUT /api/employees/:id` - Cập nhật nhân viên
- `DELETE /api/employees/:id` - Xóa nhân viên (Admin only)
- `GET /api/employees/stats/overview` - Lấy thống kê nhân viên

### Assessments
- `GET /api/assessments` - Lấy danh sách đánh giá
- `GET /api/assessments/:id` - Lấy chi tiết đánh giá
- `POST /api/assessments` - Tạo đánh giá mới
- `PUT /api/assessments/:id` - Cập nhật đánh giá
- `DELETE /api/assessments/:id` - Xóa đánh giá (Admin only)
- `GET /api/assessments/reports/overview` - Lấy báo cáo đánh giá

### Stores
- `GET /api/stores` - Lấy danh sách cửa hàng
- `GET /api/stores/:id` - Lấy chi tiết cửa hàng
- `POST /api/stores` - Tạo cửa hàng mới (Admin only)
- `PUT /api/stores/:id` - Cập nhật cửa hàng (Admin only)
- `DELETE /api/stores/:id` - Xóa cửa hàng (Admin only)
- `GET /api/stores/:id/stats` - Lấy thống kê cửa hàng

### Positions
- `GET /api/positions` - Lấy danh sách vị trí
- `GET /api/positions/:id` - Lấy chi tiết vị trí
- `POST /api/positions` - Tạo vị trí mới (Admin only)
- `PUT /api/positions/:id` - Cập nhật vị trí (Admin only)
- `DELETE /api/positions/:id` - Xóa vị trí (Admin only)

## 🎨 Các Trang Cần Tạo Thêm

Hiện tại đã có:
- ✅ Login
- ✅ Dashboard
- ✅ Layout & Sidebar

Các trang còn cần tạo (template tương tự Dashboard):

### 1. Employees Page (`frontend/src/pages/Employees.jsx`)
- Hiển thị danh sách nhân viên dạng bảng
- Tìm kiếm, lọc theo cửa hàng, vị trí
- Button thêm nhân viên mới
- Button xem chi tiết, sửa, xóa

### 2. Employee Detail Page (`frontend/src/pages/EmployeeDetail.jsx`)
- Thông tin chi tiết nhân viên
- Lịch sử đánh giá
- Button tạo đánh giá mới cho nhân viên này

### 3. Assessments Page (`frontend/src/pages/Assessments.jsx`)
- Danh sách các đánh giá đã thực hiện
- Lọc theo nhân viên, người đánh giá, thời gian
- Xem chi tiết đánh giá

### 4. Create Assessment Page (`frontend/src/pages/CreateAssessment.jsx`)
- Form chọn nhân viên
- Danh sách competencies với dropdown chọn level (1-4)
- Tự động tính toán overall score và classification
- Lưu đánh giá

### 5. Competencies Page (`frontend/src/pages/Competencies.jsx`)
- Danh sách năng lực
- Lọc theo category
- CRUD operations (Admin only)

### 6. Stores Page (`frontend/src/pages/Stores.jsx`)
- Danh sách cửa hàng
- CRUD operations (Admin only)
- Xem thống kê từng cửa hàng

### 7. Reports Page (`frontend/src/pages/Reports.jsx`)
- Biểu đồ, thống kê
- Export dữ liệu

### Template Code cho Pages

```jsx
// Example: Employees.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services';
import Layout from '../components/Layout';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      if (response.success) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
        <Link
          to="/employees/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg"
        >
          <span className="material-symbols-outlined">add</span>
          Thêm nhân viên
        </Link>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="text-left p-4">Mã NV</th>
                <th className="text-left p-4">Họ tên</th>
                <th className="text-left p-4">Vị trí</th>
                <th className="text-left p-4">Cửa hàng</th>
                <th className="text-left p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} className="border-b border-border-light dark:border-border-dark">
                  <td className="p-4">{emp.employeeId}</td>
                  <td className="p-4">{emp.name}</td>
                  <td className="p-4">{emp.position}</td>
                  <td className="p-4">{emp.store?.name}</td>
                  <td className="p-4">
                    <Link
                      to={`/employees/${emp._id}`}
                      className="text-primary hover:underline"
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Employees;
```

## 🔧 Environment Variables

Backend `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/competency_framework
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

Frontend `.env` (optional):
```
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

### Users
- username, email, password, fullName, role, store, isActive

### Competencies
- id, name, nameVi, definition, category, level1-4, evidence, trainingMethod

### Employees
- employeeId, name, email, phone, position, store, hireDate, department, status, currentLevel

### Assessments
- employee, evaluator, assessmentDate, competencyRatings[], overallScore, classification, status

### Stores
- code, name, region, address, phone, manager, employeeCount, status

### Positions
- code, name, description, level, requiredCompetencies[]

## 🎯 Các Tính Năng Chính

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Admin, Manager, HR, Viewer)
   - Protected routes

2. **Competency Management**
   - 36 competencies cho Barista
   - 4 levels per competency
   - Categories: Technical/Operational, Behavioral, Hygiene, Leadership

3. **Assessment System**
   - Create assessments for employees
   - Rate multiple competencies
   - Auto-calculate overall score & classification
   - History tracking

4. **Reporting & Analytics**
   - Dashboard với charts
   - Level distribution
   - Store statistics
   - Competency statistics

5. **Employee Management**
   - CRUD operations
   - Link to stores & positions
   - Assessment history

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Đảm bảo MongoDB đang chạy
- Kiểm tra MONGODB_URI trong .env

**Port Already in Use:**
- Backend: Thay đổi PORT trong .env
- Frontend: Thay đổi port trong vite.config.js

**CORS Error:**
- Đảm bảo frontend đang proxy requests đến backend
- Kiểm tra vite.config.js proxy settings

## 📚 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

MIT

## 👥 Contributors

- Your Name

---

**Note:** Đây là hệ thống được xây dựng dựa trên phân tích BA và các file HTML/JS gốc. Tất cả chức năng đã được chuyển đổi sang kiến trúc React + Node.js + MongoDB với đầy đủ tính năng authentication, authorization và database persistence.
