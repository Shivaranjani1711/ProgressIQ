const Progress = require('../models/Progress');
const Topic = require('../models/Topic');
const Roadmap = require('../models/Roadmap');
const asyncHandler = require('../utils/asyncHandler');
const updateStreak = require('../utils/updateStreak');

// @route  GET /api/progress?bookmarked=true
// @access Private - all of the current user's progress records
const getMyProgress = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.bookmarked === 'true') filter.bookmarked = true;

  const progress = await Progress.find(filter).populate('topic', 'title category difficulty');
  res.json(progress);
});

// @route  POST /api/progress/:topicId
// @access Private - create or update the status for one topic
const updateProgress = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['not_started', 'in_progress', 'completed'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`status must be one of: ${validStatuses.join(', ')}`);
  }

  const update = { status };
  if (status === 'in_progress') update.startedAt = new Date();
  if (status === 'completed') update.completedAt = new Date();

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, topic: req.params.topicId },
    update,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const streak = await updateStreak(req.user);

  res.json({ ...progress.toObject(), streak });
});

// @route  PATCH /api/progress/:topicId/bookmark
// @access Private
const toggleBookmark = asyncHandler(async (req, res) => {
  const { bookmarked } = req.body;

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, topic: req.params.topicId },
    { bookmarked: !!bookmarked },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json(progress);
});

// @route  GET /api/progress/summary
// @access Private - aggregated stats for the analytics dashboard
const getProgressSummary = asyncHandler(async (req, res) => {
  const [progressRecords, topicsByCategory, roadmaps] = await Promise.all([
    Progress.find({ user: req.user._id }).populate('topic', 'category'),
    Topic.aggregate([{ $group: { _id: '$category', total: { $sum: 1 } } }]),
    Roadmap.find().select('title goal topics'),
  ]);

  const completedTopicIds = new Set(
    progressRecords.filter((p) => p.status === 'completed' && p.topic).map((p) => p.topic._id.toString())
  );
  const inProgressCount = progressRecords.filter((p) => p.status === 'in_progress').length;

  // Category breakdown: how many completed vs how many exist in that category
  const completedByCategory = {};
  progressRecords.forEach((p) => {
    if (p.status === 'completed' && p.topic) {
      completedByCategory[p.topic.category] = (completedByCategory[p.topic.category] || 0) + 1;
    }
  });
  const categoryBreakdown = topicsByCategory.map((c) => ({
    category: c._id,
    total: c.total,
    completed: completedByCategory[c._id] || 0,
  }));

  // Roadmap breakdown: % of each roadmap's topics the user has completed
  const roadmapBreakdown = roadmaps.map((r) => {
    const total = r.topics.length;
    const completed = r.topics.filter((t) => completedTopicIds.has(t.toString())).length;
    return {
      roadmapId: r._id,
      title: r.title,
      goal: r.goal,
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const totalTopics = topicsByCategory.reduce((sum, c) => sum + c.total, 0);

  res.json({
    totalTopics,
    completedTopics: completedTopicIds.size,
    inProgressTopics: inProgressCount,
    categoryBreakdown,
    roadmapBreakdown,
    streak: {
      current: req.user.currentStreak,
      longest: req.user.longestStreak,
    },
  });
});

module.exports = { getMyProgress, updateProgress, toggleBookmark, getProgressSummary };
