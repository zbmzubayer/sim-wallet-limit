"use client";

import { useMutation } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { deleteUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "@/components/ui/delete-alert-dialog";
import type { UserTableData } from "@/types/chat";

export const userColumns: ColumnDef<UserTableData>[] = [
  {
    accessorKey: "id",
    header: "User ID",
    enableSorting: false,
  },
  {
    accessorKey: "username",
    header: "Username",
    enableSorting: false,
  },
  {
    accessorKey: "password",
    header: "Password",
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Create Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    enableSorting: false,
  },
  {
    accessorKey: "Actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const { mutateAsync } = useMutation({
        mutationFn: () => deleteUser(row.original.id),
        onSuccess: () => {
          toast.success("User deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete user");
        },
      });

      return (
        <div className="flex justify-center gap-2">
          {/* <DialogProvider>
            <DialogTrigger asChild>
              <Button className="size-8" variant="outline">
                <EditIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Change the user details below.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </DialogProvider> */}

          <DeleteAlertDialog onConfirm={async () => await mutateAsync()}>
            <Button className="size-8" variant="destructive">
              <TrashIcon />
            </Button>
          </DeleteAlertDialog>
        </div>
      );
    },
    enableSorting: false,
  },
];
