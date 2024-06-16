import { Cards, columns } from "./columns";
import { DataTable } from "./data-table";
import { getMyCards } from "~/server/queries";

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
      <DataTable columns={columns} data={data} />
    </div>
  );
}
