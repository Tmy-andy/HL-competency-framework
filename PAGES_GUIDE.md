# 📖 Hướng Dẫn Tạo Các Pages Còn Lại

## 1. Employees Page

Tạo file: `frontend/src/pages/Employees.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService, storeService } from '../services';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    store: '',
    position: ''
  });
  const { isAdmin, isManager } = useAuth();

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
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      try {
        await employeeService.delete(id);
        loadData();
      } catch (error) {
        alert('Lỗi khi xóa nhân viên');
      }
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                       emp.employeeId.toLowerCase().includes(filters.search.toLowerCase());
    const matchStore = !filters.store || emp.store?._id === filters.store;
    const matchPosition = !filters.position || emp.position === filters.position;
    
    return matchSearch && matchStore && matchPosition;
  });

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Quản lý nhân viên
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Danh sách và thông tin nhân viên trong hệ thống
          </p>
        </div>
        {(isAdmin || isManager) && (
          <Link
            to="/employees/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <span className="material-symbols-outlined">add</span>
            Thêm nhân viên
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 mb-6 border border-border-light dark:border-border-dark">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm tên, mã nhân viên..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          />
          
          <select
            value={filters.store}
            onChange={(e) => setFilters({...filters, store: e.target.value})}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="">Tất cả cửa hàng</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>{store.name}</option>
            ))}
          </select>

          <select
            value={filters.position}
            onChange={(e) => setFilters({...filters, position: e.target.value})}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="">Tất cả vị trí</option>
            <option value="barista">Barista</option>
            <option value="server">Server</option>
            <option value="sales">Sales</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4 font-semibold">Mã NV</th>
                  <th className="text-left p-4 font-semibold">Họ tên</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Vị trí</th>
                  <th className="text-left p-4 font-semibold">Cửa hàng</th>
                  <th className="text-left p-4 font-semibold">Level</th>
                  <th className="text-left p-4 font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp._id} className="border-t border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4">{emp.employeeId}</td>
                    <td className="p-4 font-medium">{emp.name}</td>
                    <td className="p-4">{emp.email}</td>
                    <td className="p-4">{emp.position}</td>
                    <td className="p-4">{emp.store?.name}</td>
                    <td className="p-4">
                      {emp.currentLevel ? (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          emp.currentLevel === 4 ? 'bg-green-100 text-green-800' :
                          emp.currentLevel === 3 ? 'bg-blue-100 text-blue-800' :
                          emp.currentLevel === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Level {emp.currentLevel}
                        </span>
                      ) : (
                        <span className="text-gray-400">Chưa đánh giá</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/employees/${emp._id}`}
                          className="text-primary hover:underline text-sm"
                        >
                          Chi tiết
                        </Link>
                        {(isAdmin || isManager) && (
                          <>
                            <Link
                              to={`/employees/${emp._id}/edit`}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Sửa
                            </Link>
                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(emp._id)}
                                className="text-red-600 hover:underline text-sm"
                              >
                                Xóa
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Không tìm thấy nhân viên nào
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;
```

## 2. Create Assessment Page

Tạo file: `frontend/src/pages/CreateAssessment.jsx`

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
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (index, field, value) => {
    const newRatings = [...formData.competencyRatings];
    newRatings[index][field] = value;
    
    // Update levelNumber based on ratedLevel
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
      alert('Lỗi khi tạo đánh giá: ' + error.message);
    }
  };

  if (loading) {
    return <Layout><div>Đang tải...</div></Layout>;
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tạo đánh giá năng lực mới</h1>
        <p className="text-gray-600">Đánh giá năng lực nhân viên theo các competency</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Selection */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border">
          <label className="block text-sm font-medium mb-2">Chọn nhân viên *</label>
          <select
            value={formData.employee}
            onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.employeeId} - {emp.name} ({emp.position})
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
                <div key={index} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium mb-2">{comp?.nameVi}</h3>
                  <p className="text-sm text-gray-600 mb-3">{comp?.definition}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Notes */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border">
          <label className="block text-sm font-medium mb-2">Ghi chú chung</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            placeholder="Nhận xét chung về nhân viên..."
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
          >
            Lưu đánh giá
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
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

## 3. Competencies Page (Admin only)

Tạo file: `frontend/src/pages/Competencies.jsx`

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
      console.error('Error loading data:', error);
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
        <p className="text-gray-600">Danh sách 36 năng lực cho Barista</p>
      </div>

      {/* Filter by category */}
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

      {/* Competencies List */}
      <div className="space-y-4">
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          filteredCompetencies.map(comp => (
            <div
              key={comp._id}
              className="bg-card-light dark:bg-card-dark rounded-xl p-6 border"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{comp.nameVi}</h3>
                  <p className="text-sm text-gray-600 mb-2">{comp.definition}</p>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {comp.category}
                  </span>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === comp._id ? null : comp._id)}
                  className="text-primary hover:underline text-sm"
                >
                  {expandedId === comp._id ? 'Thu gọn' : 'Xem chi tiết'}
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

## 4. Thêm Routes vào App.jsx

Cập nhật `frontend/src/App.jsx`:

```jsx
import Employees from './pages/Employees';
import CreateAssessment from './pages/CreateAssessment';
import Competencies from './pages/Competencies';
// ... import other pages

// Trong <Routes>:
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
```

## 📝 Các Pages Khác Cần Tạo

Tương tự, bạn cần tạo:

- **Assessments.jsx** - Danh sách đánh giá
- **EmployeeDetail.jsx** - Chi tiết nhân viên
- **Stores.jsx** - Quản lý cửa hàng
- **Reports.jsx** - Báo cáo
