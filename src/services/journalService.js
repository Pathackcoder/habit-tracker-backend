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


