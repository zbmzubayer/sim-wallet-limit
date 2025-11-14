import { PlusIcon } from "lucide-react";

import { getAllUsers } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableProvider } from "@/components/ui/data-table/data-table-provider";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateUserForm } from "@/components/user/create-user-form";
import { userColumns } from "@/components/user/user-table-columns";

export default async function UserPage() {
  const users = await getAllUsers();

  return (
    <>
      <DialogProvider>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
            Create User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new user</DialogTitle>
            <DialogDescription>Fill in the details to create a new user account.</DialogDescription>
          </DialogHeader>
          <CreateUserForm />
        </DialogContent>
      </DialogProvider>

      <div className="mt-3 space-y-2">
        <DataTableProvider columns={userColumns} data={users}>
          <DataTable />
          <DataTablePagination />
        </DataTableProvider>
      </div>
    </>
  );
}
