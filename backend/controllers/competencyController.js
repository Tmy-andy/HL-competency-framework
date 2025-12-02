const Competency = require('../models/Competency');

// @desc    Get all competencies
// @route   GET /api/competencies
// @access  Private
exports.getCompetencies = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameVi: { $regex: search, $options: 'i' } }
      ];
    }

    const competencies = await Competency.find(query).sort({ id: 1 });

    res.json({
      success: true,
      count: competencies.length,
      data: competencies
    });
  } catch (error) {
    console.error('Get competencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách năng lực',
      error: error.message
    });
  }
};

// @desc    Get single competency
// @route   GET /api/competencies/:id
// @access  Private
exports.getCompetency = async (req, res) => {
  try {
    const competency = await Competency.findOne({ id: req.params.id });

    if (!competency) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy năng lực'
      });
    }

    res.json({
      success: true,
      data: competency
    });
  } catch (error) {
    console.error('Get competency error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin năng lực',
      error: error.message
    });
  }
};

// @desc    Create competency
// @route   POST /api/competencies
// @access  Private (Admin only)
exports.createCompetency = async (req, res) => {
  try {
    const competency = await Competency.create(req.body);

    res.status(201).json({
      success: true,
      data: competency
    });
  } catch (error) {
    console.error('Create competency error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo năng lực',
      error: error.message
    });
  }
};

// @desc    Update competency
// @route   PUT /api/competencies/:id
// @access  Private (Admin only)
exports.updateCompetency = async (req, res) => {
  try {
    const competency = await Competency.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!competency) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy năng lực'
      });
    }

    res.json({
      success: true,
      data: competency,
      message: 'Cập nhật năng lực thành công'
    });
  } catch (error) {
    console.error('Update competency error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật năng lực',
      error: error.message
    });
  }
};

// @desc    Delete competency
// @route   DELETE /api/competencies/:id
// @access  Private (Admin only)
exports.deleteCompetency = async (req, res) => {
  try {
    const competency = await Competency.findByIdAndDelete(req.params.id);

    if (!competency) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy năng lực'
      });
    }

    res.json({
      success: true,
      message: 'Xóa năng lực thành công'
    });
  } catch (error) {
    console.error('Delete competency error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa năng lực',
      error: error.message
    });
  }
};

// @desc    Get competency categories
// @route   GET /api/competencies/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const categories = await Competency.distinct('category');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh mục',
      error: error.message
    });
  }
};
