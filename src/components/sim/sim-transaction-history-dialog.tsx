"use client";

import { useQuery } from "@tanstack/react-query";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-4xl">
        <div className="overflow-y-auto p-6">
          <DialogHeader className="mb-3 flex-row items-center gap-5">
            <DialogTitle>
              Transaction History - DS-{deviceNo} Sim {simNo}
            </DialogTitle>
            <ClearTransactionHistoryAlertDialog simId={simId} />
          </DialogHeader>
          <div className="flex items-center gap-3 mb-2 text-xs">
            <div className="rounded-md border-2 px-2 py-1">Total BK SM: {bkTotalSM}</div>
            <div className="rounded-md border-2 px-2 py-1">Total BK CO: {bkTotalCO}</div>
            <div className="rounded-md border-2 px-2 py-1">Total BK MER: {bkTotalMER}</div>
            <div className="rounded-md border-2 px-2 py-1">Total NG SM: {ngTotalSM}</div>
            <div className="rounded-md border-2 px-2 py-1">Total NG CO: {ngTotalCO}</div>
            <div className="rounded-md border-2 px-2 py-1">Total NG MER: {ngTotalMER}</div>
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

function SimTransactionHistoryTable({ simId }: { simId: number }) {
  const { data, isFetching } = useQuery({
    queryKey: [simId],
    queryFn: () => getTransactionHistoryBySimId(simId),
  });

  return isFetching ? (
    <Spinner className="flex h-full w-full items-center justify-center" />
  ) : (
    <DataTable columns={simTransactionHistoryColumns} data={data || []} />
  );
}
