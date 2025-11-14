"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { SimTableData } from "@/types/chat";

export const simColumns: ColumnDef<SimTableData>[] = [
  {
    accessorKey: "simNo",
    header: "SIM No",
    cell: ({ row }) => <span>{row.id}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    enableSorting: false,
  },
  {
    accessorKey: "bkBalance",
    header: "BK Balance",
    enableSorting: false,
  },
  {
    accessorKey: "bkSM",
    header: "BK SM",
    enableSorting: false,
  },
  {
    accessorKey: "bkCO",
    header: "BK CO",
    enableSorting: false,
  },
  {
    accessorKey: "bkMER",
    header: "BK MER",
    enableSorting: false,
  },
];
