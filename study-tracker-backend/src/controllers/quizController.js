const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const asyncHandler = require('../utils/asyncHandler');
const updateStreak = require('../utils/updateStreak');

// @route  GET /api/quizzes/topic/:topicId
// @access Public
// Returns the quiz for a topic with questions but WITHOUT correctIndex/explanation,
// so the answer isn't visible before the user submits.
const getQuizByTopic = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ topic: req.params.topicId });

  if (!quiz) {
    // Not every topic has a quiz yet - this is a normal, expected state
    return res.status(404).json({ message: 'No quiz available for this topic yet' });
  }

  const questions = await Question.find({ quiz: quiz._id }).select('questionText options');

  res.json({
    _id: quiz._id,
    title: quiz.title,
    topic: quiz.topic,
    questions,
  });
});

// @route  POST /api/quizzes/:id/submit
// @access Private
// body: { answers: [{ questionId, selectedIndex }] }
const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    res.status(400);
    throw new Error('answers must be a non-empty array');
  }

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  const questions = await Question.find({ quiz: quiz._id });
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  let score = 0;
  const results = [];
  const answerRecords = [];

  for (const { questionId, selectedIndex } of answers) {
    const question = questionMap.get(questionId);
    if (!question) continue;

    const correct = question.correctIndex === selectedIndex;
    if (correct) score++;

    results.push({
      questionId,
      correct,
      selectedIndex,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    });

    answerRecords.push({ question: question._id, selectedIndex, correct });
  }

  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers: answerRecords,
    score,
    total: questions.length,
  });

  const streak = await updateStreak(req.user);

  res.json({
    attemptId: attempt._id,
    score,
    total: questions.length,
    results,
    streak,
  });
});

module.exports = { getQuizByTopic, submitQuiz };
