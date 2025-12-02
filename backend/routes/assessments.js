const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentReports
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.get('/reports/overview', getAssessmentReports);

router.route('/')
  .get(getAssessments)
  .post(authorize('admin', 'manager'), createAssessment);

router.route('/:id')
  .get(getAssessment)
  .put(authorize('admin', 'manager'), updateAssessment)
  .delete(authorize('admin'), deleteAssessment);

module.exports = router;
