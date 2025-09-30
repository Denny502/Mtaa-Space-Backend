const express = require('express');
const {
  createInquiry,
  getAgentInquiries,
  getUserInquiries
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createInquiry);
router.get('/user', getUserInquiries);
router.get('/agent', authorize('agent'), getAgentInquiries);

module.exports = router;