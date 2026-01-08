const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Journal content is required'],
    },
    mood: {
      type: String,
      enum: ['excited', 'happy', 'neutral', 'sad', 'anxious', 'angry'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
journalSchema.index({ user: 1, date: -1 });
journalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Journal', journalSchema);


