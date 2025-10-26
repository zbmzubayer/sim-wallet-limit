"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateTransactionHistoryNote } from "@/actions/sim.action";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getQueryClient } from "@/lib/get-query-client";
import type { TransactionHistory } from "@/types/chat";
import { type SimTransactionNoteDto, simTransactionNoteSchema } from "@/validations/sim.dto";

interface UpdateTransactionHistoryFormProps {
  transaction: TransactionHistory;
}

export function UpdateTransactionHistoryNoteForm({
  transaction,
}: UpdateTransactionHistoryFormProps) {
  const queryClient = getQueryClient();
  const { setOpen } = useDialog();
  const form = useForm({
    resolver: zodResolver(simTransactionNoteSchema),
    defaultValues: {
      note: transaction.note || "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateTransactionHistoryNote,
    onSuccess: () => {
      toast.success("Balance updated successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions", transaction.simId] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update balance", {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: SimTransactionNoteDto) => {
    await mutateAsync({ id: transaction.id, payload: values });
  };

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Note</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Textarea rows={3} placeholder="Enter a note" className="resize-none" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
