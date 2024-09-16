"use client";

import type { ColumnDef } from "@tanstack/react-table";
// import { IntegerConfig } from "drizzle-orm/sqlite-core";

export type Cards = {
  id: number;
  picture1Url: string | null; // Allow null
  picture2Url: string | null; // Allow null
  name: string | null; // Allow null
  rarity: string | null; // Allow null
  condition: string | null; // Allow null
  set: string | null; // Allow null
  firstEdition: boolean | null; // Allow null
  ebayPrice: number | null; // Allow null
  tcgPlayerPrice: number | null; // Allow null
  userId: string; // Assuming userId should always be a string and not null
  createdAt: Date; // Date when created
  updatedAt: Date | null; // Allow null for updates
  productId: number | null;
  matchStatus: "found" | "multiple" | "not_found" | null;
  marketPrice: number | null;
};

export const columns: ColumnDef<Cards>[] = [
  { accessorKey: "id", header: "Id" },
  {
    accessorKey: "picture1Url",
    header: "Front Picture Url",
  },
  {
    accessorKey: "picture2Url",
    header: "Back Picture Url",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "rarity",
    header: "Rarity",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "set",
    header: "Set",
  },
  {
    accessorKey: "firstEdition", // Changed from "edition" to "firstEdition" to match the type
    header: "First Edition",
    cell: ({ row }) => {
      const firstEdition = row.getValue("firstEdition");
      return firstEdition ? "1st Edition" : "Unlimited";
    },
    // cell: ({ row }) => {
    //   const firstEdition = row.getValue("firstEdition");
    //   return firstEdition ? "1st" : "Unl";
    // },
  },
  {
    accessorKey: "productId",
    header: "Product ID",
  },
  {
    accessorKey: "matchStatus",
    header: "Match Status",
  },
  {
    accessorKey: "marketPrice",
    header: "Market Price",
    cell: ({ row }) => {
      const marketPrice = row.getValue<number | null>("marketPrice");
      return marketPrice !== null ? `$${marketPrice.toFixed(2)}` : "N/A";
    },
  },
];
