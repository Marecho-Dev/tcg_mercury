// src/app/api/analyzeCard/route.ts

import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "../../../server/gptquery";
import sharp from "sharp";
import fs from "fs/promises";
import fs1 from "fs";
import axios from "axios";

type ResponseData = {
  message: string | null;
  imageUrl: string | null;
};

// Function to fetch an image and convert it to base64
const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer", // Important to handle binary data
    });

    // Convert the array buffer to a Buffer and then to base64
    const base64 = Buffer.from(response.data, "binary").toString("base64");

    return `data:${response.headers["content-type"]};base64,${base64}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return "";
  }
};

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("Handler start");
  try {
    // const imageUrl =
    //   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg";
    const imageUrl =
      "https://i.etsystatic.com/31888998/r/il/77f7ae/3425250783/il_570xN.3425250783_ghh9.jpg";
    const detail = "high";
    const base64 = await imageUrlToBase64(imageUrl).then((base64) => {
      console.log(base64);
    });

    const response = await generateChatResponse([
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What is the name of this yugioh card? and can you give me the url i passed in again",
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: detail,
            },
          },
        ],
      },
    ]);
    console.log("Response from OpenAI:", response);
    const parsedResponse = parseResponse(response!);

    return NextResponse.json(
      { message: parsedResponse.text, imageUrl: parsedResponse.imageUrl },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error during API call:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from OpenAI." },
      { status: 500 },
    ); // Error response
  }
}

function parseResponse(response: string | undefined): {
  text: string | null;
  imageUrl: string | null;
} {
  if (!response) {
    return { text: null, imageUrl: null };
  }

  const lines = response.split("\n");
  let text = "";
  let imageUrl = null;

  for (const line of lines) {
    if (line.startsWith("data:image/")) {
      imageUrl = line;
    } else {
      text += line + "\n";
    }
  }

  return { text: text.trim(), imageUrl };
}
