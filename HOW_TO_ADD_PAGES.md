# 🎯 HƯỚNG DẪN THÊM CÁC PAGES VÀO APP

## ✅ CÁC PAGES ĐÃ TẠO XONG

Tôi đã tạo sẵn 3 pages quan trọng:

1. **Employees.jsx** - Quản lý nhân viên (có filters, table, actions)
2. **CreateAssessment.jsx** - Form tạo đánh giá đầy đủ 36 competencies
3. **Competencies.jsx** - Hiển thị và quản lý 36 năng lực

## 📝 BƯỚC 1: CẬP NHẬT App.jsx

Mở file `frontend/src/App.jsx` và thay thế toàn bộ nội dung bằng code sau:

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import CreateAssessment from './pages/CreateAssessment';
import Competencies from './pages/Competencies';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assessments/new"
            element={
              <ProtectedRoute>
                <CreateAssessment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/competencies"
            element={
              <ProtectedRoute>
                <Competencies />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

## 📝 BƯỚC 2: CẬP NHẬT Sidebar.jsx

Mở file `frontend/src/components/Sidebar.jsx` và tìm dòng:

```jsx
const navItems = [
```

Thay thế array `navItems` bằng:

```jsx
const navItems = [
  { 
    path: '/', 
    icon: 'dashboard', 
    label: 'Dashboard', 
    roles: ['admin', 'manager', 'hr', 'viewer'] 
  },
  { 
    path: '/employees', 
    icon: 'group', 
    label: 'Quản lý nhân viên', 
    roles: ['admin', 'manager', 'hr'] 
  },
  { 
    path: '/assessments/new', 
    icon: 'assignment', 
    label: 'Tạo đánh giá', 
    roles: ['admin', 'manager'] 
  },
  { 
    path: '/competencies', 
    icon: 'lightbulb', 
    label: 'Quản lý năng lực', 
    roles: ['admin'] 
  },
  { 
    path: '/stores', 
    icon: 'store', 
    label: 'Quản lý cửa hàng', 
    roles: ['admin'] 
  },
  { 
    path: '/reports', 
    icon: 'analytics', 
    label: 'Báo cáo', 
    roles: ['admin', 'manager', 'hr'] 
  },
];
```

## 🔥 BƯỚC 3: KIỂM TRA

1. **Khởi động lại frontend** (nếu đang chạy):
   ```bash
   # Ctrl+C để dừng
   npm run dev
   ```

2. **Kiểm tra các trang:**
   - ✅ Login: http://localhost:3000/login
   - ✅ Dashboard: http://localhost:3000/
   - ✅ Employees: http://localhost:3000/employees
   - ✅ Create Assessment: http://localhost:3000/assessments/new
   - ✅ Competencies: http://localhost:3000/competencies

3. **Test navigation:**
   - Click vào menu sidebar
   - Kiểm tra các trang hiển thị đúng
   - Test filters, buttons, forms

## 📋 CÁC TRANG CÒN LẠI CẦN TẠO

Nếu muốn tạo thêm các trang sau, follow cùng pattern:

### 4️⃣ Assessments.jsx - Danh Sách Đánh Giá

```jsx
// frontend/src/pages/Assessments.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assessmentService } from '../services';
import Layout from '../components/Layout';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const response = await assessmentService.getAll();
      if (response.success) {
        setAssessments(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Danh sách đánh giá</h1>
      
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="space-y-4">
          {assessments.map(assessment => (
            <div key={assessment._id} className="bg-card-light dark:bg-card-dark p-6 rounded-xl border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{assessment.employee?.name}</h3>
                  <p className="text-sm text-gray-600">
                    Đánh giá ngày: {new Date(assessment.assessmentDate).toLocaleDateString('vi-VN')}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded text-sm font-semibold ${
                    assessment.classification === 'HIGH' ? 'bg-green-100 text-green-800' :
                    assessment.classification === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                    assessment.classification === 'LOW' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {assessment.classification}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {assessment.overallScore?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Assessments;
```

**Thêm route vào App.jsx:**

```jsx
import Assessments from './pages/Assessments';

<Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
```

### 5️⃣ EmployeeDetail.jsx - Chi Tiết Nhân Viên

```jsx
// frontend/src/pages/EmployeeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { employeeService } from '../services';
import Layout from '../components/Layout';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      const response = await employeeService.getById(id);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div>Đang tải...</div></Layout>;
  if (!data) return <Layout><div>Không tìm thấy nhân viên</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{data.employee.name}</h1>
          <p className="text-gray-600">Mã NV: {data.employee.employeeId}</p>
        </div>
        <Link
          to={`/assessments/new?employee=${id}`}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Tạo đánh giá mới
        </Link>
      </div>

      {/* Employee Info Card */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{data.employee.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Vị trí</p>
            <p className="font-medium">{data.employee.position}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cửa hàng</p>
            <p className="font-medium">{data.employee.store?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ngày vào làm</p>
            <p className="font-medium">
              {new Date(data.employee.hireDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {/* Assessment History */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">Lịch sử đánh giá</h2>
        {data.assessments.length === 0 ? (
          <p className="text-gray-600">Chưa có đánh giá nào</p>
        ) : (
          <div className="space-y-4">
            {data.assessments.map(assessment => (
              <div key={assessment._id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">
                      Ngày: {new Date(assessment.assessmentDate).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Người đánh giá: {assessment.evaluator?.fullName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{assessment.overallScore?.toFixed(2)}</p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      assessment.classification === 'HIGH' ? 'bg-green-100 text-green-800' :
                      assessment.classification === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                      assessment.classification === 'LOW' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {assessment.classification}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeDetail;
```

**Thêm route:**

```jsx
import EmployeeDetail from './pages/EmployeeDetail';

<Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
```

## ✅ CHECKLIST HOÀN THÀNH

- [x] Employees.jsx - HOÀN THÀNH
- [x] CreateAssessment.jsx - HOÀN THÀNH  
- [x] Competencies.jsx - HOÀN THÀNH
- [ ] Assessments.jsx - Có template code
- [ ] EmployeeDetail.jsx - Có template code
- [ ] Stores.jsx - Cần tạo
- [ ] Reports.jsx - Cần tạo

## 🎯 KẾT QUẢ SAU KHI HOÀN THÀNH

Sau khi thêm 3 pages đã tạo vào App.jsx, bạn sẽ có:

1. ✅ Login page - Đăng nhập
2. ✅ Dashboard - Tổng quan, charts
3. ✅ Employees - Danh sách nhân viên với filters
4. ✅ Create Assessment - Form đánh giá 36 competencies
5. ✅ Competencies - Xem chi tiết 36 năng lực

## 🚀 CHẠY THỬ

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Mở browser: http://localhost:3000
# Login: admin / admin123
```

---

**Lưu ý:** Tất cả pages đều đã có:
- Dark mode support
- Responsive design
- Loading states
- Error handling
- Beautiful UI với Tailwind
