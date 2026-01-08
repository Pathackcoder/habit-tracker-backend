const habitService = require('../services/habitService');
const { sendSuccess, sendError } = require('../utils/response');

exports.createHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habitData = req.body;
    const habit = await habitService.createHabit(userId, habitData);
    sendSuccess(res, habit, 'Habit created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getHabits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page, limit } = req.query;
    const habits = await habitService.getHabits(userId, { status, page, limit });
    sendSuccess(res, habits, 'Habits retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getHabitById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const habit = await habitService.getHabitById(userId, id);
    sendSuccess(res, habit, 'Habit retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;
    const habit = await habitService.updateHabit(userId, id, updateData);
    sendSuccess(res, habit, 'Habit updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await habitService.deleteHabit(userId, id);
    sendSuccess(res, null, 'Habit deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.toggleHabitEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { date, completed, count, notes } = req.body;
    const entry = await habitService.toggleHabitEntry(userId, id, { date, completed, count, notes });
    sendSuccess(res, entry, 'Habit entry updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.getHabitEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const entries = await habitService.getHabitEntries(userId, id, { startDate, endDate });
    sendSuccess(res, entries, 'Habit entries retrieved successfully');
  } catch (error) {
    next(error);
  }
};

