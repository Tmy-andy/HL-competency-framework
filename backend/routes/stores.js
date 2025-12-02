const express = require('express');
const router = express.Router();
const {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
  getStoreStats
} = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.route('/')
  .get(getStores)
  .post(authorize('admin'), createStore);

router.get('/:id/stats', getStoreStats);

router.route('/:id')
  .get(getStore)
  .put(authorize('admin'), updateStore)
  .delete(authorize('admin'), deleteStore);

module.exports = router;
