const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get user report data
router.get('/:userId', reportController.getUserReportData);

module.exports = router;