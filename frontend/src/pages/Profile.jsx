import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password if changing
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        alert('Vui lòng nhập mật khẩu hiện tại');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        alert('Mật khẩu mới không khớp');
        return;
      }
      if (formData.newPassword.length < 6) {
        alert('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
    }

    try {
      setLoading(true);
      
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      };

      // Add password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await api.put('/auth/profile', updateData);

      if (response.data.success) {
        alert('Cập nhật thông tin thành công!');
        setEditing(false);
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Update user in context if needed
        if (updateUserProfile) {
          updateUserProfile(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý thông tin tài khoản và đổi mật khẩu
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-8 border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary">person</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {user.fullName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.role === 'admin' ? 'Quản trị viên' : 
                   user.role === 'manager' ? 'Quản lý' :
                   user.role === 'hr' ? 'Nhân sự' : 'Người xem'}
                </p>
              </div>
            </div>
            
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">edit</span>
                Chỉnh sửa
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Không thể thay đổi</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg ${
                        editing 
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white' 
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                      } focus:ring-2 focus:ring-primary`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg ${
                        editing 
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white' 
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                      } focus:ring-2 focus:ring-primary`}
                      required
                    />
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
                      disabled={!editing}
                      placeholder="VD: 0901234567"
                      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg ${
                        editing 
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white' 
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                      } focus:ring-2 focus:ring-primary`}
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Section - Only show when editing */}
              {editing && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
                    Đổi mật khẩu
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Bỏ trống nếu không muốn thay đổi mật khẩu
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    // Reset form
                    setFormData({
                      fullName: user.fullName || '',
                      email: user.email || '',
                      username: user.username || '',
                      phone: user.phone || '',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
