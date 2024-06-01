import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
export async function getMyCards() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const cards = await db.query.cards.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });
  return cards;
}
