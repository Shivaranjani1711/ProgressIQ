const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    content: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true }
);

// One note per user per topic - saving again overwrites it
noteSchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
