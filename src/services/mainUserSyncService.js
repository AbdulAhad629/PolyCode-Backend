const mongoose = require("mongoose");

const DEFAULT_MAIN_DB = "quantum_logics";

function getMainDatabaseName() {
  return String(process.env.MAIN_DB || DEFAULT_MAIN_DB).trim();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function syncPolycoderForEmail({ email, username }) {
  const mainDbName = getMainDatabaseName();
  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!mainDbName || !normalizedEmail || !normalizedUsername) {
    return { skipped: true };
  }

  if (mongoose.connection.readyState !== 1) {
    return { skipped: true, reason: "MongoDB is not connected" };
  }

  const mainDb = mongoose.connection.useDb(mainDbName, { useCache: true });
  const result = await mainDb.collection("users").updateOne(
    { email: normalizedEmail },
    {
      $set: {
        polycoder: normalizedUsername,
      },
      $currentDate: {
        updatedAt: true,
      },
    },
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
}

function syncPolycoderForEmailSafe(user) {
  return syncPolycoderForEmail(user).catch((error) => {
    console.warn("Main user polycoder sync failed:", error.message);
    return { skipped: true, error: error.message };
  });
}

module.exports = {
  syncPolycoderForEmail,
  syncPolycoderForEmailSafe,
};
