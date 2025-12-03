import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeService, assessmentService } from '../services';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, info, assessments
  const [latestAssessment, setLatestAssessment] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const empRes = await employeeService.getById(id);
      
      if (empRes.success) {
        // Backend returns { employee, assessments } structure
        const { employee, assessments: empAssessments } = empRes.data;
        setEmployee(employee);
        
        // Use assessments from employee detail response if available
        if (empAssessments && empAssessments.length > 0) {
          const sortedAssessments = empAssessments.sort((a, b) => 
            new Date(b.assessmentDate) - new Date(a.assessmentDate)
          );
          setAssessments(sortedAssessments);
          
          // Set latest assessment
          if (sortedAssessments.length > 0) {
            setLatestAssessment(sortedAssessments[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu nhân viên');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này? Hành động này không thể hoàn tác.')) {
      try {
        await employeeService.delete(id);
        alert('Xóa nhân viên thành công');
        navigate('/employees');
      } catch (error) {
        alert('Lỗi khi xóa nhân viên');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/employees/${id}/edit`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getLevelColor = (level) => {
    const colors = {
      1: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      3: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      4: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getLevelLabel = (level) => {
    const labels = {
      1: 'Mới bắt đầu',
      2: 'Đang phát triển',
      3: 'Thành thạo',
      4: 'Chuyên gia'
    };
    return labels[level] || 'Chưa xác định';
  };

  const calculateProgressPercentage = (level) => {
    return ((level || 0) / 4) * 100;
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

  if (!employee) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Không tìm thấy nhân viên</p>
          <Link to="/employees" className="text-primary hover:underline">
            Quay lại danh sách
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/employees"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-4"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Quay lại danh sách nhân viên</span>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
              {employee.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Mã nhân viên: {employee.employeeId}
            </p>
          </div>
          
          <div className="flex gap-3">
            {(isAdmin || isManager) && (
              <>
                <Link
                  to={`/assessments?employee=${employee._id}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined">assessment</span>
                  Đánh giá mới
                </Link>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="material-symbols-outlined">edit</span>
                  Chỉnh sửa
                </button>
              </>
            )}
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
                Xóa
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-light dark:border-border-dark mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary'
            }`}
          >
            Tổng quan năng lực
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary'
            }`}
          >
            Thông tin chung
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`pb-3 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'assessments'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary'
            }`}
          >
            Lịch sử đánh giá ({assessments.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Profile Header Card */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 border border-border-light dark:border-border-dark">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center mb-4 border-4 border-white dark:border-gray-700 shadow-lg">
                  {employee.avatar ? (
                    <img 
                      src={employee.avatar} 
                      alt={employee.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span className={`material-symbols-outlined text-6xl text-primary ${employee.avatar ? 'hidden' : ''}`}>person</span>
                </div>
                <p className="text-xl font-bold text-text-light dark:text-text-dark">
                  {employee.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Mã nhân viên: {employee.employeeId}
                </p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  employee.currentLevel ? getLevelColor(employee.currentLevel) : 'bg-gray-100 text-gray-800'
                }`}>
                  {employee.currentLevel ? `Level ${employee.currentLevel}` : 'Chưa đánh giá'}
                </span>
              </div>

              {/* Description List */}
              <div className="mt-6 grid grid-cols-1 gap-x-4">
                <div className="border-t border-gray-200 dark:border-gray-700 py-4 grid grid-cols-[auto_1fr] gap-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Vị trí</p>
                  <p className="text-text-light dark:text-text-dark text-sm font-medium text-right">
                    {employee.position || '-'}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-4 grid grid-cols-[auto_1fr] gap-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Cửa hàng</p>
                  <p className="text-text-light dark:text-text-dark text-sm font-medium text-right">
                    {employee.store?.name || '-'}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-4 grid grid-cols-[auto_1fr] gap-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Email</p>
                  <p className="text-text-light dark:text-text-dark text-sm font-medium text-right">
                    {employee.email || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mức Năng Lực Hiện Tại */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 border border-border-light dark:border-border-dark">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
                Mức Năng Lực Hiện Tại
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="351.86"
                      strokeDashoffset={351.86 - (351.86 * calculateProgressPercentage(employee.currentLevel) / 100)}
                      className="text-blue-600 dark:text-blue-400 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-text-light dark:text-text-dark">
                      {calculateProgressPercentage(employee.currentLevel).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {employee.currentLevel ? `Level ${employee.currentLevel}` : 'Chưa đánh giá'}
                    </span>
                  </p>
                  {latestAssessment && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Đánh giá ngày {formatDate(latestAssessment.assessmentDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Competency Details */}
          <div className="lg:col-span-2">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                  Chi tiết Đánh giá Năng lực
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {latestAssessment 
                    ? `Dựa trên đánh giá gần nhất - ${formatDate(latestAssessment.assessmentDate)}`
                    : 'Chưa có đánh giá nào'
                  }
                </p>
              </div>
              <div className="overflow-x-auto">
                {!latestAssessment ? (
                  <div className="p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                      assignment
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Chưa có đánh giá nào cho nhân viên này
                    </p>
                    {(isAdmin || isManager) && (
                      <Link
                        to={`/assessments?employee=${employee._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        <span className="material-symbols-outlined">add</span>
                        Tạo đánh giá mới
                      </Link>
                    )}
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3">Năng Lực</th>
                        <th className="px-6 py-3">Level</th>
                        <th className="px-6 py-3">Ghi chú/Nhận xét</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestAssessment.competencyRatings && latestAssessment.competencyRatings.length > 0 ? (
                        latestAssessment.competencyRatings.map((rating, index) => (
                          <tr
                            key={index}
                            className="bg-white dark:bg-card-dark border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                              {rating.competencyName || rating.competencyId || '-'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getLevelColor(rating.levelNumber)}`}>
                                Level {rating.levelNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                              {rating.comment || <span className="text-xs italic">Chưa có nhận xét</span>}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                            Không có dữ liệu năng lực
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INFO TAB */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">
                Thông tin cá nhân
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Họ tên</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{employee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mã nhân viên</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{employee.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Số điện thoại</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{employee.phone || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ngày sinh</p>
                  <p className="font-medium text-text-light dark:text-text-dark">
                    {employee.dateOfBirth ? formatDate(employee.dateOfBirth) : 'Chưa cập nhật'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ngày vào làm</p>
                  <p className="font-medium text-text-light dark:text-text-dark">
                    {employee.hireDate ? formatDate(employee.hireDate) : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">
                Thông tin công việc
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vị trí</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {employee.position}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cửa hàng</p>
                  <p className="font-medium text-text-light dark:text-text-dark">
                    {employee.store?.name || 'Chưa phân công'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trạng thái</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    employee.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {employee.status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cấp độ hiện tại</p>
                  {employee.currentLevel ? (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(employee.currentLevel)}`}>
                      Level {employee.currentLevel} - {getLevelLabel(employee.currentLevel)}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa đánh giá</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
                Thống kê nhanh
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Số lần đánh giá</span>
                  <span className="text-2xl font-bold text-primary">{assessments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cấp độ hiện tại</span>
                  <span className="text-2xl font-bold text-primary">
                    {employee.currentLevel || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Thâm niên</span>
                  <span className="text-2xl font-bold text-primary">
                    {employee.hireDate 
                      ? Math.floor((new Date() - new Date(employee.hireDate)) / (365 * 24 * 60 * 60 * 1000))
                      : '0'} năm
                  </span>
                </div>
              </div>
            </div>

            {/* Latest Assessment */}
            {latestAssessment && (
              <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
                  Đánh giá gần nhất
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ngày đánh giá</p>
                    <p className="font-medium text-text-light dark:text-text-dark">
                      {formatDate(latestAssessment.assessmentDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Người đánh giá</p>
                    <p className="font-medium text-text-light dark:text-text-dark">
                      {latestAssessment.evaluator?.fullName || latestAssessment.evaluator?.name || latestAssessment.evaluator?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</p>
                    <p className="text-2xl font-bold text-primary">
                      {latestAssessment.overallScore?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ASSESSMENTS TAB */}
      {activeTab === 'assessments' && (
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          {assessments.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                assignment
              </span>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Chưa có đánh giá nào cho nhân viên này
              </p>
              {(isAdmin || isManager) && (
                <Link
                  to={`/assessments?employee=${employee._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined">add</span>
                  Tạo đánh giá mới
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Ngày đánh giá</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Người đánh giá</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Điểm TB</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Cấp độ</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map(assessment => (
                    <tr key={assessment._id} className="border-t border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        {formatDate(assessment.assessmentDate)}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        {assessment.evaluator?.fullName || assessment.evaluator?.name || assessment.evaluator?.email || 'N/A'}
                      </td>
                      <td className="p-4">
                        <span className="text-lg font-semibold text-primary">
                          {assessment.overallScore?.toFixed(1) || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        {assessment.overallScore ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(Math.round(assessment.overallScore))}`}>
                            Level {Math.round(assessment.overallScore)}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        {assessment.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default EmployeeDetail;
