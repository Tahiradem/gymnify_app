const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.loginUser);
router.post('/update', authController.updateUserData);

module.exports = router;