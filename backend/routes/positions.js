const express = require('express');
const router = express.Router();
const {
  getPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition
} = require('../controllers/positionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.route('/')
  .get(getPositions)
  .post(authorize('admin'), createPosition);

router.route('/:id')
  .get(getPosition)
  .put(authorize('admin'), updatePosition)
  .delete(authorize('admin'), deletePosition);

module.exports = router;
