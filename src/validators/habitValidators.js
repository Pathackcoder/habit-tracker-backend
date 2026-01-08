const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

exports.validateHabit = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Habit title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('type')
    .optional()
    .isIn(['daily', 'weekly', 'custom'])
    .withMessage('Type must be daily, weekly, or custom'),
  body('status')
    .optional()
    .isIn(['active', 'paused', 'archived'])
    .withMessage('Status must be active, paused, or archived'),
  validate,
];

exports.validateHabitEntry = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
  body('count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Count must be a non-negative integer'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  validate,
];


