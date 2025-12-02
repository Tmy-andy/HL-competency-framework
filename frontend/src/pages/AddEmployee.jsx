import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { employeeService, storeService } from '../services';
import Layout from '../components/Layout';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    position: 'B',
    store: '',
    dateOfBirth: '',
    hireDate: '',
    status: 'active'
  });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await storeService.getAll();
      if (response.success) {
        setStores(response.data);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      alert('Lỗi khi tải danh sách cửa hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Vui lòng nhập mã nhân viên';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.position) {
      newErrors.position = 'Vui lòng chọn vị trí';
    }

    if (!formData.store) {
      newErrors.store = 'Vui lòng chọn cửa hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await employeeService.create(formData);
      
      if (response.success) {
        alert('Thêm nhân viên thành công!');
        navigate('/employees');
      } else {
        alert(response.message || 'Có lỗi xảy ra khi thêm nhân viên');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert(error.response?.data?.message || 'Lỗi khi thêm nhân viên');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/employees"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-4"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Quay lại danh sách nhân viên</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Thêm nhân viên mới
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Nhập thông tin nhân viên mới vào hệ thống
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-8 border border-border-light dark:border-border-dark">
          <div className="space-y-6">
            {/* Row 1: Mã NV và Họ tên */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mã nhân viên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="VD: NV001"
                  className={`w-full px-4 py-2 border ${
                    errors.employeeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary`}
                />
                {errors.employeeId && (
                  <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: Nguyễn Văn A"
                  className={`w-full px-4 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Row 2: Email và Số điện thoại */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="VD: nguyenvana@example.com"
                  className={`w-full px-4 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="VD: 0901234567"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Row 3: Vị trí và Cửa hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vị trí <span className="text-red-500">*</span>
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary`}
                >
                  <option value="">Chọn vị trí</option>
                  <option value="AP">AP (Assistant Manager)</option>
                  <option value="B">B (Barista)</option>
                  <option value="MB">MB (Master Barista)</option>
                  <option value="SL">SL (Server Leader)</option>
                  <option value="Crew Leader">Crew Leader</option>
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cửa hàng <span className="text-red-500">*</span>
                </label>
                <select
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.store ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary`}
                >
                  <option value="">Chọn cửa hàng</option>
                  {stores.map(store => (
                    <option key={store._id} value={store._id}>
                      {store.code} {store.name}
                    </option>
                  ))}
                </select>
                {errors.store && (
                  <p className="mt-1 text-sm text-red-500">{errors.store}</p>
                )}
              </div>
            </div>

            {/* Row 4: Ngày sinh và Ngày vào làm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày vào làm
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Row 5: Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
              >
                <option value="active">Đang làm việc</option>
                <option value="inactive">Nghỉ việc</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">add</span>
                  <span>Thêm nhân viên</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddEmployee;
