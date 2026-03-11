import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export type Message = {
  role: "user" | "model";
  text: string;
};

export async function chatWithGemini(messages: Message[], modelName: string = "gemini-3-flash-preview") {
  if (!ai) {
    throw new Error("Gemini API key is not configured.");
  }

  const chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: "You are EL, a highly advanced proprietary operating system created by Python. Your creator is Robel Demiss. You are intelligent, efficient, and specialized in technical tasks, including engineering and suit design. Provide clear, concise, and accurate information. Use markdown for formatting where appropriate.",
    },
  });

  // Send the last message
  const lastMessage = messages[messages.length - 1];
  
  // Note: For a real chat history, we'd pass the history to ai.chats.create
  // but for simplicity in this first turn, we'll just send the message.
  // Actually, let's do it right.
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  const response = await chat.sendMessage({
    message: lastMessage.text,
  });

  return response.text;
}

export async function* streamChatWithGemini(messages: Message[], modelName: string = "gemini-3-flash-preview") {
  if (!ai) {
    throw new Error("Gemini API key is not configured.");
  }

  const chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: "You are EL, a highly advanced proprietary operating system created by Python. Your creator is Robel Demiss. You are intelligent, efficient, and specialized in technical tasks, including engineering and suit design. Provide clear, concise, and accurate information. Use markdown for formatting where appropriate.",
    },
  });

  const lastMessage = messages[messages.length - 1];
  
  const streamResponse = await chat.sendMessageStream({
    message: lastMessage.text,
  });

  for await (const chunk of streamResponse) {
    const c = chunk as GenerateContentResponse;
    yield c.text;
  }
}
