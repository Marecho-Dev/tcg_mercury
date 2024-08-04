import OpenAI from "openai";

// Use the types from the OpenAI package
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateChatResponse(
  messages: ChatCompletionMessageParam[],
) {
  try {
    console.log(messages);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = completion.choices[0]?.message?.content;
    console.log(content);
    if (content === undefined) {
      throw new Error("No content returned from OpenAI");
    }
    return content;
  } catch (error) {
    console.error("Error in OpenAI service:", error);
    throw new Error("Failed to fetch response from OpenAI.");
  }
}
