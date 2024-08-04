"use client";

import React, { useState } from "react";
import type { Cards } from "./columns";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "../../components/ui/button";

export default function InventoryPage({
  initialData,
}: {
  initialData: Cards[];
}) {
  const [data, setData] = useState(initialData);
  const [selectedRows, setSelectedRows] = useState({});

  const handleAnalyze = async () => {
    const selectedCards = Object.keys(selectedRows).map(
      (index) => data[parseInt(index)],
    );

    try {
      const response = await fetch("/api/analyze-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cards: selectedCards }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze cards");
      }

      const result = await response.json();

      // Update the data with the analysis results
      const updatedData = data.map((card) => {
        const analyzedCard = result.find((ac) => ac.id === card.id);
        return analyzedCard ? { ...card, ...analyzedCard } : card;
      });

      setData(updatedData);
    } catch (error) {
      console.error("Error analyzing cards:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end pb-2">
        <Button variant="outline" onClick={handleAnalyze}>
          Analyze Cards
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        setSelectedRows={setSelectedRows}
      />
    </div>
  );
}
