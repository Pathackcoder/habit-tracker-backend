const journalService = require('../services/journalService');
const { sendSuccess, sendError } = require('../utils/response');

exports.createJournal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const journalData = req.body;
    const journal = await journalService.createJournal(userId, journalData);
    sendSuccess(res, journal, 'Journal entry created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getJournals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit, startDate, endDate } = req.query;
    const journals = await journalService.getJournals(userId, { page, limit, startDate, endDate });
    sendSuccess(res, journals, 'Journal entries retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getJournalById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const journal = await journalService.getJournalById(userId, id);
    sendSuccess(res, journal, 'Journal entry retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateJournal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;
    const journal = await journalService.updateJournal(userId, id, updateData);
    sendSuccess(res, journal, 'Journal entry updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteJournal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await journalService.deleteJournal(userId, id);
    sendSuccess(res, null, 'Journal entry deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getJournalStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await journalService.getJournalStats(userId);
    sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
};

exports.getJournalCalendar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query;
    const data = await journalService.getJournalCalendar(userId, year, month);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

