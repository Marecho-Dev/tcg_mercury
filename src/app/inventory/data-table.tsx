"use client";
import { Checkbox } from "../../components/ui/checkbox";
import { useState, useMemo, useEffect } from "react";
import { useSelectedRowsStore } from "~/store/cardStore";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Cards } from "./columns";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface DataTableProps<TData extends Cards, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Cards, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { selectedRows, setSelectedRows } = useSelectedRowsStore();
  useEffect(() => {
    console.log("Selected rows:", selectedRows);
  }, [selectedRows]);
  const selectionColumn: ColumnDef<TData, TValue> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const allColumns = useMemo(() => [selectionColumn, ...columns], [columns]);
  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (updater) => {
      if (typeof updater === "function") {
        const currentSelection = Object.fromEntries(
          selectedRows.map((row) => [
            data.findIndex((d) => d.id === row.id),
            true,
          ]),
        );
        const newSelection = updater(currentSelection);
        const newSelectedRows = Object.keys(newSelection)
          .filter((key) => newSelection[key])
          .map((key) => {
            const index = parseInt(key);
            return index >= 0 && index < data.length ? data[index] : null;
          })
          .filter((row): row is TData => row !== null);
        setSelectedRows(newSelectedRows);
      }
    },
    state: {
      rowSelection: Object.fromEntries(
        selectedRows.map((row) => [
          data.findIndex((d) => d.id === row.id),
          true,
        ]),
      ),
    },
  });

  return (
    <div>
      <div className="flex justify-end pb-2">
        <Button variant="outline">Analyze Cards</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
