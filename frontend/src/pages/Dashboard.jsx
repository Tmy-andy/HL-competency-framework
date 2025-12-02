import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    completedAssessments: 0,
    completionRate: 0,
    levelDistribution: { CRITICAL: 0, LOW: 0, MEDIUM: 0, HIGH: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await employeeService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentages for chart
  const total = stats.levelDistribution.CRITICAL + stats.levelDistribution.LOW + 
                stats.levelDistribution.MEDIUM + stats.levelDistribution.HIGH || 1;
  const percentages = {
    HIGH: Math.round((stats.levelDistribution.HIGH / total) * 100),
    MEDIUM: Math.round((stats.levelDistribution.MEDIUM / total) * 100),
    LOW: Math.round((stats.levelDistribution.LOW / total) * 100),
    CRITICAL: Math.round((stats.levelDistribution.CRITICAL / total) * 100)
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Dashboard Tổng Quan
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Thống kê tổng quan về năng lực nhân viên trong hệ thống
          </p>
        </div>
        <Link
          to="/assessments"
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-3 lg:py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Tạo đánh giá mới</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-5 lg:p-6 border border-border-light dark:border-border-dark">
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-2">Tổng số nhân viên</p>
          <p className="text-3xl lg:text-4xl font-bold text-text-light dark:text-text-dark mb-3">
            {stats.totalEmployees}
          </p>
          <div className="flex items-center text-green-500">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="text-xs lg:text-sm ml-1">Dữ liệu từ hệ thống</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl p-5 lg:p-6 border border-border-light dark:border-border-dark">
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-2">Đánh giá đã hoàn thành</p>
          <p className="text-3xl lg:text-4xl font-bold text-text-light dark:text-text-dark mb-3">
            {stats.completedAssessments} / {stats.totalEmployees}
          </p>
          <div className="flex items-center text-green-500">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="text-xs lg:text-sm ml-1">{stats.completionRate}% hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-5 lg:p-6 border border-border-light dark:border-border-dark mb-6 lg:mb-8">
        <div className="mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-text-light dark:text-text-dark mb-2">
            Phân bố mức độ năng lực
          </h2>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
            Dựa trên {stats.completedAssessments} đánh giá đã hoàn thành
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-6 lg:gap-8">
          {/* Pie Chart */}
          <div className="relative w-44 h-44 lg:w-52 lg:h-52">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="stroke-[#36B37E] stroke-[4]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" strokeDasharray={`${percentages.HIGH}, 100`}></path>
              <path className="stroke-[#00B8D9] stroke-[4]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" strokeDasharray={`${percentages.MEDIUM}, 100`} 
                strokeDashoffset={`-${percentages.HIGH}`}></path>
              <path className="stroke-[#FFAB00] stroke-[4]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" strokeDasharray={`${percentages.LOW}, 100`} 
                strokeDashoffset={`-${percentages.HIGH + percentages.MEDIUM}`}></path>
              <path className="stroke-[#DE350B] stroke-[4]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" strokeDasharray={`${percentages.CRITICAL}, 100`} 
                strokeDashoffset={`-${percentages.HIGH + percentages.MEDIUM + percentages.LOW}`}></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl lg:text-3xl font-bold text-text-light dark:text-text-dark">
                {total}
              </span>
              <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Nhân viên</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#36B37E]"></div>
              <div className="flex w-32 justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">High</span>
                <span className="text-sm font-semibold">{percentages.HIGH}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#00B8D9]"></div>
              <div className="flex w-32 justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Medium</span>
                <span className="text-sm font-semibold">{percentages.MEDIUM}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#FFAB00]"></div>
              <div className="flex w-32 justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Low</span>
                <span className="text-sm font-semibold">{percentages.LOW}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#DE350B]"></div>
              <div className="flex w-32 justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Critical</span>
                <span className="text-sm font-semibold">{percentages.CRITICAL}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg lg:text-xl font-semibold text-text-light dark:text-text-dark mb-4">
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
          <Link
            to="/employees"
            className="flex items-center gap-3 lg:gap-4 p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <div>
              <p className="text-sm lg:text-base font-semibold text-text-light dark:text-text-dark">Quản lý nhân viên</p>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Xem danh sách nhân viên</p>
            </div>
          </Link>

          <Link
            to="/assessments"
            className="flex items-center gap-3 lg:gap-4 p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">add_circle</span>
            </div>
            <div>
              <p className="text-sm lg:text-base font-semibold text-text-light dark:text-text-dark">Tạo đánh giá mới</p>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Bắt đầu phiên đánh giá mới</p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="flex items-center gap-3 lg:gap-4 p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <div>
              <p className="text-sm lg:text-base font-semibold text-text-light dark:text-text-dark">Xem báo cáo chi tiết</p>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Phân tích dữ liệu chuyên sâu</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
