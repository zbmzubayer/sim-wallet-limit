"use client";

import { useQuery } from "@tanstack/react-query";
import { EyeIcon, XIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

import {
  clearSimTransactionHistoryBySimId,
  getTransactionHistoryBySimId,
} from "@/actions/sim.action";
import { simTransactionHistoryColumns } from "@/components/sim/sim-transaction-table-columns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import { DataTableProvider, useDataTable } from "@/components/ui/data-table/data-table-provider";
import type { FilterField } from "@/components/ui/data-table/data-table-toolbar";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SIM_TRANSACTION_OPERATION, SIM_TRANSACTION_TYPE } from "@/enums/sim.enum";
import { cn } from "@/lib/cn";
import { getQueryClient } from "@/lib/get-query-client";

interface SimTransactionHistoryDialogProps {
  deviceNo: number;
  simNo: number;
  simId: number;
  bkTotalSM: number;
  bkTotalCO: number;
  bkTotalMER: number;
  ngTotalSM: number;
  ngTotalCO: number;
  ngTotalMER: number;
}

export function SimTransactionHistoryDialog({
  deviceNo,
  simNo,
  simId,
  bkTotalSM,
  bkTotalCO,
  bkTotalMER,
  ngTotalSM,
  ngTotalCO,
  ngTotalMER,
}: SimTransactionHistoryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <EyeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-5xl">
        <div className="overflow-y-auto p-6">
          <DialogHeader className="mb-3 flex-row items-center gap-5">
            <DialogTitle>
              Transaction History - DS-{deviceNo} Sim {simNo}
            </DialogTitle>
            <ClearTransactionHistoryAlertDialog simId={simId} />
          </DialogHeader>
          <div className="flex items-center gap-3 mb-2 tabular-nums text-xs">
            <div className="rounded-md border-2 px-2 py-1">
              Total BK SM: {bkTotalSM.toLocaleString()}
            </div>
            <div className="rounded-md border-2 px-2 py-1">
              Total BK CO: {bkTotalCO.toLocaleString()}
            </div>
            <div className="rounded-md border-2 px-2 py-1">
              Total BK MER: {bkTotalMER.toLocaleString()}
            </div>
            <div className="rounded-md border-2 px-2 py-1">
              Total NG SM: {ngTotalSM.toLocaleString()}
            </div>
            <div className="rounded-md border-2 px-2 py-1">
              Total NG CO: {ngTotalCO.toLocaleString()}
            </div>
            <div className="rounded-md border-2 px-2 py-1">
              Total NG MER: {ngTotalMER.toLocaleString()}
            </div>
          </div>
          <SimTransactionHistoryTable simId={simId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClearTransactionHistoryAlertDialog({ simId }: { simId: number }) {
  const queryClient = getQueryClient();
  const [text, setText] = useState<string>("");
  const handleClear = async () => {
    await clearSimTransactionHistoryBySimId(simId);
    toast.success("Transaction history cleared");
    queryClient.invalidateQueries({ queryKey: [simId] });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Clear transaction history
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Type <span className="font-mono font-bold">DELETE</span> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input value={text} onChange={(e) => setText(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            disabled={text !== "DELETE"}
            onClick={handleClear}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const filterFields: FilterField[] = [
  {
    column: "type",
    title: "Type",
    options: [
      { label: SIM_TRANSACTION_TYPE.IN, value: SIM_TRANSACTION_TYPE.IN },
      { label: SIM_TRANSACTION_TYPE.OUT, value: SIM_TRANSACTION_TYPE.OUT },
    ],
  },
  {
    column: "operation",
    title: "Operation",
    options: [
      { label: "BK", value: "BK" },
      { label: "NG", value: "NG" },
      ...Object.values(SIM_TRANSACTION_OPERATION).map((operation) => ({
        label: operation,
        value: operation,
      })),
    ],
  },
];

function SimTransactionHistoryTable({ simId }: { simId: number }) {
  const { data, isFetching } = useQuery({
    queryKey: ["transactions", simId],
    queryFn: () => getTransactionHistoryBySimId(simId),
  });

  return isFetching ? (
    <Spinner className="flex h-full w-full items-center justify-center" />
  ) : (
    <DataTableProvider columns={simTransactionHistoryColumns} data={data || []}>
      <TransactionTableToolbar filterFields={filterFields} />
      <DataTable />
    </DataTableProvider>
  );
}

export function TransactionTableToolbar({ filterFields }: { filterFields: FilterField[] }) {
  const { table } = useDataTable();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => table.getColumn("note")?.setFilterValue(event.target.value)}
          placeholder="Search by amount, note"
          value={(table.getColumn("note")?.getFilterValue() as string) ?? ""}
        />

        {filterFields?.map(
          (field) =>
            table.getColumn(field.column) && (
              <DataTableFacetedFilter
                column={table.getColumn(field.column)}
                key={field.column}
                options={field.options}
                title={field.title}
              />
            ),
        )}
        <DateRangePicker
          className="h-8 w-56"
          onChange={(range) => {
            table.getColumn("createdAt")?.setFilterValue(range);
          }}
          rangeType="previous"
          value={table.getColumn("createdAt")?.getFilterValue() as DateRange}
        />
        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
            variant="ghost"
          >
            Reset
            <XIcon />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
