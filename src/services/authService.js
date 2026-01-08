const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { HTTP_STATUS } = require('../config/constants');

exports.signup = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = HTTP_STATUS.CONFLICT;
    throw error;
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

exports.login = async (email, password) => {
  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return user;
};


