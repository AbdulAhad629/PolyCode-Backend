const { generateAssistantReply: generateGroqReply } = require("../chat/services/groqService");
const { generateAssistantReply: generateCustomReply } = require("./customModelService");
const { generateAssistantReply: generatePolyMentorReply } = require("./polymentorService");
const {
  isPineconeConfigured,
  querySimilar,
  buildRagContext,
} = require("./pineconeService");

function getAssistantProvider() {
  return (process.env.ASSISTANT_PROVIDER || "polymentor").trim().toLowerCase();
}

async function maybeAugmentWithRag(messages) {
  if (process.env.PINECONE_RAG_ENABLED !== "true") {
    return messages;
  }
  if (!isPineconeConfigured()) {
    return messages;
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.content) return messages;

  try {
    const matches = await querySimilar(lastUser.content, { topK: 3 });
    const ragContext = buildRagContext(matches);
    if (!ragContext) return messages;

    const systemIndex = messages.findIndex((m) => m.role === "system");
    if (systemIndex === -1) {
      return [{ role: "system", content: ragContext }, ...messages];
    }

    const updated = [...messages];
    updated[systemIndex] = {
      role: "system",
      content: `${updated[systemIndex].content}\n\n${ragContext}`,
    };
    return updated;
  } catch (error) {
    console.warn("Pinecone RAG skipped:", error.message);
    return messages;
  }
}

/**
 * Single entry point for PolyMentor inference.
 * ASSISTANT_PROVIDER=polymentor | groq | custom
 */
async function generateAssistantReply(messages, options = {}) {
  const augmented = await maybeAugmentWithRag(messages);
  const provider = getAssistantProvider();

  if (provider === "custom") {
    return generateCustomReply(augmented);
  }

  if (provider === "groq") {
    return generateGroqReply(augmented);
  }

  return generatePolyMentorReply(augmented, options);
}

module.exports = {
  getAssistantProvider,
  generateAssistantReply,
  maybeAugmentWithRag,
};
