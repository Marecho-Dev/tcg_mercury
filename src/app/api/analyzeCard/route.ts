// src/app/api/analyzeCard/route.ts

import type { NextRequest } from "next/server";
import { generateChatResponse } from "../../../server/gptquery";
import { NextResponse } from "next/server";
import { updateCard, searchTCGPlayerCards } from "~/server/queries";

interface CardInfo {
  id: number;
  name: string;
  set: string;
  rarity: string;
  condition: "NM" | "LP" | "MP" | "HP" | "D";
  firstEdition: boolean;
  imageUrl: string;
  productId: number | null;
  matchStatus: "found" | "multiple" | "not_found";
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
1. For name, set(set will be set name followed by - and then followed by card number in that set), and rarity, be careful to distinguish between similar-looking characters (like I and L). Use your best judgment to correct any text that might be unclear due to surface damage. Also, trim it, there should be no spaces in the set name.
2. For condition, use only these categories: "NM" (Near Mint), "LP" (Lightly Played), "MP" (Moderately Played), "D" (Damaged), or "HP" (Heavily Played).
3. For firstEdition, use a boolean value (true or false). If you don't see 1st Edition anywhere on the card, mark this as false!.
4. For Rarity, if the letters are white, it is COMMON.

Ensure the JSON is properly formatted and can be parsed by JavaScript's JSON.parse() function.`,
          },
        ],
      },
    ]);

    console.log("Response from OpenAI:", response);
    const parsedResponse = parseResponse(response!);

    if (parsedResponse) {
      const updatedCard: CardInfo = {
        ...parsedResponse,
        id: selectedRow.id,
        imageUrl: imageUrl,
        productId: null,
        matchStatus: "not_found",
      };

      // Extract the card number from the set

      console.log(updatedCard.set);
      // Update the database with the new information
      if (updatedCard.set) {
        // Search for the card in tcgPlayerCards
        const matchingCards = await searchTCGPlayerCards(updatedCard.set);

        if (matchingCards.length === 1) {
          // Exact match found
          updatedCard.productId = matchingCards[0]?.productId ?? null;
          updatedCard.matchStatus = "found";
        } else if (matchingCards.length > 1) {
          // Multiple matches found
          updatedCard.productId = null;
          updatedCard.matchStatus = "multiple";
        } else {
          // No matches found
          updatedCard.productId = null;
          updatedCard.matchStatus = "not_found";
        }
      } else {
        updatedCard.productId = null;
        updatedCard.matchStatus = "not_found";
      }

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

function parseResponse(
  response: string | undefined,
): Omit<CardInfo, "id" | "imageUrl" | "productId" | "matchStatus"> | null {
  if (!response) {
    return null;
  }

  try {
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
