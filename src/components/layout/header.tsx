import Link from "next/link";

import { getSimLimits } from "@/actions/sim.action";
import auth from "@/auth";
import { HeaderDropdownMenu } from "@/components/layout/header-dropdown-menu";
import { ClearAllTransactionHistoryAlertDialog } from "@/components/sim/clear-all-transaction-history-alert-dialog";

export async function Header() {
  const session = await auth();
  const limits = await getSimLimits();

  if (!session?.user) {
    return null;
  }

  return (
    <header className="border-b py-2 flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Sim Wallet Limit
        </Link>
        <ClearAllTransactionHistoryAlertDialog />
        <HeaderDropdownMenu limits={limits} user={session.user} />
      </div>
    </header>
  );
}
