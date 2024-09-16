// src/app/api/tcgPlayerUpdate/route.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  updateOrInsertTCGPlayerCard,
  updateOrInsertTCGPlayerPrice,
} from "~/server/queries";

const API_BASE_URL = "https://tcgcsv.com";
const YUGIOH_CATEGORY = "2";

interface ExtendedDataItem {
  name: string;
  displayName: string;
  value: string;
}

interface TCGPlayerProduct {
  productId: number;
  name: string;
  cleanName: string;
  imageUrl: string;
  categoryId: number;
  groupId: number;
  url: string;
  modifiedOn: string;
  imageCount: number;
  extendedData: ExtendedDataItem[];
  presaleInfo: {
    isPresale: boolean;
    releasedOn: string | null;
    note: string | null;
  };
}

interface ProcessedTCGPlayerProduct extends TCGPlayerProduct {
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

interface TCGPlayerPrice {
  productId: number;
  lowPrice: number | null;
  midPrice: number | null;
  highPrice: number | null;
  marketPrice: number | null;
  directLowPrice: number | null;
  subTypeName: string;
}

function processExtendedData(
  product: TCGPlayerProduct,
): ProcessedTCGPlayerProduct {
  const processedProduct: ProcessedTCGPlayerProduct = {
    ...product,
    extDescription: "",
    extUPC: "",
    extNumber: "",
    extRarity: "",
    extAttribute: "",
    extMonsterType: "",
    extCardType: "",
    extAttack: "",
    extDefense: "",
    extLinkRating: "",
    extLinkArrows: "",
  };

  for (const item of product.extendedData) {
    switch (item.name) {
      case "Number":
        processedProduct.extNumber = item.value;
        break;
      case "Rarity":
        processedProduct.extRarity = item.value;
        break;
      case "Attribute":
        processedProduct.extAttribute = item.value;
        break;
      case "MonsterType":
        processedProduct.extMonsterType = item.value;
        break;
      case "Card Type":
        processedProduct.extCardType = item.value;
        break;
      case "Attack":
        processedProduct.extAttack = item.value;
        break;
      case "Defense":
        processedProduct.extDefense = item.value;
        break;
      case "Description":
        processedProduct.extDescription = item.value;
        break;
      // Add cases for UPC, LinkRating, and LinkArrows if they exist in the data
    }
  }

  return processedProduct;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as T;
}

async function updateProductAndPrice(
  product: TCGPlayerProduct,
  price: TCGPlayerPrice,
) {
  const processedProduct = processExtendedData(product);
  await updateOrInsertTCGPlayerCard(processedProduct);
  await updateOrInsertTCGPlayerPrice(price);
}

export async function GET(_req: NextRequest) {
  console.log("TCGPlayer Update Handler Start");

  try {
    const groupsData = await fetchJson<{
      results: { groupId: string; name: string }[];
    }>(`${API_BASE_URL}/${YUGIOH_CATEGORY}/groups`);

    for (const group of groupsData.results) {
      try {
        await processGroup(YUGIOH_CATEGORY, group.groupId);
        console.log(`Processed group: ${group.name}`);
      } catch (groupError) {
        console.error(`Error processing group ${group.name}:`, groupError);
        // Continue with the next group instead of stopping the entire process
      }
    }

    return NextResponse.json(
      { message: "TCGPlayer data updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error during TCGPlayer update:", error);

    let errorMessage = "Failed to update TCGPlayer data.";
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function processGroup(categoryId: string, groupId: string) {
  try {
    const productsData = await fetchJson<{ results: TCGPlayerProduct[] }>(
      `${API_BASE_URL}/${categoryId}/${groupId}/products`,
    );
    const pricesData = await fetchJson<{ results: TCGPlayerPrice[] }>(
      `${API_BASE_URL}/${categoryId}/${groupId}/prices`,
    );

    for (const product of productsData.results) {
      const prices = pricesData.results.filter(
        (p) => p.productId === product.productId,
      );

      for (const price of prices) {
        try {
          await updateProductAndPrice(product, price);
          console.log(
            `Updated product ${product.productId} with subTypeName ${price.subTypeName}`,
          );
        } catch (updateError) {
          console.error(
            `Error updating product ${product.productId} with subTypeName ${price.subTypeName}:`,
            updateError,
          );
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching data for group ${groupId}:`, error);
    throw error;
  }
}
