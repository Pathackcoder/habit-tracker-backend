const { User } = require('../models');
const { HTTP_STATUS } = require('../config/constants');

exports.getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return user;
};

exports.updateProfile = async (userId, updateData) => {
  const allowedUpdates = ['name', 'avatar', 'timezone', 'settings'];
  const updates = Object.keys(updateData);
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    const error = new Error('Invalid updates');
    error.statusCode = HTTP_STATUS.BAD_REQUEST;
    throw error;
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  return user;
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  user.password = newPassword;
  await user.save();
};

exports.deleteAccount = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  // TODO: Delete associated habits, entries, and journals
  return user;
};


