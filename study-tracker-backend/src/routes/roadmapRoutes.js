const express = require('express');
const { getRoadmaps, getRoadmapById } = require('../controllers/roadmapController');

const router = express.Router();

router.get('/', getRoadmaps);
router.get('/:id', getRoadmapById);

module.exports = router;
