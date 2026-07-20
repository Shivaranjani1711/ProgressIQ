const Note = require('../models/Note');
const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/notes
// @access Private - all of the current user's notes (for a "My Notes" page)
const getMyNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id })
    .populate('topic', 'title category')
    .sort({ updatedAt: -1 });
  res.json(notes);
});

// @route  GET /api/notes/topic/:topicId
// @access Private
const getNoteByTopic = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ user: req.user._id, topic: req.params.topicId });
  res.json(note || null);
});

// @route  POST /api/notes/:topicId
// @access Private - creates or overwrites the note for this topic
const upsertNote = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Note content cannot be empty');
  }

  const note = await Note.findOneAndUpdate(
    { user: req.user._id, topic: req.params.topicId },
    { content: content.trim() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json(note);
});

// @route  DELETE /api/notes/:topicId
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  await Note.findOneAndDelete({ user: req.user._id, topic: req.params.topicId });
  res.json({ message: 'Note deleted' });
});

module.exports = { getMyNotes, getNoteByTopic, upsertNote, deleteNote };
