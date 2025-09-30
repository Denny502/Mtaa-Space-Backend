const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  getMyProperties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getProperty);

// Protected routes
router.use(protect);

router.get('/agent/my-properties', authorize('agent'), getMyProperties);
router.post('/', authorize('agent'), createProperty);
router.put('/:id', authorize('agent'), updateProperty);
router.delete('/:id', authorize('agent'), deleteProperty);

module.exports = router;