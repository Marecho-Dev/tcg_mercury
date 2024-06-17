import OpenAI from "openai";
import dotenv from "dotenv";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define a type for message roles
type MessageRole = "system" | "user" | "assistant";

interface TextContent {
  type: "text";
  text: string;
}

interface ImageContent {
  type: "image_url";
  image_url: {
    url: string;
    detail?: string;
  };
}
interface ChatMessage {
  role: MessageRole;
  content: TextContent | ImageContent | (TextContent | ImageContent)[];
  name?: string;
}

export async function generateChatResponse(messages: ChatMessage[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map((message) => ({
        role: message.role,
        content: Array.isArray(message.content)
          ? message.content
              .map((content) => {
                if (content.type === "text") {
                  return content.text;
                } else if (content.type === "image_url") {
                  return content.image_url.url;
                }
              })
              .join("\n")
          : typeof message.content === "object" &&
              message.content.type === "text"
            ? message.content.text
            : typeof message.content === "object" &&
                message.content.type === "image_url"
              ? message.content.image_url.url
              : message.content,
        name: message.name ?? "defaultName",
      })),
      max_tokens: 300,
    });
    return completion.choices[0].message?.content;
  } catch (error) {
    console.error("Error in OpenAI service:", error);
    throw new Error("Failed to fetch response from OpenAI.");
  }
}
