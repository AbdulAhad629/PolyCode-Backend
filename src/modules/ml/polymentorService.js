const DEFAULT_POLYMENTOR_API_URL = "https://poly-mentor-bm2s.vercel.app";
const MAX_POLYMENTOR_MESSAGE_CHARS = 8000;

function getPolyMentorConfig() {
  const baseUrl = (
    process.env.POLYMENTOR_API_URL ||
    process.env.POLYMENTOR_BASE_URL ||
    DEFAULT_POLYMENTOR_API_URL
  )
    .trim()
    .replace(/\/+$/, "");

  return {
    chatUrl: `${baseUrl}/chat`,
    level: (process.env.POLYMENTOR_LEVEL || "beginner").trim().toLowerCase(),
  };
}

function normalizeLevel(level) {
  return ["beginner", "intermediate", "advanced"].includes(level)
    ? level
    : "beginner";
}

function compactMessagesForPolyMentor(messages = []) {
  const systemText = messages
    .filter((message) => message.role === "system" && message.content)
    .map((message) => message.content.trim())
    .join("\n\n");

  const conversation = messages
    .filter((message) => message.role !== "system" && message.content)
    .slice(-8);
  const latestUser = [...conversation].reverse().find((message) => message.role === "user");

  if (!latestUser?.content) {
    return "";
  }

  const priorConversation = conversation
    .slice(0, -1)
    .map((message) => {
      const label = message.role === "assistant" ? "Assistant" : "User";
      return `${label}: ${message.content.trim()}`;
    })
    .join("\n");

  const promptParts = [
    systemText ? `PolyCode context:\n${systemText}` : "",
    priorConversation ? `Recent conversation:\n${priorConversation}` : "",
    `Current question:\n${latestUser.content.trim()}`,
  ].filter(Boolean);

  return promptParts.join("\n\n").slice(0, MAX_POLYMENTOR_MESSAGE_CHARS);
}

async function generateAssistantReply(messages, options = {}) {
  const { chatUrl, level: defaultLevel } = getPolyMentorConfig();
  const message = compactMessagesForPolyMentor(messages);
  const level = normalizeLevel(options.level || defaultLevel);

  if (!message) {
    const error = new Error("Message is required.");
    error.statusCode = 400;
    throw error;
  }

  const response = await fetch(chatUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      level,
    }),
  });

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { answer: text };
    }
  }

  if (!response.ok) {
    const error = new Error(
      data.error || data.detail || data.message || "PolyMentor service failed.",
    );
    error.statusCode = response.status;
    error.code = "POLYMENTOR_API_ERROR";
    throw error;
  }

  const answer = data.answer || data.response || data.message;
  if (!answer) {
    const error = new Error("PolyMentor returned an empty response.");
    error.statusCode = 502;
    error.code = "POLYMENTOR_EMPTY_RESPONSE";
    throw error;
  }

  return String(answer);
}

module.exports = {
  generateAssistantReply,
  getPolyMentorConfig,
};
