const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    bookmarked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A user should only have one progress record per topic
progressSchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
