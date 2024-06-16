// src/app/api/createCard/route.ts
import { NextResponse } from "next/server";
import { getMyCards } from "../../../server/queries"; // Adjust the import path if necessary

export async function GET() {
  try {
    // Assuming createCard does not require any data from the request body
    const cards = await getMyCards();
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
