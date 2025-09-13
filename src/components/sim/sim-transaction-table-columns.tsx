"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { SimTransactionHistory } from "@/generated/prisma";
import { cn } from "@/lib/cn";

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
  },
  {
    accessorKey: "operation",
    header: "Operation",
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className={cn(row.original.type === "IN" ? "text-green-500" : "text-red-500")}>
        {row.original.type === "IN" ? "+" : "-"}
        {row.original.amount}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "charge",
    header: "Charge",
    enableSorting: false,
  },
  {
    accessorKey: "note",
    header: "Note",
    enableSorting: false,
    cell: ({ row }) => <span className="text-xs">{row.original.note}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString()}
      </span>
    ),
  },
];
