"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { UpdateTransactionHistoryForm } from "@/components/sim/update-transaction-history-form";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SIM_TRANSACTION_TYPE } from "@/enums/sim.enum";
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
    filterFn: (row, _columnId, filterValue: string[]) => {
      if (filterValue.length === 0) return true;
      return filterValue.includes(row.original.operation);
    },
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
    accessorKey: "operatedBy",
    header: "Operated By",
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-[11px] tabular-nums text-muted-foreground">
        {row.original.createdAt.toLocaleString()}
      </span>
    ),
    filterFn: (row, _columnId, filterValue: DateRange) => {
      const createdAt = new Date(row.original.createdAt);
      if (!(filterValue.from && filterValue.to)) return true;
      return createdAt >= filterValue.from && createdAt <= filterValue.to;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.type === SIM_TRANSACTION_TYPE.OUT ? (
        <DialogProvider>
          <DialogTrigger asChild>
            <Button className="size-8" variant="outline">
              <EditIcon className="text-yellow-500" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            <UpdateTransactionHistoryForm transaction={row.original} />
          </DialogContent>
        </DialogProvider>
      ) : null,
  },
];
