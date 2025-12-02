const Assessment = require('../models/Assessment');
const Employee = require('../models/Employee');

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private
exports.getAssessments = async (req, res) => {
  try {
    const { employee, evaluator, status, startDate, endDate } = req.query;
    
    let query = {};
    
    if (employee) {
      query.employee = employee;
    }
    
    if (evaluator) {
      query.evaluator = evaluator;
    }
    
    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.assessmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const assessments = await Assessment.find(query)
      .populate('employee', 'name employeeId position')
      .populate('evaluator', 'fullName')
      .populate('competencyRatings.competency')
      .sort({ assessmentDate: -1 });

    res.json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách đánh giá',
      error: error.message
    });
  }
};

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('employee')
      .populate('evaluator', 'fullName email')
      .populate('competencyRatings.competency');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin đánh giá',
      error: error.message
    });
  }
};

// @desc    Create assessment
// @route   POST /api/assessments
// @access  Private (Admin, Manager)
exports.createAssessment = async (req, res) => {
  try {
    // Add evaluator from authenticated user
    req.body.evaluator = req.user._id;

    // Map level names to numbers if needed
    if (req.body.competencyRatings) {
      req.body.competencyRatings = req.body.competencyRatings.map(rating => {
        const levelMap = {
          'Critical': 1,
          'Low': 2,
          'Medium': 3,
          'High': 4
        };
        return {
          ...rating,
          levelNumber: levelMap[rating.ratedLevel] || 1
        };
      });
    }

    const assessment = await Assessment.create(req.body);

    // Update employee's last assessment date and current level
    await Employee.findByIdAndUpdate(req.body.employee, {
      lastAssessmentDate: assessment.assessmentDate,
      currentLevel: Math.round(assessment.overallScore)
    });

    const populatedAssessment = await Assessment.findById(assessment._id)
      .populate('employee')
      .populate('evaluator', 'fullName')
      .populate('competencyRatings.competency');

    res.status(201).json({
      success: true,
      data: populatedAssessment
    });
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo đánh giá',
      error: error.message
    });
  }
};

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private (Admin, Manager, Owner)
exports.updateAssessment = async (req, res) => {
  try {
    let assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    // Check if user is the evaluator or admin
    if (assessment.evaluator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật đánh giá này'
      });
    }

    // Map level names to numbers if needed
    if (req.body.competencyRatings) {
      req.body.competencyRatings = req.body.competencyRatings.map(rating => {
        const levelMap = {
          'Critical': 1,
          'Low': 2,
          'Medium': 3,
          'High': 4
        };
        return {
          ...rating,
          levelNumber: levelMap[rating.ratedLevel] || rating.levelNumber || 1
        };
      });
    }

    assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('employee')
      .populate('evaluator', 'fullName')
      .populate('competencyRatings.competency');

    // Update employee's current level
    await Employee.findByIdAndUpdate(assessment.employee._id, {
      currentLevel: Math.round(assessment.overallScore)
    });

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Update assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật đánh giá',
      error: error.message
    });
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Admin only)
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    await assessment.deleteOne();

    res.json({
      success: true,
      message: 'Xóa đánh giá thành công'
    });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa đánh giá',
      error: error.message
    });
  }
};

// @desc    Get assessment reports
// @route   GET /api/assessments/reports/overview
// @access  Private
exports.getAssessmentReports = async (req, res) => {
  try {
    const { store, startDate, endDate } = req.query;

    let matchQuery = {};

    if (store) {
      const employees = await Employee.find({ store });
      matchQuery.employee = { $in: employees.map(e => e._id) };
    }

    if (startDate && endDate) {
      matchQuery.assessmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Classification distribution
    const classificationStats = await Assessment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$classification',
          count: { $sum: 1 },
          avgScore: { $avg: '$overallScore' }
        }
      }
    ]);

    // Competency statistics
    const competencyStats = await Assessment.aggregate([
      { $match: matchQuery },
      { $unwind: '$competencyRatings' },
      {
        $group: {
          _id: '$competencyRatings.competency',
          avgLevel: { $avg: '$competencyRatings.levelNumber' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'competencies',
          localField: '_id',
          foreignField: '_id',
          as: 'competency'
        }
      },
      { $unwind: '$competency' },
      {
        $project: {
          competencyName: '$competency.nameVi',
          avgLevel: 1,
          count: 1
        }
      },
      { $sort: { avgLevel: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        classificationStats,
        competencyStats
      }
    });
  } catch (error) {
    console.error('Get assessment reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy báo cáo',
      error: error.message
    });
  }
};
