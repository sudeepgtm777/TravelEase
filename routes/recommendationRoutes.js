const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// API routes
router.get('/', recommendationController.getRecommendations);
router.get('/stats', recommendationController.getUserBookingStats);

module.exports = router;
