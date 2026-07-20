const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    questionText: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2,
        message: 'A question needs at least 2 options',
      },
    },
    correctIndex: { type: Number, required: true },
    explanation: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
