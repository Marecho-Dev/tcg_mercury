import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { cards, images } from "./db/schema";
import { inArray, eq } from "drizzle-orm";

export async function getMyImages() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const cards = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });
  return cards;
}

export async function createCard() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");
  const newCard = await db
    .insert(cards)
    .values({ userId: user.userId })
    .returning({ id: cards.id }); // Ensure this returns the inserted row's ID

  return newCard; // Return the first (and presumably only) result
}

export async function updateImage(imageIds: number[], cardId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");
  const updatedImages = await db
    .update(images)
    .set({ cardId })
    .where(inArray(images.id, imageIds))
    .returning({ id: images.id }); // Ensure this returns the inserted row's ID

  return updatedImages; // Return the first (and presumably only) result
}
export async function updateCardImages(
  cardId: number,
  picture1Url: string,
  picture2Url: string,
) {
  const user = auth();

  // Check if the user is authenticated
  if (!user.userId) throw new Error("Unauthorized");

  // Update the card with new picture URLs
  const updatedImages = await db
    .update(cards)
    .set({
      picture1Url: picture1Url, // Update picture1Url
      picture2Url: picture2Url, // Update picture2Url
    })
    .where(eq(cards.id, cardId)) // Condition to find the correct card
    .returning({
      id: cards.id,
      picture1Url: cards.picture1Url,
      picture2Url: cards.picture2Url,
    }); // Return updated fields

  return updatedImages; // Return the updated card details
}
