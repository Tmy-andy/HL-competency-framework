const Position = require('../models/Position');

// @desc    Get all positions
// @route   GET /api/positions
// @access  Private
exports.getPositions = async (req, res) => {
  try {
    const { level } = req.query;
    
    let query = {};
    
    if (level) {
      query.level = level;
    }

    const positions = await Position.find(query)
      .populate('requiredCompetencies')
      .sort({ code: 1 });

    res.json({
      success: true,
      count: positions.length,
      data: positions
    });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách vị trí',
      error: error.message
    });
  }
};

// @desc    Get single position
// @route   GET /api/positions/:id
// @access  Private
exports.getPosition = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id)
      .populate('requiredCompetencies');

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vị trí'
      });
    }

    res.json({
      success: true,
      data: position
    });
  } catch (error) {
    console.error('Get position error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin vị trí',
      error: error.message
    });
  }
};

// @desc    Create position
// @route   POST /api/positions
// @access  Private (Admin only)
exports.createPosition = async (req, res) => {
  try {
    const position = await Position.create(req.body);

    res.status(201).json({
      success: true,
      data: position
    });
  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo vị trí',
      error: error.message
    });
  }
};

// @desc    Update position
// @route   PUT /api/positions/:id
// @access  Private (Admin only)
exports.updatePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('requiredCompetencies');

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vị trí'
      });
    }

    res.json({
      success: true,
      data: position
    });
  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật vị trí',
      error: error.message
    });
  }
};

// @desc    Delete position
// @route   DELETE /api/positions/:id
// @access  Private (Admin only)
exports.deletePosition = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vị trí'
      });
    }

    await position.deleteOne();

    res.json({
      success: true,
      message: 'Xóa vị trí thành công'
    });
  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa vị trí',
      error: error.message
    });
  }
};
