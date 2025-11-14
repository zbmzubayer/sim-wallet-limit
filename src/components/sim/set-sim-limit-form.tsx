"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { setSimLimits } from "@/actions/sim.action";
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
import { Spinner } from "@/components/ui/spinner";
import type { SimLimit } from "@/types";
import { type SetSimLimitDto, setSimLimitSchema } from "@/validations/sim.dto";

interface SetSimLimitFormProps {
  limits: SimLimit;
  close: () => void;
}

export function SetSimLimitForm({ limits, close }: SetSimLimitFormProps) {
  const form = useForm({
    resolver: zodResolver(setSimLimitSchema),
    defaultValues: {
      bkSMLimit: limits.bkSMLimit,
      bkCOLimit: limits.bkCOLimit,
      ngSMLimit: limits.ngSMLimit,
      ngCOLimit: limits.ngCOLimit,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: setSimLimits,
    onSuccess: () => {
      toast.success("Sim limits updated successfully");
      close();
    },
    onError: (error) => {
      toast.error("Failed to update sim limits", {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: SetSimLimitDto) => {
    await mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="bkSMLimit"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>BK SM Limit</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter the amount"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") onChange("");
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
          name="bkCOLimit"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>BK CO Limit</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter the amount"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") onChange("");
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
          name="ngSMLimit"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>NG SM Limit</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter the amount"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") onChange("");
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
          name="ngCOLimit"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>NG CO Limit</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter the amount"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") onChange("");
                    else onChange(Number.parseFloat(value));
                  }}
                  {...fieldProps}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
