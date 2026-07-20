const express = require('express');
const { getQuizByTopic, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/topic/:topicId', getQuizByTopic);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
