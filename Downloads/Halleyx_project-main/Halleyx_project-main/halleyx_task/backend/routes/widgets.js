const express = require('express');
const router = express.Router();
const { getInsights, getRecommendations, getChartData } = require('../controllers/widgetController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/insights', getInsights);
router.get('/recommendations', getRecommendations);
router.get('/chart-data', getChartData);
module.exports = router;
