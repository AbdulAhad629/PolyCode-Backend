const mongoose = require("mongoose");

const playgroundWorkspaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    language: { type: String, required: true, trim: true, maxlength: 32 },
    /** Explorer folder paths, e.g. ["src", "lib/utils"] */
    folders: { type: [String], default: [] },
    activeFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaygroundFile",
      default: null,
    },
    selectedFolder: { type: String, default: "" },
    expandedFolders: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ "": true }),
    },
    /** Legacy — optional Google Drive folder id */
    driveFolderId: { type: String, default: null },
  },
  { timestamps: true },
);

playgroundWorkspaceSchema.index({ userId: 1, language: 1 }, { unique: true });

module.exports = mongoose.model("PlaygroundWorkspace", playgroundWorkspaceSchema);
