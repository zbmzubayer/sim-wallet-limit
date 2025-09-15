"use client";

import { Logout } from "@/components/auth/logout";
import { ClearAllTransactionHistoryAlertDialog } from "@/components/sim/clear-all-transaction-history-alert-dialog";

export function Header() {
  return (
    <header className="border-b h-16 flex items-center">
      <div className="container flex items-center justify-between">
        <div className="text-lg font-bold tracking-tight">Sim Wallet Limit</div>
        <ClearAllTransactionHistoryAlertDialog />
        <Logout />
      </div>
    </header>
  );
}
