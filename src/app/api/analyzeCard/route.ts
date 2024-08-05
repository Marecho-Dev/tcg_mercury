// src/app/api/analyzeCard/route.ts

import type { NextRequest } from "next/server";
import { generateChatResponse } from "../../../server/gptquery";
import { NextResponse } from "next/server";
import { updateCard } from "~/server/queries";

interface CardInfo {
  id: number;
  name: string;
  set: string;
  rarity: string;
  condition: "NM" | "LP" | "MP" | "HP";
  firstEdition: boolean;
  imageUrl: string;
}

interface SelectedRow {
  id: number;
  picture1Url: string;
  picture2Url: string;
  name: string | null;
  rarity: string | null;
  // Add other properties as needed
}

interface AnalyzeCardRequest {
  selectedRow: SelectedRow;
}
export async function POST(_req: NextRequest, _res: NextResponse) {
  console.log("Handler start");

  try {
    const body = (await _req.json()) as AnalyzeCardRequest;
    console.log("Received data:", body);

    // Extract selectedRows from the body object
    const { selectedRow } = body;

    if (!selectedRow || typeof selectedRow !== "object") {
      console.error("Invalid selectedRow:", selectedRow);
      return NextResponse.json(
        { error: "Invalid data format. Expected a single row object." },
        { status: 400 },
      );
    }
    console.log(selectedRow);

    const imageUrl = selectedRow.picture1Url;

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
1. For name, set(set will be set name followed by - and then followed by card number in that set), and rarity, be careful to distinguish between similar-looking characters (like I and L). Use your best judgment to correct any text that might be unclear due to surface damage.
2. For condition, use only these categories: "NM" (Near Mint), "LP" (Lightly Played), "MP" (Moderately Played), or "HP" (Heavily Played).
3. For firstEdition, use a boolean value (true or false).

Ensure the JSON is properly formatted and can be parsed by JavaScript's JSON.parse() function.`,
          },
        ],
      },
    ]);

    console.log("Response from OpenAI:", response);
    const parsedResponse = parseResponse(response!);

    if (parsedResponse) {
      const updatedCard = {
        ...parsedResponse,
        id: selectedRow.id,
        imageUrl: imageUrl,
      };

      // Update the database with the new information
      await updateCard(updatedCard);

      return NextResponse.json(updatedCard, { status: 200 });
    }

    return NextResponse.json(
      { error: "Failed to parse response" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Error during API call:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from OpenAI." },
      { status: 500 },
    );
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
