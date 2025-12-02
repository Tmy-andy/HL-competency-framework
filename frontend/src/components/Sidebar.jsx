import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard', roles: ['admin', 'manager', 'hr', 'viewer'] },
    { path: '/employees', icon: 'group', label: 'Quản lý nhân viên', roles: ['admin', 'manager', 'hr'] },
    { path: '/assessments', icon: 'assignment', label: 'Đánh giá năng lực', roles: ['admin', 'manager'] },
    { path: '/competencies', icon: 'lightbulb', label: 'Quản lý năng lực', roles: ['admin'] },
    { path: '/stores', icon: 'store', label: 'Quản lý cửa hàng', roles: ['admin'] },
    { path: '/reports', icon: 'analytics', label: 'Báo cáo', roles: ['admin', 'manager', 'hr'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-screen w-64 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border-light dark:border-border-dark">
        <h1 className="text-2xl font-bold text-primary">Competency</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Framework System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <Link
          to="/profile"
          onClick={handleNavClick}
          className={`flex items-center gap-3 mb-4 p-3 rounded-lg transition-colors ${
            location.pathname === '/profile'
              ? 'bg-primary/10 text-primary dark:bg-primary/30'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-text-light dark:text-text-dark">
              {user?.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
