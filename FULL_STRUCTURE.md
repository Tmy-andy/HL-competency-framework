# 📁 CẤU TRÚC TOÀN BỘ PROJECT

## 📊 TỔNG QUAN

```
competency-framework/
├── 📄 Tài liệu (5 files)
├── 📁 backend/ (27 files)
└── 📁 frontend/ (18 files)
```

---

## 📄 1. TÀI LIỆU (Root Level)

```
competency-framework/
├── START_HERE.md          ← BẮT ĐẦU TẠI ĐÂY - Hướng dẫn đọc tài liệu
├── SUMMARY.md             ← Tổng quan toàn bộ project
├── QUICKSTART.md          ← Chạy project trong 5 phút
├── README.md              ← Documentation đầy đủ (API, Schema, etc.)
└── PAGES_GUIDE.md         ← Template code để tạo các pages còn lại
```

**Đọc theo thứ tự:** START_HERE → SUMMARY → QUICKSTART → README → PAGES_GUIDE

---

## 🔧 2. BACKEND (Node.js + Express + MongoDB)

### 📁 Cấu trúc Backend

```
backend/
├── .env                          ← Environment variables
├── .env.example                  ← Template cho .env
├── .gitignore                    ← Git ignore rules
├── package.json                  ← Dependencies & scripts
├── server.js                     ← 🚀 MAIN SERVER FILE
├── competencies-barista.json     ← Dữ liệu 36 competencies
│
├── config/
│   └── database.js               ← MongoDB connection
│
├── controllers/ (6 files)
│   ├── authController.js         ← Login, register, profile
│   ├── assessmentController.js   ← Đánh giá năng lực
│   ├── competencyController.js   ← Quản lý 36 competencies
│   ├── employeeController.js     ← Quản lý nhân viên
│   ├── storeController.js        ← Quản lý cửa hàng
│   └── positionController.js     ← Quản lý vị trí
│
├── middleware/
│   └── auth.js                   ← JWT authentication middleware
│
├── models/ (6 files)
│   ├── User.js                   ← User schema (admin, manager, etc.)
│   ├── Competency.js             ← Competency schema
│   ├── Employee.js               ← Employee schema
│   ├── Assessment.js             ← Assessment schema (với auto-calc)
│   ├── Store.js                  ← Store schema
│   └── Position.js               ← Position schema
│
├── routes/ (6 files)
│   ├── auth.js                   ← POST /api/auth/login, register
│   ├── assessments.js            ← /api/assessments/*
│   ├── competencies.js           ← /api/competencies/*
│   ├── employees.js              ← /api/employees/*
│   ├── stores.js                 ← /api/stores/*
│   └── positions.js              ← /api/positions/*
│
└── seed/
    └── seedData.js               ← Import dữ liệu mẫu vào MongoDB
```

### 🎯 Backend - Chạy Như Thế Nào?

```bash
cd backend

# 1. Cài đặt
npm install

# 2. Tạo file .env (copy từ .env.example)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/competency_framework
# JWT_SECRET=your-secret-key

# 3. Import dữ liệu mẫu
npm run seed

# 4. Chạy server
npm run dev    # Development mode với nodemon
# hoặc
npm start      # Production mode
```

**Server sẽ chạy tại:** http://localhost:5000

### 📡 API Endpoints Chính

```
Auth:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me
  PUT    /api/auth/updateprofile
  PUT    /api/auth/changepassword

Competencies:
  GET    /api/competencies           (Lấy tất cả 36 competencies)
  GET    /api/competencies/:id       (Chi tiết 1 competency)
  POST   /api/competencies           (Tạo mới - Admin only)
  PUT    /api/competencies/:id       (Cập nhật - Admin only)
  DELETE /api/competencies/:id       (Xóa - Admin only)

Employees:
  GET    /api/employees              (Danh sách nhân viên)
  GET    /api/employees/:id          (Chi tiết nhân viên)
  POST   /api/employees              (Tạo nhân viên)
  PUT    /api/employees/:id          (Cập nhật)
  DELETE /api/employees/:id          (Xóa - Admin only)
  GET    /api/employees/stats/overview  (Thống kê dashboard)

Assessments:
  GET    /api/assessments            (Danh sách đánh giá)
  GET    /api/assessments/:id        (Chi tiết đánh giá)
  POST   /api/assessments            (Tạo đánh giá mới)
  PUT    /api/assessments/:id        (Cập nhật)
  DELETE /api/assessments/:id        (Xóa - Admin only)
  GET    /api/assessments/reports/overview  (Báo cáo)

Stores:
  GET    /api/stores                 (Danh sách cửa hàng)
  GET    /api/stores/:id             (Chi tiết)
  POST   /api/stores                 (Tạo - Admin only)
  PUT    /api/stores/:id             (Cập nhật - Admin only)
  DELETE /api/stores/:id             (Xóa - Admin only)

Positions:
  GET    /api/positions              (Danh sách vị trí)
  GET    /api/positions/:id          (Chi tiết)
  POST   /api/positions              (Tạo - Admin only)
  PUT    /api/positions/:id          (Cập nhật - Admin only)
  DELETE /api/positions/:id          (Xóa - Admin only)
```

---

## ⚛️ 3. FRONTEND (React + Vite + Tailwind)

### 📁 Cấu trúc Frontend

```
frontend/
├── index.html                    ← HTML entry point
├── package.json                  ← Dependencies & scripts
├── vite.config.js                ← Vite configuration
├── tailwind.config.js            ← Tailwind CSS config
├── postcss.config.js             ← PostCSS config
├── .gitignore                    ← Git ignore rules
│
└── src/
    ├── main.jsx                  ← 🚀 React entry point
    ├── App.jsx                   ← Main app với routing
    ├── index.css                 ← Global styles + Tailwind imports
    │
    ├── components/               ← Reusable components
    │   ├── Layout.jsx            ← Layout wrapper (sidebar + content)
    │   └── Sidebar.jsx           ← Navigation sidebar
    │
    ├── contexts/                 ← React Context
    │   └── AuthContext.jsx       ← Authentication context & hooks
    │
    ├── pages/                    ← Page components
    │   ├── Login.jsx             ✅ HOÀN THÀNH
    │   ├── Dashboard.jsx         ✅ HOÀN THÀNH
    │   ├── Employees.jsx         ❌ CẦN TẠO (có template)
    │   ├── EmployeeDetail.jsx    ❌ CẦN TẠO (có template)
    │   ├── Assessments.jsx       ❌ CẦN TẠO (có template)
    │   ├── CreateAssessment.jsx  ❌ CẦN TẠO (có template)
    │   ├── Competencies.jsx      ❌ CẦN TẠO (có template)
    │   ├── Stores.jsx            ❌ CẦN TẠO (có template)
    │   └── Reports.jsx           ❌ CẦN TẠO (có template)
    │
    └── services/                 ← API services
        ├── api.js                ← Axios instance + interceptors
        ├── authService.js        ← Auth API calls
        ├── competencyService.js  ← Competency API calls
        └── index.js              ← All other services (employee, assessment, etc.)
```

### 🎯 Frontend - Chạy Như Thế Nào?

```bash
cd frontend

# 1. Cài đặt
npm install

# 2. Chạy development server
npm run dev

# 3. Build cho production
npm run build

# 4. Preview production build
npm run preview
```

**App sẽ chạy tại:** http://localhost:3000

---

## 🎨 4. HƯỚNG DẪN THÊM PAGES MỚI

### ✅ Pages Đã Có (2/9)

1. **Login.jsx** - Trang đăng nhập
2. **Dashboard.jsx** - Dashboard với stats & charts

### ❌ Pages Cần Tạo (7/9)

3. **Employees.jsx** - Danh sách nhân viên
4. **EmployeeDetail.jsx** - Chi tiết nhân viên
5. **Assessments.jsx** - Danh sách đánh giá
6. **CreateAssessment.jsx** - Form tạo đánh giá
7. **Competencies.jsx** - Quản lý 36 competencies
8. **Stores.jsx** - Quản lý cửa hàng
9. **Reports.jsx** - Báo cáo & analytics

---

## 📝 CÁCH THÊM MỘT PAGE MỚI

### Bước 1: Tạo File Page Component

**Vị trí:** `frontend/src/pages/[TenPage].jsx`

**Template cơ bản:**

```jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { employeeService } from '../services';  // Import service cần dùng

const TenPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await employeeService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
          Tiêu đề trang
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Mô tả trang
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border">
          {/* Nội dung của bạn */}
        </div>
      )}
    </Layout>
  );
};

export default TenPage;
```

### Bước 2: Thêm Route vào App.jsx

**File:** `frontend/src/App.jsx`

```jsx
// Import page mới
import TenPage from './pages/TenPage';

// Trong <Routes>, thêm:
<Route
  path="/tenpage"
  element={
    <ProtectedRoute>
      <TenPage />
    </ProtectedRoute>
  }
/>
```

### Bước 3: Thêm Link vào Sidebar (Optional)

**File:** `frontend/src/components/Sidebar.jsx`

```jsx
// Trong navItems array, thêm:
{
  path: '/tenpage',
  icon: 'dashboard',  // Material icon name
  label: 'Tên hiển thị',
  roles: ['admin', 'manager']  // Roles có quyền xem
}
```

---

## 🔥 TEMPLATE CODE CHO TỪNG PAGE

### 1️⃣ Employees.jsx - Danh Sách Nhân Viên

```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService, storeService } from '../services';
import Layout from '../components/Layout';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    store: '',
    position: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [empRes, storeRes] = await Promise.all([
        employeeService.getAll(),
        storeService.getAll()
      ]);
      
      if (empRes.success) setEmployees(empRes.data);
      if (storeRes.success) setStores(storeRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchStore = !filters.store || emp.store?._id === filters.store;
    const matchPosition = !filters.position || emp.position === filters.position;
    return matchSearch && matchStore && matchPosition;
  });

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý nhân viên</h1>
          <p className="text-gray-600">Danh sách nhân viên trong hệ thống</p>
        </div>
        <Link
          to="/employees/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg"
        >
          <span className="material-symbols-outlined">add</span>
          Thêm nhân viên
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 mb-6 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800"
          />
          
          <select
            value={filters.store}
            onChange={(e) => setFilters({...filters, store: e.target.value})}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800"
          >
            <option value="">Tất cả cửa hàng</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>{store.name}</option>
            ))}
          </select>

          <select
            value={filters.position}
            onChange={(e) => setFilters({...filters, position: e.target.value})}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800"
          >
            <option value="">Tất cả vị trí</option>
            <option value="barista">Barista</option>
            <option value="server">Server</option>
            <option value="sales">Sales</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Đang tải...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-4">Mã NV</th>
                <th className="text-left p-4">Họ tên</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Vị trí</th>
                <th className="text-left p-4">Cửa hàng</th>
                <th className="text-left p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp._id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-4">{emp.employeeId}</td>
                  <td className="p-4 font-medium">{emp.name}</td>
                  <td className="p-4">{emp.email}</td>
                  <td className="p-4">{emp.position}</td>
                  <td className="p-4">{emp.store?.name}</td>
                  <td className="p-4">
                    <Link to={`/employees/${emp._id}`} className="text-primary hover:underline">
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Employees;
```

**Sau khi tạo, thêm route:**

```jsx
// Trong App.jsx
import Employees from './pages/Employees';

<Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
```

---

### 2️⃣ CreateAssessment.jsx - Form Tạo Đánh Giá

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService, competencyService, assessmentService } from '../services';
import Layout from '../components/Layout';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    employee: '',
    competencyRatings: [],
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [empRes, compRes] = await Promise.all([
        employeeService.getAll(),
        competencyService.getAll()
      ]);
      
      if (empRes.success) setEmployees(empRes.data);
      if (compRes.success) {
        setCompetencies(compRes.data);
        
        // Initialize ratings
        const ratings = compRes.data.map(comp => ({
          competency: comp._id,
          competencyId: comp.id,
          competencyName: comp.nameVi,
          ratedLevel: 'Low',
          levelNumber: 2,
          comment: ''
        }));
        setFormData(prev => ({ ...prev, competencyRatings: ratings }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (index, field, value) => {
    const newRatings = [...formData.competencyRatings];
    newRatings[index][field] = value;
    
    if (field === 'ratedLevel') {
      const levelMap = { 'Critical': 1, 'Low': 2, 'Medium': 3, 'High': 4 };
      newRatings[index].levelNumber = levelMap[value];
    }
    
    setFormData({ ...formData, competencyRatings: newRatings });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employee) {
      alert('Vui lòng chọn nhân viên');
      return;
    }

    try {
      const response = await assessmentService.create(formData);
      if (response.success) {
        alert('Tạo đánh giá thành công!');
        navigate(`/employees/${formData.employee}`);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  if (loading) return <Layout><div>Đang tải...</div></Layout>;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tạo đánh giá năng lực mới</h1>
        <p className="text-gray-600">Đánh giá năng lực nhân viên</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Selection */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border">
          <label className="block font-medium mb-2">Chọn nhân viên *</label>
          <select
            value={formData.employee}
            onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.employeeId} - {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Competency Ratings */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Đánh giá từng năng lực</h2>
          
          <div className="space-y-4">
            {formData.competencyRatings.map((rating, index) => {
              const comp = competencies.find(c => c._id === rating.competency);
              
              return (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-medium mb-2">{comp?.nameVi}</h3>
                  <p className="text-sm text-gray-600 mb-3">{comp?.definition}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Mức độ</label>
                      <select
                        value={rating.ratedLevel}
                        onChange={(e) => handleRatingChange(index, 'ratedLevel', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                      >
                        <option value="Critical">Critical (Level 1)</option>
                        <option value="Low">Low (Level 2)</option>
                        <option value="Medium">Medium (Level 3)</option>
                        <option value="High">High (Level 4)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Nhận xét</label>
                      <input
                        type="text"
                        value={rating.comment}
                        onChange={(e) => handleRatingChange(index, 'comment', e.target.value)}
                        placeholder="Nhận xét (tùy chọn)"
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
          >
            Lưu đánh giá
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border rounded-lg"
          >
            Hủy
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CreateAssessment;
```

**Thêm route:**

```jsx
import CreateAssessment from './pages/CreateAssessment';

<Route path="/assessments/new" element={<ProtectedRoute><CreateAssessment /></ProtectedRoute>} />
```

---

### 3️⃣ Competencies.jsx - Quản Lý Năng Lực

```jsx
import React, { useState, useEffect } from 'react';
import competencyService from '../services/competencyService';
import Layout from '../components/Layout';

const Competencies = () => {
  const [competencies, setCompetencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [compRes, catRes] = await Promise.all([
        competencyService.getAll(),
        competencyService.getCategories()
      ]);
      
      if (compRes.success) setCompetencies(compRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompetencies = selectedCategory
    ? competencies.filter(c => c.category === selectedCategory)
    : competencies;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý năng lực</h1>
        <p className="text-gray-600">36 năng lực cho Barista</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          filteredCompetencies.map(comp => (
            <div key={comp._id} className="bg-card-light dark:bg-card-dark rounded-xl p-6 border">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{comp.nameVi}</h3>
                  <p className="text-sm text-gray-600 mb-2">{comp.definition}</p>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {comp.category}
                  </span>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === comp._id ? null : comp._id)}
                  className="text-primary"
                >
                  {expandedId === comp._id ? 'Thu gọn' : 'Chi tiết'}
                </button>
              </div>

              {expandedId === comp._id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Level 1 - Critical:</h4>
                    <p className="text-sm text-gray-600">{comp.level1}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Level 2 - Low:</h4>
                    <p className="text-sm text-gray-600">{comp.level2}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Level 3 - Medium:</h4>
                    <p className="text-sm text-gray-600">{comp.level3}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Level 4 - High:</h4>
                    <p className="text-sm text-gray-600">{comp.level4}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Competencies;
```

**Thêm route:**

```jsx
import Competencies from './pages/Competencies';

<Route path="/competencies" element={<ProtectedRoute><Competencies /></ProtectedRoute>} />
```

---

## 🚀 CHECKLIST ĐỂ THÊM 1 PAGE

- [ ] 1. Tạo file `.jsx` trong `frontend/src/pages/`
- [ ] 2. Import `Layout` component
- [ ] 3. Import services cần dùng từ `../services`
- [ ] 4. Setup `useState` và `useEffect`
- [ ] 5. Viết function `loadData()` để fetch API
- [ ] 6. Render UI với Tailwind classes
- [ ] 7. Import page vào `App.jsx`
- [ ] 8. Thêm `<Route>` trong `App.jsx`
- [ ] 9. (Optional) Thêm link trong `Sidebar.jsx`
- [ ] 10. Test trong browser

---

## 📦 DANH SÁCH FILES ĐẦY ĐỦ

### Backend (27 files)

```
backend/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── competencies-barista.json
├── config/database.js
├── controllers/
│   ├── authController.js
│   ├── assessmentController.js
│   ├── competencyController.js
│   ├── employeeController.js
│   ├── positionController.js
│   └── storeController.js
├── middleware/auth.js
├── models/
│   ├── User.js
│   ├── Competency.js
│   ├── Employee.js
│   ├── Assessment.js
│   ├── Store.js
│   └── Position.js
├── routes/
│   ├── auth.js
│   ├── assessments.js
│   ├── competencies.js
│   ├── employees.js
│   ├── positions.js
│   └── stores.js
└── seed/seedData.js
```

### Frontend (18 files)

```
frontend/
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Layout.jsx
    │   └── Sidebar.jsx
    ├── contexts/AuthContext.jsx
    ├── pages/
    │   ├── Login.jsx          ✅
    │   └── Dashboard.jsx      ✅
    └── services/
        ├── api.js
        ├── authService.js
        ├── competencyService.js
        └── index.js
```

### Docs (5 files)

```
├── START_HERE.md
├── SUMMARY.md
├── QUICKSTART.md
├── README.md
└── PAGES_GUIDE.md
```

---

## 💡 LƯU Ý QUAN TRỌNG

1. **Backend phải chạy trước Frontend**
2. **MongoDB phải được cài đặt và chạy**
3. **Chạy `npm run seed` để có dữ liệu mẫu**
4. **Tất cả pages đều dùng `Layout` component**
5. **Tất cả API calls đều qua services/**
6. **Protected routes cần wrap trong `<ProtectedRoute>`**
7. **Tailwind classes: bg-card-light, dark:bg-card-dark, etc.**

---
