// src/app/api/analyzeCard/route.ts

import type { NextRequest } from "next/server";
import { generateChatResponse } from "../../../server/gptquery";
import { NextResponse } from "next/server";

interface CardInfo {
  name: string;
  set: string;
  rarity: string;
  condition: "NM" | "LP" | "MP" | "HP";
  firstEdition: boolean;
  imageUrl: string;
}

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("Handler start");
  try {
    // const imageUrl =
    //   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madisonthe-nature-boardwalk.jpg";
    const imageUrl =
      "https://utfs.io/f/d699cdaa-2a30-4e4a-8545-26b228cdd22b-lmien9.jpg";

    const response = await generateChatResponse([
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "high",
            },
          },
          {
            type: "text",
            text: `Analyze this Yu-Gi-Oh card image and provide the following information in a valid JSON format:

{
  "name": "",
  "set": "",
  "rarity": "",
  "condition": "",
  "firstEdition": 
}

Please note:
1. For name, set, and rarity, be careful to distinguish between similar-looking characters (like I and L). Use your best judgment to correct any text that might be unclear due to surface damage.
2. For condition, use only these categories: "NM" (Near Mint), "LP" (Lightly Played), "MP" (Moderately Played), or "HP" (Heavily Played).
3. For firstEdition, use a boolean value (true or false).

Ensure the JSON is properly formatted and can be parsed by JavaScript's JSON.parse() function.`,
          },
        ],
      },
    ]);
    console.log("Response from OpenAI:", response);

    const parsedResponse = parseResponse(response!);

    return NextResponse.json(parsedResponse, { status: 200 });
  } catch (error) {
    console.error("Error during API call:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from OpenAI." },
      { status: 500 },
    ); // Error response
  }
}

function parseResponse(response: string | undefined): CardInfo | null {
  if (!response) {
    return null;
  }

  try {
    // Find the JSON object in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      return JSON.parse(jsonString) as CardInfo;
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  return null;
}
