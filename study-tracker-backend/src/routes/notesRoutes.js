const express = require('express');
const { getMyNotes, getNoteByTopic, upsertNote, deleteNote } = require('../controllers/notesController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getMyNotes);
router.get('/topic/:topicId', protect, getNoteByTopic);
router.post('/:topicId', protect, upsertNote);
router.delete('/:topicId', protect, deleteNote);

module.exports = router;
