const express = require('express');
const { getMyAttempts } = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getMyAttempts);

module.exports = router;
