const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Not authorized to access this route', HTTP_STATUS.UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return sendError(res, 'User not found', HTTP_STATUS.NOT_FOUND);
      }

      next();
    } catch (error) {
      return sendError(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
    }
  } catch (error) {
    next(error);
  }
};


