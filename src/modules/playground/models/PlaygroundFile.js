const mongoose = require("mongoose");

const playgroundFileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    language: { type: String, required: true, trim: true, maxlength: 32 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    content: { type: String, default: "", maxlength: 512000 },
    /** Legacy Google Drive pointer — optional for older records */
    driveFileId: { type: String, default: null },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

playgroundFileSchema.index({ userId: 1, language: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("PlaygroundFile", playgroundFileSchema);
