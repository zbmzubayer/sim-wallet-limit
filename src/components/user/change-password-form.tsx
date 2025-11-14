"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { changePassword } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputPassword } from "@/components/ui/input-password";
import { Spinner } from "@/components/ui/spinner";
import { type ChangePasswordDto, changePasswordSchema } from "@/validations/user.dto";

export function ChangePasswordForm({ close }: { close: () => void }) {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      close();
    },
    onError: (error) => {
      toast.error("Failed to change password", {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: ChangePasswordDto) => {
    await mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Current Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <InputPassword placeholder="Enter your current password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>New Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <InputPassword placeholder="Enter your new password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Confirm New Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <InputPassword placeholder="Confirm your new password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            Change Password
          </Button>
        </div>
      </form>
    </Form>
  );
}
