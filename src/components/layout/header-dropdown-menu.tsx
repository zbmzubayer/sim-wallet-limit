"use client";

import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { SetSimLimitForm } from "@/components/sim/set-sim-limit-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangePasswordForm } from "@/components/user/change-password-form";
import { type SimLimit, USER_ROLE } from "@/types";

interface HeaderDropdownMenuProps {
  limits: SimLimit;
  user: Session["user"];
}

export function HeaderDropdownMenu({ limits, user }: HeaderDropdownMenuProps) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [setSimLimitOpen, setSetSimLimitOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/sim">Sims</Link>
          </DropdownMenuItem>
          {user.role === USER_ROLE.superAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/user">Users</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setSetSimLimitOpen(true)}>
            Set Sim Limit
          </DropdownMenuItem>
          {user.role === USER_ROLE.admin && (
            <DropdownMenuItem onSelect={() => setChangePasswordOpen(true)}>
              Change password
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={async () => await signOut({ callbackUrl: "/" })}
          >
            <LogOutIcon className="text-destructive" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={setSimLimitOpen} onOpenChange={setSetSimLimitOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Set Sim Limit</DialogTitle>
            <DialogDescription>Set the transaction limits for SIMs here.</DialogDescription>
          </DialogHeader>

          <SetSimLimitForm limits={limits} close={() => setSetSimLimitOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Change your account password here.</DialogDescription>
          </DialogHeader>
          <ChangePasswordForm close={() => setChangePasswordOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
