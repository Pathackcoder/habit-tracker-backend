const analyticsService = require('../services/analyticsService');
const { sendSuccess, sendError } = require('../utils/response');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const stats = await analyticsService.getDashboardStats(userId, { startDate, endDate });
    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getHabitStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const stats = await analyticsService.getHabitStats(userId, id, { startDate, endDate });
    sendSuccess(res, stats, 'Habit stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getStreakData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const streak = await analyticsService.getStreakData(userId, id);
    sendSuccess(res, streak, 'Streak data retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query;
    const report = await analyticsService.getMonthlyReport(userId, year, month);
    sendSuccess(res, report, 'Monthly report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyGraphData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query;
    const graphData = await analyticsService.getMonthlyGraphData(userId, year, month);
    sendSuccess(res, graphData, 'Monthly graph data retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// exports.getBestStreak = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;

//     const streak = await analyticsService.getBestStreak(userId, id);

//     sendSuccess(res, streak, 'Best streak calculated successfully');
//   } catch (error) {
//     next(error);
//   }
// };

exports.getBestDay = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await analyticsService.getBestDay(userId);

    sendSuccess(res, data, 'Best day calculated successfully');
  } catch (err) {
    next(err);
  }
};

// controllers/analyticsController.js
exports.getActiveDays = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await analyticsService.getActiveDays(userId);

    sendSuccess(res, data, 'Active days calculated successfully');
  } catch (err) {
    next(err);
  }
};

