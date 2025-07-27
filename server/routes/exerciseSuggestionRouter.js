const express = require('express');
const router = express.Router();
const exerciseSuggestionController = require('../controllers/exerciseSuggestionController');

router.post('/:userId', exerciseSuggestionController.generateExerciseSuggestions);

module.exports = router;