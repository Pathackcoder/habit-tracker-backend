const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

exports.validateJournal = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Journal content is required'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('mood')
    .optional()
    .isIn(['excited', 'happy', 'neutral', 'sad', 'anxious', 'angry'])
    .withMessage('Mood must be one of: excited, happy, neutral, sad, anxious, angry'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  validate,
];


