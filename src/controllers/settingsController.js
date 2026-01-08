const settingsService = require('../services/settingsService');
const { sendSuccess, sendError } = require('../utils/response');

exports.getSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const settings = await settingsService.getSettings(userId);
    sendSuccess(res, settings, 'Settings retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const settingsData = req.body;
    const settings = await settingsService.updateSettings(userId, settingsData);
    sendSuccess(res, settings, 'Settings updated successfully');
  } catch (error) {
    next(error);
  }
};

