// app/server/cardUpload.ts
import type { NextRequest, NextResponse } from "next/server";
import { cardRouter } from "./cards"; // Adjust the path as necessary

export function middleware(req: NextRequest) {
  console.log("Middleware hit:", req.url);
  if (req.method === "POST") {
    try {
      // Manually extract or adapt the needed properties from NextRequest
      const user = await cardRouter.cardUploader({
        // Simulate a NextApiRequest or directly pass the required fields
        body: await req.json(),
        headers: req.headers,
        // Add other properties as needed
      });

      const result = await cardRouter.onUploadComplete(user);
      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
}
