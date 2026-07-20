const Topic = require('../models/Topic');
const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/topics
// @access Public
const getTopics = asyncHandler(async (req, res) => {
  const { category, difficulty } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;

  const topics = await Topic.find(filter).sort({ category: 1, title: 1 });
  res.json(topics);
});

// @route  GET /api/topics/:id
// @access Public
const getTopicById = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id).populate('prerequisites', 'title');
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }
  res.json(topic);
});

module.exports = { getTopics, getTopicById };
