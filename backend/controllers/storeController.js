const Store = require('../models/Store');
const Employee = require('../models/Employee');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private
exports.getStores = async (req, res) => {
  try {
    const { region, status } = req.query;
    
    let query = {};
    
    if (region) {
      query.region = region;
    }
    
    if (status) {
      query.status = status;
    }

    const stores = await Store.find(query).sort({ code: 1 });

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách cửa hàng',
      error: error.message
    });
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Private
exports.getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cửa hàng'
      });
    }

    // Get employees in this store
    const employees = await Employee.find({ store: store._id });

    res.json({
      success: true,
      data: {
        store,
        employees
      }
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin cửa hàng',
      error: error.message
    });
  }
};

// @desc    Create store
// @route   POST /api/stores
// @access  Private (Admin only)
exports.createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);

    res.status(201).json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo cửa hàng',
      error: error.message
    });
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private (Admin only)
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cửa hàng'
      });
    }

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật cửa hàng',
      error: error.message
    });
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private (Admin only)
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cửa hàng'
      });
    }

    // Check if store has employees
    const employeeCount = await Employee.countDocuments({ store: store._id });
    if (employeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa cửa hàng còn nhân viên'
      });
    }

    await store.deleteOne();

    res.json({
      success: true,
      message: 'Xóa cửa hàng thành công'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa cửa hàng',
      error: error.message
    });
  }
};

// @desc    Get store statistics
// @route   GET /api/stores/:id/stats
// @access  Private
exports.getStoreStats = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cửa hàng'
      });
    }

    const totalEmployees = await Employee.countDocuments({ 
      store: store._id,
      status: 'active'
    });

    // Position distribution
    const positionStats = await Employee.aggregate([
      { $match: { store: store._id, status: 'active' } },
      {
        $group: {
          _id: '$position',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        store,
        totalEmployees,
        positionStats
      }
    });
  } catch (error) {
    console.error('Get store stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê cửa hàng',
      error: error.message
    });
  }
};
