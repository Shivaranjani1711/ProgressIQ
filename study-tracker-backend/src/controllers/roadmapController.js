const Roadmap = require('../models/Roadmap');
const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/roadmaps
// @access Public
const getRoadmaps = asyncHandler(async (req, res) => {
  const { goal } = req.query;
  const filter = goal ? { goal } : {};
  // topics excluded here to keep the list view light - full topic list comes from getRoadmapById
  const roadmaps = await Roadmap.find(filter).select('title description goal topics').lean();
  const withCounts = roadmaps.map((r) => ({ ...r, topicCount: r.topics.length, topics: undefined }));
  res.json(withCounts);
});

// @route  GET /api/roadmaps/:id
// @access Public
const getRoadmapById = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id).populate('topics');
  if (!roadmap) {
    res.status(404);
    throw new Error('Roadmap not found');
  }
  res.json(roadmap);
});

module.exports = { getRoadmaps, getRoadmapById };
