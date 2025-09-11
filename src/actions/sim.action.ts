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
  await prisma.sim.update({ where: { id }, data: {} });
};
