"use client";

import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { clearAllSimTransactionHistories } from "@/actions/sim.action";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { getQueryClient } from "@/lib/get-query-client";

export function ClearAllTransactionHistoryAlertDialog() {
  const queryClient = getQueryClient();
  const [text, setText] = useState<string>("");

  const handleClear = async () => {
    await clearAllSimTransactionHistories();
    toast.success("All transaction histories cleared");
    queryClient.clear();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <TrashIcon /> Clear all transaction history
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
