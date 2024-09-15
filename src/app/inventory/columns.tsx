"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IntegerConfig } from "drizzle-orm/sqlite-core";

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
    accessorKey: "edition",
    header: "Edition",
  },
];
