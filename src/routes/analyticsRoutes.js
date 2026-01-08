const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, analyticsController.getDashboardStats);
router.get('/habits/:id/stats', protect, analyticsController.getHabitStats);
router.get('/habits/:id/streak', protect, analyticsController.getStreakData);
router.get('/monthly-report', protect, analyticsController.getMonthlyReport);
router.get('/monthly-graph', protect, analyticsController.getMonthlyGraphData);
// router.get('/habits/:id/best-streak',protect,analyticsController.getBestStreak);
router.get('/best-day',protect,analyticsController.getBestDay);
router.get('/active-days',protect,analyticsController.getActiveDays);

module.exports = router;


