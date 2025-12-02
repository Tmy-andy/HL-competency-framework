const Employee = require('../models/Employee');
const Assessment = require('../models/Assessment');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    const { store, position, status, search } = req.query;
    
    let query = {};
    
    if (store) {
      query.store = store;
    }
    
    if (position) {
      query.position = position;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query)
      .populate('store')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách nhân viên',
      error: error.message
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('store');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    // Get employee assessments
    const assessments = await Assessment.find({ employee: employee._id })
      .populate('evaluator', 'fullName')
      .populate('competencyRatings.competency')
      .sort({ assessmentDate: -1 });

    res.json({
      success: true,
      data: {
        employee,
        assessments
      }
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin nhân viên',
      error: error.message
    });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private (Admin, Manager)
exports.createEmployee = async (req, res) => {
  try {
    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({ employeeId: req.body.employeeId });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Mã nhân viên đã tồn tại'
      });
    }

    // Check if email already exists
    const existingEmail = await Employee.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    const employee = await Employee.create(req.body);
    await employee.populate('store');

    res.status(201).json({
      success: true,
      data: employee,
      message: 'Tạo nhân viên thành công'
    });
  } catch (error) {
    console.error('Create employee error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo nhân viên',
      error: error.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin, Manager)
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('store');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật nhân viên',
      error: error.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    // Delete all assessments for this employee
    await Assessment.deleteMany({ employee: employee._id });

    await employee.deleteOne();

    res.json({
      success: true,
      message: 'Xóa nhân viên thành công'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa nhân viên',
      error: error.message
    });
  }
};

// @desc    Get employee statistics
// @route   GET /api/employees/stats/overview
// @access  Private
exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    
    const assessmentStats = await Assessment.aggregate([
      {
        $group: {
          _id: '$classification',
          count: { $sum: 1 }
        }
      }
    ]);

    const levelDistribution = {
      CRITICAL: 0,
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0
    };

    assessmentStats.forEach(stat => {
      if (stat._id) {
        levelDistribution[stat._id] = stat.count;
      }
    });

    const completedAssessments = await Assessment.countDocuments({ status: 'completed' });
    const completionRate = totalEmployees > 0 
      ? Math.round((completedAssessments / totalEmployees) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        totalEmployees,
        completedAssessments,
        completionRate,
        levelDistribution
      }
    });
  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê',
      error: error.message
    });
  }
};
