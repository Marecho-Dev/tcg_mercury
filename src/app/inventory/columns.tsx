"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

const ImagePreview: React.FC<{ src: string | null }> = ({ src }) => {
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        previewRef.current &&
        !previewRef.current.contains(event.target as Node)
      ) {
        setShowPreview(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!src) return <span>No image</span>;

  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="relative h-[50px] w-[50px]">
        <img
          src={src}
          alt="Card thumbnail"
          className="h-full w-full cursor-pointer object-contain"
          onClick={() => setShowPreview(!showPreview)}
        />
      </div>
      {showPreview && (
        <div
          ref={previewRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowPreview(false)}
        >
          <div className="max-h-3xl relative max-w-3xl">
            <img
              src={src}
              alt="Card preview"
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const columns: ColumnDef<Cards>[] = [
  { accessorKey: "id", header: "Id" },
  {
    accessorKey: "picture1Url",
    header: "Front Picture Url",
    cell: ({ row }) => <ImagePreview src={row.getValue("picture1Url")} />,
  },
  {
    accessorKey: "picture2Url",
    header: "Back Picture Url",
    cell: ({ row }) => <ImagePreview src={row.getValue("picture2Url")} />,
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
