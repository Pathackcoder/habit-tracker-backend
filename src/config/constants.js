module.exports = {
  // JWT Constants
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Habit Types
  HABIT_TYPES: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    CUSTOM: 'custom',
  },

  // Habit Status
  HABIT_STATUS: {
    ACTIVE: 'active',
    PAUSED: 'paused',
    ARCHIVED: 'archived',
  },
};


