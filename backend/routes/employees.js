const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.get('/stats/overview', getEmployeeStats);

router.route('/')
  .get(getEmployees)
  .post(authorize('admin', 'manager'), createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(authorize('admin', 'manager'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

module.exports = router;
