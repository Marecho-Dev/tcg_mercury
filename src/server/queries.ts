import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { cards, images, tcgPlayerCards, tcgPlayerPrices } from "./db/schema";
import { inArray, eq, and, or, like, sql } from "drizzle-orm";
interface TCGCardPriceView {
  id: number;
  picture1Url: string;
  picture2Url: string;
  name: string | null;
  rarity: string | null;
  condition: string | null;
  set: string | null;
  firstEdition: boolean;
  ebayPrice: number | null;
  tcgPlayerPrice: number | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
  productId: number | null;
  matchStatus: "found" | "multiple" | "not_found" | null;
  marketPrice: number | null;
}

interface CardUpdateInfo {
  id: number;
  name: string;
  set: string;
  rarity: string;
  condition: "NM" | "LP" | "MP" | "HP" | "D";
  firstEdition: boolean;
  productId?: number | null;
  matchStatus?: "found" | "multiple" | "not_found";
}

interface TCGPlayerCardInfo {
  productId: number;
  name: string;
  cleanName: string;
  imageUrl: string;
  categoryId: number;
  groupId: number;
  url: string;
  modifiedOn: string;
  imageCount: number;
  extDescription: string;
  extUPC: string;
  extNumber: string;
  extRarity: string;
  extAttribute: string;
  extMonsterType: string;
  extCardType: string;
  extAttack: string;
  extDefense: string;
  extLinkRating: string;
  extLinkArrows: string;
}

interface TCGPlayerPriceInfo {
  productId: number;
  lowPrice: number | null;
  midPrice: number | null;
  highPrice: number | null;
  marketPrice: number | null;
  directLowPrice: number | null;
  subTypeName: string;
}

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

export async function getMyCards() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const cards = await db.query.cards.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });
  return cards;
}

export async function updateCard(cardInfo: CardUpdateInfo) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  try {
    const updatedCard = await db
      .update(cards)
      .set({
        name: cardInfo.name,
        set: cardInfo.set,
        rarity: cardInfo.rarity,
        condition: cardInfo.condition,
        firstEdition: cardInfo.firstEdition,
        productId: cardInfo.productId,
        matchStatus: cardInfo.matchStatus,
        // Add any other fields you want to update
      })
      .where(eq(cards.id, cardInfo.id))
      .returning({
        id: cards.id,
        name: cards.name,
        set: cards.set,
        rarity: cards.rarity,
        condition: cards.condition,
        firstEdition: cards.firstEdition,
        productId: cards.productId,
        matchStatus: cards.matchStatus,
        // Return any other fields you want to confirm
      });

    if (updatedCard.length === 0) {
      throw new Error(`No card found with id ${cardInfo.id}`);
    }

    return updatedCard[0]; // Return the updated card details
  } catch (error) {
    console.error(`Error updating card with id ${cardInfo.id}:`, error);
    throw error;
  }
}

export async function updateOrInsertTCGPlayerCard(cardInfo: TCGPlayerCardInfo) {
  const existingCard = await db.query.tcgPlayerCards.findFirst({
    where: (cards, { eq }) => eq(cards.productId, cardInfo.productId),
  });

  if (existingCard) {
    return await db
      .update(tcgPlayerCards)
      .set({
        name: cardInfo.name,
        cleanName: cardInfo.cleanName,
        imageUrl: cardInfo.imageUrl,
        categoryId: cardInfo.categoryId,
        groupId: cardInfo.groupId,
        url: cardInfo.url,
        modifiedOn: new Date(cardInfo.modifiedOn),
        imageCount: cardInfo.imageCount,
        extDescription: cardInfo.extDescription,
        extUPC: cardInfo.extUPC,
        extNumber: cardInfo.extNumber,
        extRarity: cardInfo.extRarity,
        extAttribute: cardInfo.extAttribute,
        extMonsterType: cardInfo.extMonsterType,
        extCardType: cardInfo.extCardType,
        extAttack: cardInfo.extAttack,
        extDefense: cardInfo.extDefense,
        extLinkRating: cardInfo.extLinkRating,
        extLinkArrows: cardInfo.extLinkArrows,
        updatedAt: new Date(),
      })
      .where(eq(tcgPlayerCards.productId, cardInfo.productId))
      .returning();
  } else {
    return await db
      .insert(tcgPlayerCards)
      .values({
        productId: cardInfo.productId,
        name: cardInfo.name,
        cleanName: cardInfo.cleanName,
        imageUrl: cardInfo.imageUrl,
        categoryId: cardInfo.categoryId,
        groupId: cardInfo.groupId,
        url: cardInfo.url,
        modifiedOn: new Date(cardInfo.modifiedOn),
        imageCount: cardInfo.imageCount,
        extDescription: cardInfo.extDescription,
        extUPC: cardInfo.extUPC,
        extNumber: cardInfo.extNumber,
        extRarity: cardInfo.extRarity,
        extAttribute: cardInfo.extAttribute,
        extMonsterType: cardInfo.extMonsterType,
        extCardType: cardInfo.extCardType,
        extAttack: cardInfo.extAttack,
        extDefense: cardInfo.extDefense,
        extLinkRating: cardInfo.extLinkRating,
        extLinkArrows: cardInfo.extLinkArrows,
      })
      .returning();
  }
}

export async function updateOrInsertTCGPlayerPrice(
  priceInfo: TCGPlayerPriceInfo,
) {
  try {
    const existingPrice = await db.query.tcgPlayerPrices.findFirst({
      where: (prices, { and, eq }) =>
        and(
          eq(prices.productId, priceInfo.productId),
          eq(prices.subTypeName, priceInfo.subTypeName),
        ),
    });

    if (existingPrice) {
      return await db
        .update(tcgPlayerPrices)
        .set({
          lowPrice: priceInfo.lowPrice,
          midPrice: priceInfo.midPrice,
          highPrice: priceInfo.highPrice,
          marketPrice: priceInfo.marketPrice,
          directLowPrice: priceInfo.directLowPrice,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(tcgPlayerPrices.productId, priceInfo.productId),
            eq(tcgPlayerPrices.subTypeName, priceInfo.subTypeName),
          ),
        )
        .returning();
    } else {
      return await db
        .insert(tcgPlayerPrices)
        .values({
          productId: priceInfo.productId,
          lowPrice: priceInfo.lowPrice,
          midPrice: priceInfo.midPrice,
          highPrice: priceInfo.highPrice,
          marketPrice: priceInfo.marketPrice,
          directLowPrice: priceInfo.directLowPrice,
          subTypeName: priceInfo.subTypeName,
        })
        .returning();
    }
  } catch (error) {
    console.error("Error in updateOrInsertTCGPlayerPrice:", error);
    throw error;
  }
}
export async function getTCGPlayerCard(productId: number) {
  return await db.query.tcgPlayerCards.findFirst({
    where: (cards, { eq }) => eq(cards.productId, productId),
  });
}

export async function getTCGPlayerPrice(
  productId: number,
  subTypeName: string,
) {
  return await db.query.tcgPlayerPrices.findFirst({
    where: (prices, { and, eq }) =>
      and(eq(prices.productId, productId), eq(prices.subTypeName, subTypeName)),
  });
}

export async function searchTCGPlayerCards(searchTerm: string) {
  return await db.query.tcgPlayerCards.findMany({
    where: or(
      like(tcgPlayerCards.name, `%${searchTerm}%`),
      like(tcgPlayerCards.extNumber, `%${searchTerm}%`),
    ),
    limit: 10, // Limit the number of results
  });
}

export async function getTCGPlayerCardByExtNumber(extNumber: string) {
  return await db.query.tcgPlayerCards.findFirst({
    where: eq(tcgPlayerCards.extNumber, extNumber),
  });
}

export async function getTCGPlayerCardsBySet(groupId: number) {
  return await db.query.tcgPlayerCards.findMany({
    where: eq(tcgPlayerCards.groupId, groupId),
  });
}

export async function getAllTCGPlayerPrices(productId: number) {
  return await db.query.tcgPlayerPrices.findMany({
    where: eq(tcgPlayerPrices.productId, productId),
  });
}

export async function getTCGCardPriceView(): Promise<TCGCardPriceView[]> {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  // Execute the raw SQL query
  const result = await db.execute(
    sql`
      SELECT * FROM tcg_card_price_view
      WHERE "userId" = ${user.userId}
      ORDER BY id DESC
    `,
  );

  // Map the result rows to match the TCGCardPriceView type
  const viewData = result.rows.map((row) => ({
    id: row.id as number,
    picture1Url: row.picture1Url as string,
    picture2Url: row.picture2Url as string,
    name: row.name as string | null,
    rarity: row.rarity as string | null,
    condition: row.condition as string | null,
    set: row.set as string | null,
    firstEdition: row.edition as boolean,
    ebayPrice: row.ebayPrice as number | null,
    tcgPlayerPrice: row.tcgPlayerPrice as number | null,
    userId: row.userId as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: row.updatedAt ? new Date(row.updatedAt as string) : null,
    productId: row.productId as number | null,
    matchStatus:
      (row.matchStatus as "found" | "multiple" | "not_found" | null) ?? null,
    marketPrice: row.marketPrice as number | null,
  })) as TCGCardPriceView[];

  return viewData;
}
