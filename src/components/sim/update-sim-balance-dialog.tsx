"use client";

import { useState } from "react";

import { UpdateSimBalanceForm } from "@/components/sim/update-sim-balance-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UpdateSimBalanceDialogProps {
  deviceNo: number;
  simNo: number;
  phone: string;
  simId: number;
  bkBalance: number;
  ngBalance: number;
}

export function UpdateSimBalanceDialog({
  deviceNo,
  simNo,
  phone,
  simId,
  bkBalance,
  ngBalance,
}: UpdateSimBalanceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full py-2">Sim {simNo}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Edit Sim Balance - DS-{deviceNo} Sim {simNo}
          </DialogTitle>
        </DialogHeader>
        <UpdateSimBalanceForm
          phone={phone}
          simId={simId}
          bkBalance={bkBalance}
          ngBalance={ngBalance}
          close={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
