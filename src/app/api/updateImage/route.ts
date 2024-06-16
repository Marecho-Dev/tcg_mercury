// src/app/api/updateImage/route.ts

import { NextRequest, NextResponse } from "next/server";
import { updateImage } from "../../../server/queries"; // Adjust the import path if necessary

interface imageUpdateRequest {
  cardId: number;
  imageIds: number[];
}

export async function POST(req: NextRequest) {
  try {
    // Assuming createCard does not require any data from the request body
    const { imageIds, cardId }: imageUpdateRequest =
      (await req.json()) as imageUpdateRequest;

    if (!imageIds || !cardId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }
    const updatedImages = await updateImage(imageIds, cardId);
    return NextResponse.json(updatedImages, { status: 200 });
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
