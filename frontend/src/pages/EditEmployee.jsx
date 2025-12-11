import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { employeeService, storeService } from '../services';
import Layout from '../components/Layout';

const EditEmployee = () => {
  const { id } = useParams();
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
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [empRes, storeRes] = await Promise.all([
        employeeService.getById(id),
        storeService.getAll()
      ]);

      if (empRes.success) {
        const { employee } = empRes.data;
        setFormData({
          employeeId: employee.employeeId || '',
          name: employee.name || '',
          email: employee.email || '',
          phone: employee.phone || '',
          position: employee.position || 'B',
          store: employee.store?._id || '',
          dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
          hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
          status: employee.status || 'active'
        });
      }

      if (storeRes.success) {
        setStores(storeRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải thông tin nhân viên');
      navigate('/employees');
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
      const response = await employeeService.update(id, formData);
      
      if (response.success) {
        alert('Cập nhật nhân viên thành công!');
        navigate(`/employees/${id}`);
      } else {
        alert(response.message || 'Lỗi khi cập nhật nhân viên');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật nhân viên');
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link to="/employees" className="hover:text-primary">
            Nhân viên
          </Link>
          <span>/</span>
          <Link to={`/employees/${id}`} className="hover:text-primary">
            Chi tiết
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Chỉnh sửa</span>
        </div>
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
          Chỉnh Sửa Nhân Viên
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Cập nhật thông tin nhân viên
        </p>
      </div>

      {/* Form */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee ID & Name */}
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
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.employeeId 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
                placeholder="VD: EMP001"
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
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
                placeholder="VD: Nguyễn Văn A"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
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
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
                placeholder="email@example.com"
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="0912345678"
              />
            </div>
          </div>

          {/* Position & Store */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vị trí <span className="text-red-500">*</span>
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.position 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
              >
                <option value="">Chọn vị trí</option>
                <option value="AP">AP (Apprentice)</option>
                <option value="B">Barista</option>
                <option value="MB">Master Barista</option>
                <option value="MB Leader">MB Leader</option>
                <option value="SL">Server Leader</option>
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
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.store 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
              >
                <option value="">Chọn cửa hàng</option>
                {stores.map(store => (
                  <option key={store._id} value={store._id}>
                    {store.code} - {store.name}
                  </option>
                ))}
              </select>
              {errors.store && (
                <p className="mt-1 text-sm text-red-500">{errors.store}</p>
              )}
            </div>
          </div>

          {/* Date of Birth & Hire Date */}
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="active">Đang làm việc</option>
              <option value="inactive">Đã nghỉ việc</option>
              <option value="on-leave">Nghỉ phép</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">save</span>
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>

            <Link
              to={`/employees/${id}`}
              className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditEmployee;
