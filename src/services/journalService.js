const { Journal } = require('../models');
const { HTTP_STATUS } = require('../config/constants');
const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../config/constants');

exports.createJournal = async (userId, journalData) => {
  const journal = await Journal.create({
    ...journalData,
    user: userId,
  });
  return journal;
};

exports.getJournals = async (userId, options = {}) => {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, startDate, endDate } = options;
  const query = { user: userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const journals = await Journal.find(query)
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Journal.countDocuments(query);

  return {
    journals,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

exports.getJournalById = async (userId, journalId) => {
  const journal = await Journal.findOne({ _id: journalId, user: userId });
  if (!journal) {
    const error = new Error('Journal entry not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return journal;
};

exports.updateJournal = async (userId, journalId, updateData) => {
  const journal = await Journal.findOneAndUpdate(
    { _id: journalId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!journal) {
    const error = new Error('Journal entry not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  return journal;
};

exports.deleteJournal = async (userId, journalId) => {
  const journal = await Journal.findOneAndDelete({ _id: journalId, user: userId });
  if (!journal) {
    const error = new Error('Journal entry not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return journal;
};


exports.getJournalStats = async (userId) => {
  const journals = await Journal.find({ user: userId }).sort({ date: 1 });

  const totalEntries = journals.length;

  // This month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonth = journals.filter(j => j.date >= monthStart).length;

  // Streak logic
  let currentStreak = 0;
  let bestStreak = 0;
  let prevDate = null;

  journals.forEach(j => {
    if (!prevDate) {
      currentStreak = 1;
    } else {
      const diff =
        (j.date - prevDate) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        currentStreak++;
      } else {
        bestStreak = Math.max(bestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    prevDate = j.date;
  });

  bestStreak = Math.max(bestStreak, currentStreak);

  return {
    totalEntries,
    currentStreak,
    bestStreak,
    thisMonth,
  };
};


exports.getJournalCalendar = async (userId, year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const journals = await Journal.find({
    user: userId,
    date: { $gte: start, $lte: end },
  }).select('date');

  return {
    filledDates: journals.map(j =>
      j.date.toISOString().split('T')[0]
    ),
  };
};

