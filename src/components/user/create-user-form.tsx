"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createUser } from "@/actions/user.action";
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
import { Spinner } from "@/components/ui/spinner";
import { type CreateUserDto, createUserSchema } from "@/validations/user.dto";

export function CreateUserForm() {
  const { setOpen } = useDialog();
  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { username: "", password: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully");
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create user", {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: CreateUserDto) => {
    await mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Username</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter a username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter a password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            Create User
          </Button>
        </div>
      </form>
    </Form>
  );
}
