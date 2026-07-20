const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    title: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
