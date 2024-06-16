// src/app/api/createCard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCard } from "../../../server/queries"; // Adjust the import path if necessary

export async function POST(req: NextRequest) {
  try {
    // Assuming createCard does not require any data from the request body
    const card = await createCard();
    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
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
