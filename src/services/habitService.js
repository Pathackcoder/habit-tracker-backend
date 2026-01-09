const { Habit, HabitEntry } = require('../models');
const { HTTP_STATUS } = require('../config/constants');
const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../config/constants');

exports.createHabit = async (userId, habitData) => {
  const habit = await Habit.create({
    ...habitData,
    user: userId,
  });
  return habit;
};

exports.getHabits = async (userId, options = {}) => {
  const { status, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = options;
  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const habits = await Habit.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Habit.countDocuments(query);

  return {
    habits,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

exports.getHabitById = async (userId, habitId) => {
  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) {
    const error = new Error('Habit not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return habit;
};

exports.updateHabit = async (userId, habitId, updateData) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: habitId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!habit) {
    const error = new Error('Habit not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  return habit;
};

exports.deleteHabit = async (userId, habitId) => {
  const habit = await Habit.findOneAndDelete({ _id: habitId, user: userId });
  if (!habit) {
    const error = new Error('Habit not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  // Delete all associated entries
  await HabitEntry.deleteMany({ habit: habitId });
  return habit;
};

exports.toggleHabitEntry = async (userId, habitId, entryData) => {
  const { date, completed, count, notes } = entryData;

  // Verify habit belongs to user
  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) {
    const error = new Error('Habit not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  const entryDate = date;
  entryDate.setHours(0, 0, 0, 0);

let entry = await HabitEntry.findOne({
  habit: habitId,
  user: userId,
  date: entryDate,
});

  if (entry) {
    entry.completed = completed !== undefined ? completed : entry.completed;
    entry.count = count !== undefined ? count : entry.count;
    entry.notes = notes !== undefined ? notes : entry.notes;
    entry.completedAt = completed ? new Date() : null;
    await entry.save();
  } else {
      entry = await HabitEntry.create({
        habit: habitId,
        user: userId,
        date: entryDate,
        completed: completed ?? false,
        count: count ?? 0,
        notes: notes ?? '',
      });
  }

  return entry;
};

exports.getHabitEntries = async (userId, habitId, options = {}) => {
  const { startDate, endDate } = options;

  // Verify habit belongs to user
  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) {
    const error = new Error('Habit not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  const query = { habit: habitId, user: userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate.slice(0,10);
    if (endDate) query.date.$lte = endDate.slice(0,10);
  }


  const entries = await HabitEntry.find(query).sort({ date: -1 });
  return entries;
};


