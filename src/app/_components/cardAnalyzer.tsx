"use client";
import OpenAI from "openai";

async function main() {
  const openai = new OpenAI();
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}
export function CardAnalyzer() {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      Check the console for the result.
    </div>
  );
}
