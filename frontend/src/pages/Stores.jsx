import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storeService } from '../services';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Stores = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    region: '',
    address: '',
    phone: '',
    manager: '',
    status: 'active'
  });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
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

  const handleShowAddModal = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      code: '',
      region: '',
      address: '',
      phone: '',
      manager: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleShowEditModal = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      code: store.code,
      region: store.region || '',
      address: store.address || '',
      phone: store.phone || '',
      manager: store.manager || '',
      status: store.status || 'active'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStore(null);
    setFormData({
      name: '',
      code: '',
      region: '',
      address: '',
      phone: '',
      manager: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStore) {
        // Update existing store
        const response = await storeService.update(editingStore._id, formData);
        if (response.success) {
          alert('Cập nhật cửa hàng thành công!');
          loadStores();
          handleCloseModal();
        }
      } else {
        // Create new store
        const response = await storeService.create(formData);
        if (response.success) {
          alert('Thêm cửa hàng thành công!');
          loadStores();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Lỗi khi lưu thông tin cửa hàng');
    }
  };

  const handleDelete = async (store) => {
    if (window.confirm(`Bạn có chắc muốn xóa cửa hàng "${store.name}" không?`)) {
      try {
        await storeService.delete(store._id);
        alert('Xóa cửa hàng thành công!');
        loadStores();
      } catch (error) {
        console.error('Error deleting store:', error);
        alert('Lỗi khi xóa cửa hàng');
      }
    }
  };

  const handleViewDetails = (storeId) => {
    navigate(`/stores/${storeId}`);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Quản Lý Cửa Hàng
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý thông tin cửa hàng, mã cửa hàng, khu vực và nhân viên
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleShowAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Thêm cửa hàng
          </button>
        )}
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
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Mã CH</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Tên Cửa Hàng</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Khu Vực</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Địa Chỉ</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Quản Lý</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Số NV</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Trạng Thái</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      Chưa có cửa hàng nào
                    </td>
                  </tr>
                ) : (
                  stores.map(store => (
                    <tr key={store._id} className="border-t border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{store.code}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{store.name}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{store.region || '-'}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {store.address || '-'}
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{store.manager || '-'}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300 text-center">{store.employeeCount || 0}</td>
                      <td className="p-3">
                        {store.status === 'active' ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30" title="Đang hoạt động">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl">check</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-900/30" title="Ngừng hoạt động">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-xl">close</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleShowEditModal(store)}
                                className="text-blue-600 hover:text-blue-500"
                                title="Sửa"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(store)}
                                className="text-red-600 hover:text-red-500"
                                title="Xóa"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </>
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
        Tổng số: {stores.length} cửa hàng
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingStore ? 'Sửa Thông Tin Cửa Hàng' : 'Thêm Cửa Hàng'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mã Cửa Hàng *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  placeholder="VD: SG-TPHCM-001"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên Cửa Hàng *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Tên cửa hàng"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Khu Vực
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Chọn khu vực</option>
                  <option value="Miền Nam">Miền Nam</option>
                  <option value="Miền Bắc">Miền Bắc</option>
                  <option value="Miền Trung">Miền Trung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ cửa hàng"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quản Lý
                </label>
                <input
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  placeholder="Tên quản lý"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trạng Thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  {editingStore ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Stores;
