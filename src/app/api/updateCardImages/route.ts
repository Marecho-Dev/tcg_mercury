// src/app/api/updateImage/route.ts

import { NextRequest, NextResponse } from "next/server";
import { updateCardImages } from "../../../server/queries"; // Adjust the import path if necessary

interface CardImageUpdateRequest {
  cardId: number;
  picture1Url: string;
  picture2Url: string;
}

export async function POST(req: NextRequest) {
  try {
    // Assuming createCard does not require any data from the request body
    const { cardId, picture1Url, picture2Url }: CardImageUpdateRequest =
      (await req.json()) as CardImageUpdateRequest;

    if (!picture1Url || !picture2Url || !cardId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }
    const updatedCards = await updateCardImages(
      cardId,
      picture1Url,
      picture2Url,
    );
    return NextResponse.json(updatedCards, { status: 200 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to create a card" });
}
