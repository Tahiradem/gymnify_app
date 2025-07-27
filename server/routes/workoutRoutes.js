const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// Save workout time route
router.post('/save-workout-time', workoutController.saveWorkoutTime);

module.exports = router;