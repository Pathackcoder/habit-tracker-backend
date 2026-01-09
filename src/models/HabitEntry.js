const mongoose = require('mongoose');

const habitEntrySchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
habitEntrySchema.index({ habit: 1, date: 1 }, { unique: true });
habitEntrySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('HabitEntry', habitEntrySchema);


