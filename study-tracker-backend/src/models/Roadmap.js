const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    goal: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'devops'],
      required: true,
    },
    // Ordered list of topics that make up this learning path
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
