"use server";

import { revalidatePath } from "next/cache";

import {
  SIM_TRANSACTION_OPERATION,
  SIM_TRANSACTION_TYPE,
} from "@/enums/sim.enum";
import type { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import type { SimBalanceDto } from "@/validations/sim.dto";

export const updateSimBalance = async ({
  id,
  payload,
}: {
  id: number;
  payload: SimBalanceDto;
}) => {
  const { operation, amount, charge } = payload;
  const simUpdateData: Prisma.SimUncheckedUpdateInput = {};
  const total = amount + charge;

  if (operation === SIM_TRANSACTION_OPERATION.BK_SM) {
    simUpdateData.bkBalance = { decrement: total };
    simUpdateData.bkSM = { increment: total };
    simUpdateData.bkTotalSM = { increment: total };
  } else if (operation === SIM_TRANSACTION_OPERATION.BK_CO) {
    simUpdateData.bkBalance = { decrement: total };
    simUpdateData.bkCO = { increment: total };
    simUpdateData.bkTotalCO = { increment: total };
  } else if (operation === SIM_TRANSACTION_OPERATION.BK_MER) {
    simUpdateData.bkBalance = { decrement: total };
    simUpdateData.bkMER = { increment: total };
    simUpdateData.bkTotalMER = { increment: total };
  } else if (operation === SIM_TRANSACTION_OPERATION.NG_SM) {
    simUpdateData.ngBalance = { decrement: total };
    simUpdateData.ngSM = { increment: total };
    simUpdateData.ngTotalSM = { increment: total };
  } else if (operation === SIM_TRANSACTION_OPERATION.NG_CO) {
    simUpdateData.ngBalance = { decrement: total };
    simUpdateData.ngCO = { increment: total };
    simUpdateData.ngTotalCO = { increment: total };
  } else if (operation === SIM_TRANSACTION_OPERATION.NG_MER) {
    simUpdateData.ngBalance = { decrement: total };
    simUpdateData.ngMER = { increment: total };
    simUpdateData.ngTotalMER = { increment: total };
  }

  return await prisma.$transaction(async (tx) => {
    await Promise.all([
      tx.sim.update({ where: { id }, data: simUpdateData }),
      tx.simTransactionHistory.create({
        data: { simId: id, type: SIM_TRANSACTION_TYPE.OUT, ...payload },
      }),
    ]);

    revalidatePath("/");

    return true;
  });
};

export const getTransactionHistoryBySimId = async (simId: number) => {
  return await prisma.simTransactionHistory.findMany({
    where: { simId },
    orderBy: { id: "desc" },
  });
};

export const clearSimTransactionHistoryBySimId = async (simId: number) => {
  return await prisma.$transaction(async (tx) => {
    await Promise.all([
      tx.sim.update({
        where: { id: simId },
        data: {
          bkBalance: 0,
          ngBalance: 0,
          bkSM: 0,
          bkCO: 0,
          bkMER: 0,
          ngSM: 0,
          ngCO: 0,
          ngMER: 0,
          bkTotalSM: 0,
          bkTotalCO: 0,
          bkTotalMER: 0,
          ngTotalSM: 0,
          ngTotalCO: 0,
          ngTotalMER: 0,
        },
      }),
      tx.simTransactionHistory.deleteMany({
        where: { simId },
      }),
    ]);

    revalidatePath("/");

    return true;
  });
};

export const clearAllSimTransactionHistories = async () => {
  return await prisma.$transaction(async (tx) => {
    await Promise.all([
      tx.sim.updateMany({
        data: {
          bkBalance: 0,
          ngBalance: 0,
          bkSM: 0,
          bkCO: 0,
          bkMER: 0,
          ngSM: 0,
          ngCO: 0,
          ngMER: 0,
          bkTotalSM: 0,
          bkTotalCO: 0,
          bkTotalMER: 0,
          ngTotalSM: 0,
          ngTotalCO: 0,
          ngTotalMER: 0,
        },
      }),
      tx.simTransactionHistory.deleteMany(),
    ]);

    revalidatePath("/");

    return true;
  });
};
