const { User } = require('../models');
const { HTTP_STATUS } = require('../config/constants');

exports.getSettings = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return user.settings;
};

exports.updateSettings = async (userId, settingsData) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Merge settings
  user.settings = {
    ...user.settings,
    ...settingsData,
  };

  // Handle nested settings
  if (settingsData.notifications) {
    user.settings.notifications = {
      ...user.settings.notifications,
      ...settingsData.notifications,
    };
  }

  await user.save();
  return user.settings;
};


