"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";

import type { SimTransactionHistory } from "@/generated/prisma";
import { cn } from "@/lib/cn";

const multiColumnFilterFn: FilterFn<SimTransactionHistory> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.note}${row.original.amount}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export const simTransactionHistoryColumns: ColumnDef<SimTransactionHistory>[] = [
  {
    accessorKey: "id",
    header: "TX ID",
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: false,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "operation",
    header: "Operation",
    enableSorting: false,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span
        className={cn(
          "tabular-nums",
          row.original.type === "IN" ? "text-green-500" : "text-red-500",
        )}
      >
        {row.original.type === "IN" ? "+" : "-"}
        {row.original.amount}
      </span>
    ),
  },
  {
    accessorKey: "charge",
    header: "Charge",
    enableSorting: false,
    cell: ({ row }) => <span className="tabular-nums">{row.original.charge}</span>,
  },
  {
    accessorKey: "note",
    header: "Note",
    enableSorting: false,
    cell: ({ row }) => <span className="text-xs">{row.original.note}</span>,
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString()}
      </span>
    ),
    filterFn: (row, _columnId, filterValue: DateRange) => {
      const createdAt = new Date(row.original.createdAt);
      if (!(filterValue.from && filterValue.to)) return true;
      console.log(filterValue);
      return createdAt >= filterValue.from && createdAt <= filterValue.to;
    },
  },
];
