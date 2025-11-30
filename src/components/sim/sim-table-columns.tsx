"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";

import type { SimTableData } from "@/types/chat";

export const simColumns: ColumnDef<SimTableData>[] = [
  {
    accessorKey: "deviceNo",
    header: "Device No",
    cell: ({ row }) => row.original.device?.deviceNo || "N/A",
    enableSorting: false,
  },
  {
    accessorKey: "simNo",
    header: "Sim No",
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
  {
    accessorKey: "ngBalance",
    header: "NG Balance",
    enableSorting: false,
  },
  {
    accessorKey: "ngSM",
    header: "NG SM",
    enableSorting: false,
  },
  {
    accessorKey: "ngCO",
    header: "NG CO",
    enableSorting: false,
  },
  {
    accessorKey: "ngMER",
    header: "NG MER",
    enableSorting: false,
  },
  {
    accessorKey: "lastCashedInDate",
    header: "Last Cashed In",
    cell: ({ row }) =>
      row.original.lastCashedInDate
        ? formatDistanceToNowStrict(row.original.lastCashedInDate, { addSuffix: true })
        : "N/A",
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.lastCashedInDate;
      const dateB = rowB.original.lastCashedInDate;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateA.getTime() - dateB.getTime();
    },
  },
];
