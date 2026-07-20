const express = require('express');
const {
  getMyProgress,
  updateProgress,
  toggleBookmark,
  getProgressSummary,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// NOTE: /summary must be registered before /:topicId-style routes below it
// only if they shared a prefix - here they're distinct paths, but keeping
// summary first for readability since it's the most "special" route.
router.get('/summary', protect, getProgressSummary);
router.get('/', protect, getMyProgress);
router.post('/:topicId', protect, updateProgress);
router.patch('/:topicId/bookmark', protect, toggleBookmark);

module.exports = router;
