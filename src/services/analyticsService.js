const { Habit, HabitEntry } = require('../models');
const { HTTP_STATUS } = require('../config/constants');
const { getStartOfDay, getEndOfDay } = require('../utils/dateHelpers');

exports.getDashboardStats = async (userId, options = {}) => {
  const { startDate, endDate } = options;
  const today = new Date();
  const start = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth(), 1);
  const end = endDate ? new Date(endDate) : today;

  // Total habits
  const totalHabits = await Habit.countDocuments({ user: userId, status: 'active' });

  // Completed habits today
  const todayStart = getStartOfDay(today);
  const todayEnd = getEndOfDay(today);
  const todayEntries = await HabitEntry.countDocuments({
    user: userId,
    date: { $gte: todayStart, $lte: todayEnd },
    completed: true,
  });

  // Completion rate for the period
  const totalEntries = await HabitEntry.countDocuments({
    user: userId,
    date: { $gte: start, $lte: end },
  });
  const completedEntries = await HabitEntry.countDocuments({
    user: userId,
    date: { $gte: start, $lte: end },
    completed: true,
  });
  const completionRate = totalEntries > 0 ? (completedEntries / totalEntries) * 100 : 0;

  // Current streak
  // This is a simplified version - you might want to make it more sophisticated
  const streak = await this.calculateCurrentStreak(userId);

  return {
    totalHabits,
    todayCompleted: todayEntries,
    completionRate: Math.round(completionRate * 100) / 100,
    currentStreak: streak,
    period: {
      start,
      end,
    },
  };
};

exports.getHabitStats = async (userId, habitId) => {
  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) {
    const error = new Error('Habit not found');
    error.statusCode = 404;
    throw error;
  }

  // 🔹 current month logic
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 🔹 total possible days (frequency based)
  let totalPossibleDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const weekday = date.getDay(); // 0–6

    if (habit.frequency?.days?.includes(weekday)) {
      totalPossibleDays++;
    }
  }

  // 🔹 completed days in current month
  const completedEntries = await HabitEntry.countDocuments({
    habit: habitId,
    user: userId,
    completed: true,
    date: {
      $gte: new Date(year, month, 1),
      $lte: new Date(year, month, daysInMonth, 23, 59, 59),
    },
  });

  const completionRate =
    totalPossibleDays > 0
      ? (completedEntries / totalPossibleDays) * 100
      : 0;

  return {
    habitId,
    totalPossibleDays,
    completedEntries,
    completionRate: Math.round(completionRate * 100) / 100,
    period: {
      month: month + 1,
      year,
    },
  };
};


exports.getStreakData = async (userId, habitId) => {
  // Verify habit belongs to user
  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) {
    const error = new Error('Habit not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  const currentStreak = await this.calculateStreak(userId, habitId);
  const longestStreak = await this.calculateLongestStreak(userId, habitId);

  return {
    habitId,
    currentStreak,
    longestStreak,
  };
};

exports.getMonthlyReport = async (userId, year, month) => {
  const reportYear = year ? parseInt(year) : new Date().getFullYear();
  const reportMonth = month ? parseInt(month) : new Date().getMonth() + 1;

  const startDate = new Date(reportYear, reportMonth - 1, 1);
  const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);

  const habits = await Habit.find({ user: userId, status: 'active' });
  const entries = await HabitEntry.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  });

  const habitStats = habits.map((habit) => {
    const habitEntries = entries.filter((e) => e.habit.toString() === habit._id.toString());
    const completed = habitEntries.filter((e) => e.completed).length;
    return {
      habitId: habit._id,
      habitTitle: habit.title,
      totalDays: habitEntries.length,
      completedDays: completed,
      completionRate: habitEntries.length > 0 ? (completed / habitEntries.length) * 100 : 0,
    };
  });

  return {
    year: reportYear,
    month: reportMonth,
    totalHabits: habits.length,
    habitStats,
  };
};

exports.getMonthlyGraphData = async (userId, year, month) => {
  const reportYear = year ? parseInt(year) : new Date().getFullYear();
  const reportMonth = month ? parseInt(month) : new Date().getMonth() + 1;

  const startDate = new Date(reportYear, reportMonth - 1, 1);
  const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);
  endDate.setHours(23, 59, 59, 999);

  // Get all habits and entries for the month
  const habits = await Habit.find({ user: userId, status: 'active' });
  const entries = await HabitEntry.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  });

  // Create a map of date -> completion stats
  const dailyData = {};
  const totalDaysInMonth = new Date(reportYear, reportMonth, 0).getDate();

  // Initialize all days in the month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const date = new Date(reportYear, reportMonth - 1, day);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    dailyData[dateKey] = {
      date: dateKey,
      day: day,
      totalHabits: habits.length,
      completedHabits: 0,
      completionRate: 0,
      completedEntries: [],
    };
  }

  // Populate with actual entry data
  entries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const dateKey = entryDate.toISOString().split('T')[0];

    if (dailyData[dateKey]) {
      if (entry.completed) {
        dailyData[dateKey].completedHabits++;
        dailyData[dateKey].completedEntries.push({
          habitId: entry.habit.toString(),
          completed: true,
        });
      }
    }
  });

  // Calculate completion rates and format data
  const graphData = Object.values(dailyData).map((day) => {
    const completionRate = day.totalHabits > 0 
      ? Math.round((day.completedHabits / day.totalHabits) * 100 * 100) / 100 
      : 0;
    
    return {
      date: day.date,
      day: day.day,
      totalHabits: day.totalHabits,
      completedHabits: day.completedHabits,
      completionRate: completionRate,
    };
  });

  // Calculate overall stats
  const totalCompletions = entries.filter((e) => e.completed).length;
  const totalPossible = habits.length * totalDaysInMonth;
  const overallCompletionRate = totalPossible > 0 
    ? Math.round((totalCompletions / totalPossible) * 100 * 100) / 100 
    : 0;

  return {
    year: reportYear,
    month: reportMonth,
    monthName: new Date(reportYear, reportMonth - 1).toLocaleString('default', { month: 'long' }),
    totalHabits: habits.length,
    totalDays: totalDaysInMonth,
    overallCompletionRate: overallCompletionRate,
    dailyData: graphData,
  };
};

// Helper methods
exports.calculateCurrentStreak = async (userId) => {
  // Simplified streak calculation
  // You can enhance this with more sophisticated logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const entries = await HabitEntry.find({
      user: userId,
      date: currentDate,
      completed: true,
    });

    if (entries.length === 0) {
      break;
    }

    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

exports.calculateStreak = async (userId, habitId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const entry = await HabitEntry.findOne({
      habit: habitId,
      user: userId,
      date: currentDate,
      completed: true,
    });

    if (!entry) {
      break;
    }

    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

exports.calculateLongestStreak = async (userId, habitId) => {
  const entries = await HabitEntry.find({
    habit: habitId,
    user: userId,
    completed: true,
  }).sort({ date: 1 });

  if (entries.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < entries.length; i++) {
    const prevDate = new Date(entries[i - 1].date);
    const currDate = new Date(entries[i].date);
    const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
};


// services/analyticsService.js
// exports.getBestStreak = async (userId, habitId) => {
//   const habit = await Habit.findOne({ _id: habitId, user: userId });
//   if (!habit) {
//     const err = new Error('Habit not found');
//     err.statusCode = 404;
//     throw err;
//   }

//   // 🔹 current month
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth(); // 0-based

//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   // 🔹 fetch completed entries for this month
//   const entries = await HabitEntry.find({
//     habit: habitId,
//     user: userId,
//     completed: true,
//     date: {
//       $gte: new Date(year, month, 1),
//       $lte: new Date(year, month, daysInMonth, 23, 59, 59),
//     },
//   }).lean();

//   // 🔹 convert completed dates to SET for O(1) lookup
//   const completedSet = new Set(
//     entries.map(e => new Date(e.date).toDateString())
//   );

//   let bestStreak = 0;
//   let currentStreak = 0;

//   for (let d = 1; d <= daysInMonth; d++) {
//     const date = new Date(year, month, d);
//     const weekday = date.getDay();

//     const isAllowed = habit.frequency?.days?.includes(weekday);

//     if (!isAllowed) {
//       // skip non-frequency days
//       continue;
//     }

//     const key = date.toDateString();

//     if (completedSet.has(key)) {
//       currentStreak++;
//       bestStreak = Math.max(bestStreak, currentStreak);
//     } else {
//       currentStreak = 0; // ❌ streak break
//     }
//   }

//   return {
//     habitId,
//     bestStreak,
//     month: month + 1,
//     year,
//   };
// };

// services/analyticsService.js
exports.getBestDay = async (userId) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 🔹 current month ke completed entries (ALL habits)
  const entries = await HabitEntry.find({
    user: userId,
    completed: true,
    date: {
      $gte: new Date(year, month, 1),
      $lte: new Date(year, month, daysInMonth, 23, 59, 59),
    },
  }).lean();

  // 🔹 count completed habits per day
  const dayMap = {};
  /*
    {
      'Mon Jan 15 2026': 4,
      'Tue Jan 16 2026': 2
    }
  */

  for (const entry of entries) {
    const dayKey = new Date(entry.date).toDateString();
    dayMap[dayKey] = (dayMap[dayKey] || 0) + 1;
  }

  let bestDay = null;
  let maxCompleted = 0;

  for (const day in dayMap) {
    if (dayMap[day] > maxCompleted) {
      maxCompleted = dayMap[day];
      bestDay = day;
    }
  }

  return {
    bestDay,              // e.g. "Wed Jan 15 2026"
    completedHabits: maxCompleted,
    month: month + 1,
    year,
  };
};



// services/analyticsService.js
exports.getActiveDays = async (userId) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 🔹 current month ke completed entries (ALL habits)
  const entries = await HabitEntry.find({
    user: userId,
    completed: true,
    date: {
      $gte: new Date(year, month, 1),
      $lte: new Date(year, month, daysInMonth, 23, 59, 59),
    },
  }).lean();

  // 🔹 unique active days
  const activeDaysSet = new Set();

  for (const entry of entries) {
    const dayKey = new Date(entry.date).toDateString();
    activeDaysSet.add(dayKey);
  }

  return {
    activeDays: activeDaysSet.size,
    month: month + 1,
    year,
  };
};

