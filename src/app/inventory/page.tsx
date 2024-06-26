import React, { useState } from "react";
import { Cards, columns } from "./columns";
import { DataTable } from "./data-table";
import { getMyCards } from "~/server/queries";
import { Button, button } from "../../components/ui/button";
import { CardAnalyzer } from "../_components/cardAnalyzer";
async function getData(): Promise<Cards[]> {
  const getCards = await getMyCards();
  console.log(getCards);
  return getCards;
}

export default async function InventoryPage() {
  const data = await getData();

  console.log(data);
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end pb-2">
        <Button variant="outline">Analyze Cards</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
