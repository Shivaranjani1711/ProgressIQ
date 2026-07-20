/**
 * seedTopics.js
 * Populates the database with the generated topic dataset and the
 * roadmaps that group them. Run with: npm run seed
 */
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Topic = require('../models/Topic');
const Roadmap = require('../models/Roadmap');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const topicsData = require(path.join(__dirname, 'topics.json'));
const roadmapsData = require(path.join(__dirname, 'roadmaps.json'));
const quizzesData = require(path.join(__dirname, 'quizzes.json'));

const seed = async () => {
  await connectDB();

  console.log('Clearing existing Topics, Roadmaps, Quizzes, and Questions...');
  await Topic.deleteMany({});
  await Roadmap.deleteMany({});
  await Quiz.deleteMany({});
  await Question.deleteMany({});

  console.log(`Inserting ${topicsData.length} topics...`);
  // Insert without prerequisites first so every topic has an _id to reference
  const titleToId = {};
  const groupToTitles = {}; // preserves insertion order per category group

  for (const t of topicsData) {
    const doc = await Topic.create({
      title: t.title,
      description: t.description,
      category: t.category,
      difficulty: t.difficulty,
      estimatedHours: t.estimatedHours,
      resources: t.resources,
    });
    titleToId[t.title] = doc._id;
    groupToTitles[t._group] = groupToTitles[t._group] || [];
    groupToTitles[t._group].push(t.title);
  }

  // Second pass: attach the prerequisite reference now that all IDs exist
  console.log('Linking prerequisites...');
  for (const t of topicsData) {
    if (t._prereqTitle) {
      await Topic.findByIdAndUpdate(titleToId[t.title], {
        prerequisites: [titleToId[t._prereqTitle]],
      });
    }
  }

  console.log(`Inserting ${roadmapsData.length} roadmaps...`);
  for (const r of roadmapsData) {
    const topicIds = r.topicGroups
      .flatMap((group) => groupToTitles[group] || [])
      .map((title) => titleToId[title])
      .filter(Boolean);

    await Roadmap.create({
      title: r.title,
      description: r.description,
      goal: r.goal,
      topics: topicIds,
    });
  }

  console.log(`Inserting ${quizzesData.length} quizzes (${quizzesData.reduce((n, q) => n + q.questions.length, 0)} questions)...`);
  for (const q of quizzesData) {
    const topicId = titleToId[q.topicTitle];
    if (!topicId) {
      console.warn(`  Skipping quiz "${q.quizTitle}" - topic "${q.topicTitle}" not found`);
      continue;
    }

    const quiz = await Quiz.create({ topic: topicId, title: q.quizTitle });

    await Question.insertMany(
      q.questions.map((question) => ({
        quiz: quiz._id,
        questionText: question.questionText,
        options: question.options,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
      }))
    );
  }

  console.log('Seed complete.');
  console.log(`  Topics:   ${topicsData.length}`);
  console.log(`  Roadmaps: ${roadmapsData.length}`);
  console.log(`  Quizzes:  ${quizzesData.length}`);
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
