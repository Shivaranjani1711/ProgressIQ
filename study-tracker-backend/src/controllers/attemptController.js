const Attempt = require('../models/Attempt');
const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/attempts
// @access Private
const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ user: req.user._id })
    .populate({ path: 'quiz', select: 'title topic', populate: { path: 'topic', select: 'title category' } })
    .sort({ createdAt: -1 });

  res.json(attempts);
});

module.exports = { getMyAttempts };
