"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateSimBalance } from "@/actions/sim.action";
import { Button } from "@/components/ui/button";
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
import { SIM_TRANSACTION_OPERATION } from "@/enums/sim.enum";
import { cn } from "@/lib/cn";
import { getQueryClient } from "@/lib/get-query-client";
import { type SimBalanceDto, simBalanceSchema } from "@/validations/sim.dto";

interface UpdateSimBalanceFormProps {
  phone: string;
  simId: number;
  bkBalance: number;
  ngBalance: number;
  close: () => void;
}

export function UpdateSimBalanceForm({
  phone,
  simId,
  bkBalance,
  ngBalance,
  close,
}: UpdateSimBalanceFormProps) {
  const queryClient = getQueryClient();
  const form = useForm({
    resolver: zodResolver(simBalanceSchema),
    defaultValues: { note: "" },
  });

  const selectedOperation = form.watch("operation");
  const formAmount = form.watch("amount") ?? 0;
  const formCharge = form.watch("charge") ?? 0;

  if (selectedOperation?.startsWith("BK")) {
    bkBalance = bkBalance - formAmount - formCharge;
  } else if (selectedOperation?.startsWith("NG")) {
    ngBalance = ngBalance - formAmount - formCharge;
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateSimBalance,
    onSuccess: () => {
      toast.success("Balance updated successfully");
      close();
      queryClient.invalidateQueries({ queryKey: [simId] });
    },
    onError: (error) => {
      toast.error("Failed to update balance", {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: SimBalanceDto) => {
    await mutateAsync({ id: simId, payload: values });
  };

  return (
    <Form {...form}>
      <div>
        <h3 className="font-medium text-center">Phone: {phone}</h3>
      </div>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="operation"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Payment</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange}>
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
                    else onChange(Number.parseInt(value, 10));
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
                    else onChange(Number.parseInt(value, 10));
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
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1 rounded-md bg-muted p-2">
            <p>BKash Balance</p>
            <div className={cn(bkBalance < 0 && "text-red-500")}>{bkBalance}</div>
          </div>
          <div className="space-y-1 rounded-md bg-muted p-2">
            <p>Nagad Balance</p>
            <div className={cn(ngBalance < 0 && "text-red-500")}>{ngBalance}</div>
          </div>
        </div>
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
