import React from "react";
import type { Cards } from "./columns";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getMyCards } from "~/server/queries";
import { Button } from "../../components/ui/button";
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
