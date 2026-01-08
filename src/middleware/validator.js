const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      'Validation error',
      HTTP_STATUS.BAD_REQUEST,
      errors.array()
    );
  }
  next();
};


