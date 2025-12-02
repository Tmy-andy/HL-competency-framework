const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, role, store } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc username đã tồn tại'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role: role || 'viewer',
      store
    });

    // Return user with token
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập username và password'
      });
    }

    // First, try to find user by username (for admin/manager/hr)
    let user = await User.findOne({ username }).select('+password');
    let isEmployee = false;
    let employeeData = null;

    // If not found, try to find employee by employeeId
    if (!user) {
      const Employee = require('../models/Employee');
      const employee = await Employee.findOne({ employeeId: username });
      
      if (employee) {
        // Verify phone number as password
        if (employee.phone === password) {
          isEmployee = true;
          employeeData = employee;
          
          // Create/find user account for this employee
          user = await User.findOne({ email: employee.email });
          
          if (!user) {
            // Auto-create employee user account
            user = await User.create({
              username: employee.employeeId,
              email: employee.email,
              password: employee.phone, // Will be hashed
              fullName: employee.name,
              role: 'employee', // New role for employees
              phone: employee.phone,
              isActive: true
            });
          }
        } else {
          return res.status(401).json({
            success: false,
            message: 'Thông tin đăng nhập không chính xác'
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: 'Thông tin đăng nhập không chính xác'
        });
      }
    }

    // For regular users, check password normally
    if (!isEmployee) {
      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa'
        });
      }

      // Check password
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Thông tin đăng nhập không chính xác'
        });
      }
    }

    // Return user with token
    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isEmployee: isEmployee,
        employeeId: employeeData?._id,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('store');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateFullProfile = async (req, res) => {
  try {
    const { fullName, email, phone, currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Update basic fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;

    // Handle password change if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập mật khẩu hiện tại'
        });
      }

      // Verify current password
      const isPasswordMatch = await user.comparePassword(currentPassword);
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Mật khẩu hiện tại không chính xác'
        });
      }

      user.password = newPassword;
    }

    await user.save();

    // Return updated user (without password)
    const updatedUser = await User.findById(user._id);
    
    res.json({
      success: true,
      data: updatedUser,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật profile',
      error: error.message
    });
  }
};

// @desc    Update user profile (old method)
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      fullName: req.body.fullName,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật profile',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/changepassword
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đổi mật khẩu',
      error: error.message
    });
  }
};
