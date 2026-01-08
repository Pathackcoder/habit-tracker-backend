const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signup(name, email, password);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // In case of token blacklisting or session management
    sendSuccess(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

