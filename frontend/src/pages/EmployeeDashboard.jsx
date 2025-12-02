import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService, assessmentService } from '../services';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, assessments

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Find employee by email
      const empRes = await employeeService.getAll({ search: user.email });
      
      if (empRes.success && empRes.data.length > 0) {
        const emp = empRes.data[0];
        setEmployee(emp);
        
        // Load assessments
        const assessRes = await assessmentService.getAll({ employee: emp._id });
        if (assessRes.success && assessRes.data) {
          const sortedAssessments = assessRes.data.sort((a, b) => 
            new Date(b.assessmentDate) - new Date(a.assessmentDate)
          );
          setAssessments(sortedAssessments);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Không tìm thấy thông tin nhân viên</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  const latestAssessment = assessments[0];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Mobile Header */}
      <div className="bg-primary text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">person</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">{employee.name}</h1>
              <p className="text-sm opacity-90">{employee.employeeId}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark sticky top-16 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'assessments'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}
          >
            Lịch sử ({assessments.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Info Card */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
              <h2 className="font-semibold text-text-light dark:text-text-dark mb-3">Thông tin cá nhân</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-text-light dark:text-text-dark">{employee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Vị trí:</span>
                  <span className="font-medium text-primary">{employee.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cửa hàng:</span>
                  <span className="font-medium text-text-light dark:text-text-dark">
                    {employee.store?.name || '-'}
                  </span>
                </div>
                {employee.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">SĐT:</span>
                    <span className="font-medium text-text-light dark:text-text-dark">{employee.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Current Level Card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cấp độ hiện tại</p>
                {employee.currentLevel ? (
                  <>
                    <div className="relative w-32 h-32 mx-auto mb-4">
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
                          strokeDashoffset={351.86 - (351.86 * (employee.currentLevel / 4) * 100 / 100)}
                          className="text-primary transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">
                          {employee.currentLevel}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-text-light dark:text-text-dark">
                      {getLevelLabel(employee.currentLevel)}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400 py-8">Chưa có đánh giá</p>
                )}
              </div>
            </div>

            {/* Latest Assessment */}
            {latestAssessment && (
              <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
                <h2 className="font-semibold text-text-light dark:text-text-dark mb-3">Đánh giá gần nhất</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ngày:</span>
                    <span className="font-medium text-text-light dark:text-text-dark">
                      {formatDate(latestAssessment.assessmentDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Người đánh giá:</span>
                    <span className="font-medium text-text-light dark:text-text-dark">
                      {latestAssessment.evaluator?.fullName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Điểm TB:</span>
                    <span className="text-2xl font-bold text-primary">
                      {latestAssessment.overallScore?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="space-y-3">
            {assessments.length === 0 ? (
              <div className="bg-card-light dark:bg-card-dark rounded-xl p-8 text-center border border-border-light dark:border-border-dark">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-2">
                  assignment
                </span>
                <p className="text-gray-600 dark:text-gray-400">Chưa có đánh giá nào</p>
              </div>
            ) : (
              assessments.map((assessment, index) => (
                <div
                  key={assessment._id}
                  className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(assessment.assessmentDate)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Người đánh giá: {assessment.evaluator?.fullName || 'N/A'}
                      </p>
                    </div>
                    {assessment.overallScore && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(Math.round(assessment.overallScore))}`}>
                        Level {Math.round(assessment.overallScore)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</span>
                    <span className="text-2xl font-bold text-primary">
                      {assessment.overallScore?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  
                  {assessment.notes && (
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {assessment.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
