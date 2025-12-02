const express = require('express');
const router = express.Router();
const {
  getCompetencies,
  getCompetency,
  createCompetency,
  updateCompetency,
  deleteCompetency,
  getCategories
} = require('../controllers/competencyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.route('/')
  .get(getCompetencies)
  .post(authorize('admin'), createCompetency);

router.get('/categories', getCategories);

router.route('/:id')
  .get(getCompetency)
  .put(authorize('admin'), updateCompetency)
  .delete(authorize('admin'), deleteCompetency);

module.exports = router;
