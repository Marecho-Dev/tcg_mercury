import React from "react";
import type { Cards } from "./columns";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getTCGCardPriceView } from "~/server/queries";

async function getData(): Promise<Cards[]> {
  const getCards = await getTCGCardPriceView();
  console.log("------------------------------------------");
  console.log(getCards);
  console.log("------------------------------------------");
  return getCards;
}

export default async function InventoryPage() {
  const initialData = await getData();

  console.log(initialData);

  async function refreshData() {
    "use server";
    return getData();
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={initialData}
        refreshData={refreshData}
      />
    </div>
  );
}
