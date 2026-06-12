const mongoose = require("mongoose");

/**
 * Stores like/dislike feedback on assistant replies for future model improvement.
 */
const assistantFeedbackSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    messageId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },
    rating: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
    userMessage: {
      type: String,
      required: true,
      maxlength: 8000,
    },
    assistantMessage: {
      type: String,
      required: true,
      maxlength: 8000,
    },
    context: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

assistantFeedbackSchema.index({ sessionId: 1, messageId: 1 }, { unique: true });
assistantFeedbackSchema.index({ rating: 1, createdAt: -1 });

module.exports = mongoose.model("AssistantFeedback", assistantFeedbackSchema);
