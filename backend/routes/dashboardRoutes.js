const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { getInsights } = require('../controllers/insightsController');
const { getRecommendations } = require('../controllers/recommendationController');

router.get('/:userId', getDashboard);
router.get('/:userId/insights', getInsights);
router.get('/:userId/recommendations', getRecommendations);

module.exports = router;
