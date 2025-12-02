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
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      try {
        await employeeService.delete(id);
        alert('Xóa nhân viên thành công');
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
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
          />
          
          <select
            value={filters.store}
            onChange={(e) => setFilters({...filters, store: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả cửa hàng</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>{store.code} {store.name}</option>
            ))}
          </select>

          <select
            value={filters.position}
            onChange={(e) => setFilters({...filters, position: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả vị trí</option>
            <option value="AP">AP (Assistant Manager)</option>
            <option value="B">Barista</option>
            <option value="MB">Master Barista</option>
            <option value="SL">Server Leader</option>
            <option value="Crew Leader">Crew Leader</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Mã NV</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Họ tên</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Email</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Vị trí</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Cửa hàng</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Level</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      Không tìm thấy nhân viên nào
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp._id} className="border-t border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="p-3 text-gray-700 dark:text-gray-300">{emp.employeeId}</td>
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{emp.name}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{emp.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                          {emp.position}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        {emp.store ? `${emp.store.code} ${emp.store.name}` : '-'}
                      </td>
                      <td className="p-3">
                        {emp.currentLevel ? (
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            emp.currentLevel === 4 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            emp.currentLevel === 3 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            emp.currentLevel === 2 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            Level {emp.currentLevel}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Chưa đánh giá</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/employees/${emp._id}`}
                            className="text-primary hover:text-primary/70 transition-colors"
                            title="Xem chi tiết"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </Link>
                          {(isAdmin || isManager) && (
                            <>
                              <Link
                                to={`/employees/${emp._id}/edit`}
                                className="text-blue-600 hover:text-blue-500 transition-colors"
                                title="Chỉnh sửa"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </Link>
                              <Link
                                to={`/assessments?employee=${emp._id}`}
                                className="text-green-600 hover:text-green-500 transition-colors"
                                title="Đánh giá"
                              >
                                <span className="material-symbols-outlined text-lg">assignment</span>
                              </Link>
                            </>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(emp._id)}
                              className="text-red-600 hover:text-red-500 transition-colors"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Hiển thị {filteredEmployees.length} / {employees.length} nhân viên
      </div>
    </Layout>
  );
};

export default Employees;
