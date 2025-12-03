import React, { useState, useEffect } from 'react';
import competencyService from '../services/competencyService';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Competencies = () => {
  const { isAdmin, isManager } = useAuth();
  const [competencies, setCompetencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [formData, setFormData] = useState({
    nameVi: '',
    category: '',
    definition: '',
    level1: '',
    level2: '',
    level3: '',
    level4: ''
  });

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
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      nameVi: '',
      category: '',
      definition: '',
      level1: '',
      level2: '',
      level3: '',
      level4: ''
    });
    setShowModal(true);
  };

  const openEditModal = (comp) => {
    setModalMode('edit');
    setSelectedCompetency(comp);
    setFormData({
      nameVi: comp.nameVi || '',
      category: comp.category || '',
      definition: comp.definition || '',
      level1: comp.level1 || '',
      level2: comp.level2 || '',
      level3: comp.level3 || '',
      level4: comp.level4 || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCompetency(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.nameVi.trim() || !formData.category || !formData.definition.trim()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!formData.level1.trim() || !formData.level2.trim() || !formData.level3.trim() || !formData.level4.trim()) {
      alert('Vui lòng điền mô tả cho tất cả 4 cấp độ năng lực');
      return;
    }

    try {
      let response;
      if (modalMode === 'add') {
        response = await competencyService.create(formData);
      } else {
        response = await competencyService.update(selectedCompetency._id, formData);
      }

      if (response.success) {
        alert(modalMode === 'add' ? 'Thêm năng lực thành công!' : 'Cập nhật năng lực thành công!');
        closeModal();
        loadData();
      } else {
        alert(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving competency:', error);
      alert('Lỗi khi lưu năng lực');
    }
  };

  const handleDelete = async (comp) => {
    if (!window.confirm(`Bạn có chắc muốn xóa năng lực "${comp.nameVi}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      const response = await competencyService.delete(comp._id);
      if (response.success) {
        alert('Xóa năng lực thành công!');
        loadData();
      } else {
        alert(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting competency:', error);
      alert('Lỗi khi xóa năng lực');
    }
  };

  const filteredCompetencies = competencies.filter(comp => {
    const matchCategory = !selectedCategory || comp.category === selectedCategory;
    const matchSearch = !searchTerm || 
      comp.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchCategory && matchSearch;
  });

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Quản lý năng lực
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Danh sách 36 năng lực (competencies) cho vị trí Barista
          </p>
        </div>
        {(isAdmin || isManager) && (
          <button
            onClick={openAddModal}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-3 lg:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Thêm Năng Lực Mới</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 lg:p-6 mb-4 lg:mb-6 border border-border-light dark:border-border-dark">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lọc theo danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-3 lg:p-4 border border-border-light dark:border-border-dark">
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng số năng lực</p>
          <p className="text-xl lg:text-2xl font-bold text-primary">{competencies.length}</p>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-3 lg:p-4 border border-border-light dark:border-border-dark">
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">Danh mục</p>
          <p className="text-xl lg:text-2xl font-bold text-blue-600">{categories.length}</p>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-3 lg:p-4 border border-border-light dark:border-border-dark">
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">Đang hiển thị</p>
          <p className="text-xl lg:text-2xl font-bold text-green-600">{filteredCompetencies.length}</p>
        </div>
      </div>

      {/* Competencies List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          </div>
        ) : filteredCompetencies.length === 0 ? (
          <div className="bg-card-light dark:bg-card-dark rounded-xl p-12 border border-border-light dark:border-border-dark text-center">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">search_off</span>
            <p className="text-gray-600 dark:text-gray-400">Không tìm thấy năng lực nào</p>
          </div>
        ) : (
          filteredCompetencies.map((comp, index) => (
            <div
              key={comp._id}
              className="bg-card-light dark:bg-card-dark rounded-xl p-4 lg:p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs lg:text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {comp.nameVi}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {comp.definition}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-2.5 lg:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {comp.category}
                        </span>
                        <span className="inline-block px-2.5 lg:px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                          ID: {comp.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-4">
                  {(isAdmin || isManager) && (
                    <>
                      <button
                        onClick={() => openEditModal(comp)}
                        className="flex-1 lg:flex-none p-2.5 lg:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span className="material-symbols-outlined text-xl lg:text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(comp)}
                        className="flex-1 lg:flex-none p-2.5 lg:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-xl lg:text-lg">delete</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setExpandedId(expandedId === comp._id ? null : comp._id)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-1 p-2.5 lg:p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors text-xs lg:text-sm font-medium"
                  >
                    <span>{expandedId === comp._id ? 'Thu gọn' : 'Xem chi tiết'}</span>
                    <span className="material-symbols-outlined text-lg">
                      {expandedId === comp._id ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === comp._id && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Chi tiết 4 level năng lực:
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Level 1 - Critical */}
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs font-semibold">
                          LEVEL 1
                        </span>
                      </div>
                      <p className="text-sm text-red-900 dark:text-red-100">
                        {comp.level1}
                      </p>
                    </div>

                    {/* Level 2 - Low */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-semibold">
                          LEVEL 2
                        </span>
                      </div>
                      <p className="text-sm text-yellow-900 dark:text-yellow-100">
                        {comp.level2}
                      </p>
                    </div>

                    {/* Level 3 - Medium */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold">
                          LEVEL 3
                        </span>
                      </div>
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        {comp.level3}
                      </p>
                    </div>

                    {/* Level 4 - High */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-semibold">
                          LEVEL 4
                        </span>
                      </div>
                      <p className="text-sm text-green-900 dark:text-green-100">
                        {comp.level4}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(comp.evidence || comp.trainingMethod) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {comp.evidence && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Evidence / Observable:
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {comp.evidence}
                          </p>
                        </div>
                      )}
                      {comp.trainingMethod && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Training Method:
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {comp.trainingMethod}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {!loading && filteredCompetencies.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Hiển thị {filteredCompetencies.length} / {competencies.length} năng lực
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'add' ? 'Thêm Năng Lực Mới' : 'Chỉnh Sửa Năng Lực'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Row 1: Tên và Danh mục */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tên Năng Lực <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameVi"
                    value={formData.nameVi}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nhóm Năng Lực <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 text-sm"
                    required
                  >
                    <option value="">Chọn nhóm năng lực</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Mô tả chung */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mô Tả Chung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="definition"
                  value={formData.definition}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="Mô tả tổng quát về năng lực..."
                  rows="2"
                  required
                />
              </div>

              {/* Proficiency Levels */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Các Level Năng Lực <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Level 1 - Critical */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Level 1
                      </label>
                    </div>
                    <textarea
                      name="level1"
                      value={formData.level1}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Mô tả..."
                      rows="2"
                      required
                    />
                  </div>

                  {/* Level 2 - Low */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Level 2
                      </label>
                    </div>
                    <textarea
                      name="level2"
                      value={formData.level2}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Mô tả..."
                      rows="2"
                      required
                    />
                  </div>

                  {/* Level 3 - Medium */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Level 3
                      </label>
                    </div>
                    <textarea
                      name="level3"
                      value={formData.level3}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Mô tả..."
                      rows="2"
                      required
                    />
                  </div>

                  {/* Level 4 - High */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Level 4
                      </label>
                    </div>
                    <textarea
                      name="level4"
                      value={formData.level4}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Mô tả..."
                      rows="2"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium flex items-center justify-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined">save</span>
                <span>{modalMode === 'add' ? 'Thêm Năng Lực' : 'Lưu Thay Đổi'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Competencies;
