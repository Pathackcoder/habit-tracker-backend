const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a habit title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily',
    },
    frequency: {
      days: [{
        type: Number,
        min: 0,
        max: 6,
      }], // 0 = Sunday, 1 = Monday, etc.
      customSchedule: {
        type: String,
      },
    },
    color: {
      type: String,
      default: '#3B82F6',
    },
    icon: {
      type: String,
      default: '⭐',
    },
    targetCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    unit: {
      type: String,
      default: 'times',
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'archived'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    reminder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      time: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
habitSchema.index({ user: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Habit', habitSchema);


