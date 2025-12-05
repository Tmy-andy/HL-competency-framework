import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService, assessmentService, storeService } from '../services';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    assessedEmployees: 0,
    assessmentRate: 0,
    averageScore: 0
  });
  const [employees, setEmployees] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    store: '',
    position: '',
    dateFrom: '',
    dateTo: ''
  });
  const [chartData, setChartData] = useState({
    competencyDistribution: {},
    levelDistribution: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Reset filters
      setFilters({
        store: '',
        position: '',
        dateFrom: '',
        dateTo: ''
      });
      
      const [empRes, assessRes, storeRes] = await Promise.all([
        employeeService.getAll(),
        assessmentService.getAll(),
        storeService.getAll()
      ]);

      if (empRes.success) {
        setEmployees(empRes.data);
      }

      if (storeRes.success) {
        setStores(storeRes.data);
      }

      if (assessRes.success && empRes.success) {
        // Calculate stats based on actual assessment data
        const assessments = assessRes.data;
        const employees = empRes.data;
        
        // Store assessments for filtering
        setAssessments(assessments);
        
        // Get unique employees who have been assessed
        const assessedEmployeeIds = new Set(assessments.map(a => a.employee?._id || a.employee));
        const assessedCount = assessedEmployeeIds.size;
        const totalEmployees = employees.length;
        const assessmentRate = totalEmployees > 0 ? (assessedCount / totalEmployees * 100).toFixed(1) : 0;
        
        // Calculate average score from all assessments
        const assessmentsWithScore = assessments.filter(a => a.overallScore);
        const avgScore = assessmentsWithScore.length > 0
          ? (assessmentsWithScore.reduce((sum, a) => sum + a.overallScore, 0) / assessmentsWithScore.length).toFixed(1)
          : 0;
        
        setStats({
          totalEmployees,
          assessedEmployees: assessedCount,
          assessmentRate,
          averageScore: avgScore
        });

        processChartData(assessments);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (assessments) => {
    // Process level distribution
    const levelDist = {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    assessments.forEach(assessment => {
      const level = Math.round(assessment.overallScore || 0);
      if (level >= 1 && level <= 4) {
        levelDist[level]++;
      }
    });

    setChartData({
      levelDistribution: levelDist
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      
      // Filter employees based on store and position
      const filteredEmps = employees.filter(emp => {
        const matchStore = !filters.store || emp.store?._id === filters.store;
        const matchPosition = !filters.position || emp.position === filters.position;
        return matchStore && matchPosition;
      });
      
      // Get IDs of filtered employees
      const filteredEmpIds = filteredEmps.map(e => e._id);
      
      // Build query params for assessments
      const params = {};
      if (filters.dateFrom) params.startDate = filters.dateFrom;
      if (filters.dateTo) params.endDate = filters.dateTo;
      
      // Fetch all assessments (or filtered by date)
      const assessRes = await assessmentService.getAll(params);
      
      if (assessRes.success) {
        // Filter assessments to only include filtered employees
        let filteredAssessments = assessRes.data.filter(a => 
          filteredEmpIds.includes(a.employee?._id || a.employee)
        );
        
        setAssessments(filteredAssessments);
        
        // Recalculate stats with filtered data
        const assessedEmployeeIds = new Set(filteredAssessments.map(a => a.employee?._id || a.employee));
        const assessedCount = assessedEmployeeIds.size;
        const totalFiltered = filteredEmps.length;
        const assessmentRate = totalFiltered > 0 ? (assessedCount / totalFiltered * 100).toFixed(1) : 0;
        
        const assessmentsWithScore = filteredAssessments.filter(a => a.overallScore);
        const avgScore = assessmentsWithScore.length > 0
          ? (assessmentsWithScore.reduce((sum, a) => sum + a.overallScore, 0) / assessmentsWithScore.length).toFixed(1)
          : 0;
        
        setStats({
          totalEmployees: totalFiltered,
          assessedEmployees: assessedCount,
          assessmentRate,
          averageScore: avgScore
        });
        
        processChartData(filteredAssessments);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      alert('Lỗi khi áp dụng bộ lọc');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    alert('Tính năng xuất báo cáo đang được phát triển');
  };

  const getLevelBadge = (level) => {
    if (!level) return <span className="text-gray-400 text-sm">Chưa đánh giá</span>;
    
    const configs = {
      1: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', label: 'Mới bắt đầu' },
      2: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', label: 'Đang phát triển' },
      3: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', label: 'Thành thạo' },
      4: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', label: 'Chuyên gia' }
    };

    const config = configs[level] || configs[1];
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        Level {level} - {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredEmployees = employees.filter(emp => {
    const matchStore = !filters.store || emp.store?._id === filters.store;
    const matchPosition = !filters.position || emp.position === filters.position;
    return matchStore && matchPosition;
  });

  // Get assessment count for each employee
  const getEmployeeAssessmentCount = (employeeId) => {
    return assessments.filter(a => 
      (a.employee?._id || a.employee) === employeeId
    ).length;
  };

  // Get latest assessment for employee
  const getLatestAssessment = (employeeId) => {
    const empAssessments = assessments.filter(a => 
      (a.employee?._id || a.employee) === employeeId
    ).sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate));
    
    return empAssessments[0];
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
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Báo Cáo & Phân Tích
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Xem và phân tích dữ liệu đánh giá năng lực nhân viên
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-3 lg:py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="material-symbols-outlined">download</span>
          <span>Xuất báo cáo</span>
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 lg:p-4 border border-border-light dark:border-border-dark mb-4 lg:mb-6">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100">
            Bộ lọc báo cáo
          </h3>
          {(filters.store || filters.position || filters.dateFrom || filters.dateTo) && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              Đang lọc
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 lg:gap-3">
          <select
            name="store"
            value={filters.store}
            onChange={handleFilterChange}
            className="h-10 lg:h-9 px-3 pr-8 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả cửa hàng</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>{store.code} {store.name}</option>
            ))}
          </select>

          <select
            name="position"
            value={filters.position}
            onChange={handleFilterChange}
            className="h-10 lg:h-9 px-3 pr-8 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả vị trí</option>
            <option value="AP">AP (Assistant Manager)</option>
            <option value="B">Barista</option>
            <option value="MB">Master Barista</option>
            <option value="SL">Server Leader</option>
            <option value="Crew Leader">Crew Leader</option>
          </select>

          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="h-10 lg:h-9 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary"
            placeholder="Từ ngày"
          />

          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="h-10 lg:h-9 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary"
            placeholder="Đến ngày"
          />

          <button
            onClick={handleApplyFilters}
            className="h-10 lg:h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">filter_alt</span>
            Áp dụng
          </button>

          <button
            onClick={loadData}
            className="h-10 lg:h-9 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Reset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-6">
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 lg:p-6 border border-border-light dark:border-border-dark">
          <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm font-medium mb-2">
            Tổng nhân viên
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-50">
            {stats.totalEmployees}
          </p>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 lg:p-6 border border-border-light dark:border-border-dark">
          <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm font-medium mb-2">
            Nhân viên đã đánh giá
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-50">
            {stats.assessedEmployees}{' '}
            <span className="text-sm lg:text-lg text-gray-500 dark:text-gray-400 font-medium">
              ({stats.assessmentRate}%)
            </span>
          </p>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 lg:p-6 border border-border-light dark:border-border-dark">
          <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm font-medium mb-2">
            Điểm trung bình
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-50">
            {stats.averageScore} / 4.0
          </p>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 lg:p-6 border border-border-light dark:border-border-dark">
          <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm font-medium mb-2">
            Tổng số cửa hàng
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-50">
            {stores.length}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Level Distribution Chart */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Phân bố theo cấp độ năng lực
          </h3>
          <div className="space-y-4">
            {Object.entries(chartData.levelDistribution).map(([level, count]) => {
              const total = Object.values(chartData.levelDistribution).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
              const colors = {
                1: 'bg-red-500',
                2: 'bg-yellow-500',
                3: 'bg-blue-500',
                4: 'bg-green-500'
              };
              const labels = {
                1: 'Mới bắt đầu',
                2: 'Đang phát triển',
                3: 'Thành thạo',
                4: 'Chuyên gia'
              };

              return (
                <div key={level}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Level {level}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${colors[level]} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Thao tác nhanh
          </h3>
          <div className="space-y-3">
            <Link
              to="/assessments"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">assessment</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Tạo đánh giá mới</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đánh giá năng lực nhân viên</p>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </Link>

            <Link
              to="/employees"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">group</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Quản lý nhân viên</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Xem danh sách nhân viên</p>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </Link>

            <Link
              to="/competencies"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Quản lý năng lực</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cấu hình khung năng lực</p>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Danh sách chi tiết nhân viên
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Mã NV
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Cửa hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Số lần ĐG
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Cấp độ hiện tại
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  const latestAssessment = getLatestAssessment(emp._id);
                  const assessmentCount = getEmployeeAssessmentCount(emp._id);
                  const currentLevel = latestAssessment?.overallScore 
                    ? Math.round(latestAssessment.overallScore)
                    : emp.currentLevel;
                  
                  return (
                    <tr
                      key={emp._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {emp.employeeId}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {emp.position}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {emp.store?.name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          assessmentCount > 0 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {assessmentCount} lần
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getLevelBadge(currentLevel)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/employees/${emp._id}`}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {filteredEmployees.length} / {employees.length} nhân viên
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
