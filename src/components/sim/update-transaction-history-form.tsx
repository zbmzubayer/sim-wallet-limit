"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateTransactionHistory } from "@/actions/sim.action";
import { setAutoCharge } from "@/components/sim/update-sim-balance-form";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { SIM_TRANSACTION_OPERATION, type SimTransactionOperation } from "@/enums/sim.enum";
import { getQueryClient } from "@/lib/get-query-client";
import type { TransactionHistory } from "@/types/chat";
import { type SimBalanceDto, simBalanceSchema } from "@/validations/sim.dto";

interface UpdateTransactionHistoryFormProps {
  transaction: TransactionHistory;
}

export function UpdateTransactionHistoryForm({ transaction }: UpdateTransactionHistoryFormProps) {
  const queryClient = getQueryClient();
  const { setOpen } = useDialog();
  const form = useForm({
    resolver: zodResolver(simBalanceSchema),
    defaultValues: {
      note: transaction.note || "",
      operation: transaction.operation as SimTransactionOperation,
      amount: transaction.amount,
      charge: transaction.charge,
    },
  });

  const selectedOperation = form.watch("operation");
  const formAmount = form.watch("amount") ?? 0;
  // const formCharge = form.watch("charge") ?? 0;

  // if (selectedOperation?.startsWith("BK")) {
  //   bkBalance = bkBalance - formAmount - formCharge;
  // } else if (selectedOperation?.startsWith("NG")) {
  //   ngBalance = ngBalance - formAmount - formCharge;
  // }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateTransactionHistory,
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

  const onSubmit = async (values: SimBalanceDto) => {
    await mutateAsync({ id: transaction.id, payload: values });
  };

  useEffect(() => {
    const autoCharge = setAutoCharge(selectedOperation, formAmount);
    form.setValue("charge", autoCharge);
  }, [selectedOperation, formAmount, form]);

  return (
    <Form {...form}>
      <div>{/* <h3 className="font-medium text-center">Phone: {phone}</h3> */}</div>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="operation"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Payment</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={onChange} {...fieldProps}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a payment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bkash</SelectLabel>
                    <SelectItem value={SIM_TRANSACTION_OPERATION.BK_SM}>
                      {SIM_TRANSACTION_OPERATION.BK_SM}
                    </SelectItem>
                    <SelectItem value={SIM_TRANSACTION_OPERATION.BK_CO}>
                      {SIM_TRANSACTION_OPERATION.BK_CO}
                    </SelectItem>
                    <SelectItem value={SIM_TRANSACTION_OPERATION.BK_MER}>
                      {SIM_TRANSACTION_OPERATION.BK_MER}
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Nagad</SelectLabel>
                    <SelectItem value={SIM_TRANSACTION_OPERATION.NG_SM}>
                      {SIM_TRANSACTION_OPERATION.NG_SM}
                    </SelectItem>
                    <SelectItem value={SIM_TRANSACTION_OPERATION.NG_CO}>
                      {SIM_TRANSACTION_OPERATION.NG_CO}
                    </SelectItem>
                    <SelectItem value={SIM_TRANSACTION_OPERATION.NG_MER}>
                      {SIM_TRANSACTION_OPERATION.NG_MER}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Amount</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter the amount"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") onChange(undefined);
                    else onChange(Number.parseFloat(value));
                  }}
                  {...fieldProps}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="charge"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Charge</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter the charge"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") onChange(undefined);
                    else onChange(Number.parseFloat(value));
                  }}
                  {...fieldProps}
                />
              </FormControl>
            </FormItem>
          )}
        />
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
        {/* <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1 rounded-md bg-muted p-2">
            <p>BKash Balance</p>
            <div className={cn(bkBalance < 0 && "text-red-500")}>{bkBalance}</div>
          </div>
          <div className="space-y-1 rounded-md bg-muted p-2">
            <p>Nagad Balance</p>
            <div className={cn(ngBalance < 0 && "text-red-500")}>{ngBalance}</div>
          </div>
        </div> */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
